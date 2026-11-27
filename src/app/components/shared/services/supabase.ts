
import { Injectable, OnDestroy, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

import { Surveytemplate } from '../templates/surveytemplate';
import { SurveyResponse } from '../interfaces/survey-response';
import { mergeSurveyResponses } from '../utils/survey-response';
import { Survey } from '../interfaces/survey';

/** Row of the `survey_responses` table. */
interface SurveyResponseRow {
  /** ID of the associated survey. */
  survey_id: number;
  /** Stored responses, or `null` if there are none yet. */
  responses: SurveyResponse | null;
}

/**
 * Service for accessing the Supabase database.
 *
 * @remarks
 * Holds surveys and responses as signals and subscribes to realtime changes
 * of the `surveys` and `survey_responses` tables, so the local state
 * stays in sync automatically.
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseService implements OnDestroy {

  /** Supabase client. */
  private readonly supabase = createClient(
    'https://ginbpssplhilfajizmmq.supabase.co',
    'sb_publishable_FPS7bmj0U0UBx14i6DkH0A_PFQoXvUe',
  );

  /** All known surveys. */
  readonly surveys = signal<Survey[]>([]);
  /** Responses per survey ID. */
  readonly surveyResponses = signal<Record<number, SurveyResponse | null>>({});

  /** Realtime channel for changes to surveys and responses. */
  private readonly channel: RealtimeChannel;

  /**
   * Creates the realtime channel and subscribes to changes of the
   * `surveys` and `survey_responses` tables.
   */
  constructor() {
    this.channel = this.supabase
      .channel('survey-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'surveys',
        },
        (payload) => {
          if (payload.eventType == 'DELETE') {
            const id = payload.old['id'];
            if (typeof id == 'number') {
              this.surveys.update((surveys) =>
                surveys.filter((survey) => survey.id != id),
              );
              this.surveyResponses.update((responses) => {
                const updated = { ...responses };
                delete updated[id];
                return updated;
              });
            }
            return;
          }
          this.upsertSurvey(payload.new as Survey);
        },
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'survey_responses',
        },
        (payload) => {
          if (payload.eventType == 'DELETE') {
            const id = payload.old['survey_id'];
            if (typeof id == 'number') {
              this.surveyResponses.update((responses) => {
                const updated = { ...responses };
                delete updated[id];
                return updated;
              });
            }
            return;
          }
          const response = payload.new as SurveyResponseRow;
          this.upsertSurveyResponse(
            response.survey_id,
            response.responses,
          );
        },
      )
      .subscribe();
  }

  /** Removes the realtime channel when the service is destroyed. */
  ngOnDestroy(): void {
    this.supabase.removeChannel(this.channel);
  }

  /**
   * Loads all surveys and their responses from the database and updates the signals.
   *
   * @returns All loaded surveys
   * @throws Supabase error if one of the queries fails
   */
  async getAllSurveys(): Promise<Survey[]> {
    const [surveyResult, responseResult] = await Promise.all([
      this.supabase
        .from('surveys')
        .select('*'),
      this.supabase
        .from('survey_responses')
        .select('survey_id, responses'),
    ]);

    if (surveyResult.error) {
      throw surveyResult.error;
    }
    if (responseResult.error) {
      throw responseResult.error;
    }

    const surveys = surveyResult.data as Survey[];
    const responses = responseResult.data as SurveyResponseRow[];
    this.surveys.set(surveys);
    const responseMap: Record<number, SurveyResponse | null> = {};
    for (const response of responses) {
      responseMap[response.survey_id] = response.responses;
    }
    this.surveyResponses.set(responseMap);
    return surveys;
  }

  /**
   * Saves a new survey and creates an empty response row for it.
   *
   * @param survey - The survey to save (an existing `id` is ignored)
   * @returns The saved survey including its generated `id`
   * @throws Supabase error if saving fails
   */
  async createSurvey(survey: Surveytemplate): Promise<Survey> {
    const { id, ...surveyData } = survey;
    const { data, error } = await this.supabase
      .from('surveys')
      .insert(surveyData)
      .select()
      .single();

    if (error) {
      throw error;
    }
    const newSurvey = data as Survey;
    this.upsertSurvey(newSurvey);
    const { error: responseError } = await this.supabase
      .from('survey_responses')
      .insert({
        survey_id: newSurvey.id,
        responses: null,
      });
    if (responseError) {
      throw responseError;
    }
    this.upsertSurveyResponse(newSurvey.id!, null);
    return newSurvey;
  }

  /**
   * Updates an existing survey.
   *
   * @param survey - The survey with updated data
   * @throws Error if the survey has no ID, or a Supabase error
   */
  async updateSurvey(survey: Survey): Promise<void> {
    if (survey.id == undefined) {
      throw new Error('Die Umfrage besitzt keine ID.');
    }
    const { id, ...surveyData } = survey;
    const { data, error } = await this.supabase
      .from('surveys')
      .update(surveyData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    this.upsertSurvey(data as Survey);
  }

  /**
   * Deletes a survey and removes it together with its responses from the local state.
   *
   * @param id - ID of the survey to delete
   * @throws Supabase error if deleting fails
   */
  async deleteSurvey(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('surveys')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    this.surveys.update((surveys) =>
      surveys.filter((survey) => survey.id != id),
    );

    this.surveyResponses.update((responses) => {
      const updated = { ...responses };
      delete updated[id];
      return updated;
    });
  }

  /**
   * Submits new responses to a survey.
   *
   * @remarks
   * The already stored responses are loaded, merged with the new responses
   * and then saved.
   *
   * @param id - ID of the survey
   * @param newResponse - The user's new responses
   * @throws Supabase error if loading or saving fails
   */
  async submitSurveyResponse(
    id: number,
    newResponse: SurveyResponse,
  ): Promise<void> {

    const { data, error: selectError } = await this.supabase
      .from('survey_responses')
      .select('responses')
      .eq('survey_id', id)
      .single();
    if (selectError) {
      throw selectError;
    }
    const mergedResponse = mergeSurveyResponses(
      data.responses as SurveyResponse | null,
      newResponse,
    );
    const { data: updatedData, error } = await this.supabase
      .from('survey_responses')
      .update({
        responses: mergedResponse,
      })
      .eq('survey_id', id)
      .select('responses')
      .single();

    if (error) {
      throw error;
    }
    this.upsertSurveyResponse(
      id,
      updatedData.responses as SurveyResponse,
    );
  }

  /**
   * Loads the responses to a survey and updates the local state.
   *
   * @param surveyId - ID of the survey
   * @returns The stored responses, or `null` if there are none
   * @throws Supabase error if the query fails
   */
  async getSurveyResponse(
    surveyId: number,
  ): Promise<SurveyResponse | null> {
    const { data, error } = await this.supabase
      .from('survey_responses')
      .select('responses')
      .eq('survey_id', surveyId)
      .maybeSingle();
    if (error) {
      throw error;
    }
    const response = data?.responses as SurveyResponse | null ?? null;
    this.upsertSurveyResponse(surveyId, response);
    return response;
  }

  /**
   * Inserts a survey into the local state or replaces an existing one with the same ID.
   * Surveys without an ID are ignored.
   *
   * @param updatedSurvey - The survey to insert or update
   */
  private upsertSurvey(updatedSurvey: Survey): void {
    if (updatedSurvey.id == undefined) {
      return;
    }
    this.surveys.update((surveys) => {
      const index = surveys.findIndex(
        (survey) => survey.id === updatedSurvey.id,
      );
      if (index == -1) {
        return [...surveys, updatedSurvey];
      }
      return surveys.map((survey, i) =>
        i == index ? updatedSurvey : survey,
      );
    });
  }

  /**
   * Sets the responses of a survey in the local state.
   *
   * @param surveyId - ID of the survey
   * @param response - The responses, or `null`
   */
  private upsertSurveyResponse(
    surveyId: number,
    response: SurveyResponse | null,
  ): void {
    this.surveyResponses.update((responses) => ({
      ...responses,
      [surveyId]: response,
    }));
  }
}
