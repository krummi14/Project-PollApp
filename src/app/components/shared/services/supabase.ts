
import { Injectable, OnDestroy, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

import { Surveytemplate } from '../templates/surveytemplate';
import { SurveyResponse } from '../interfaces/survey-response';
import { mergeSurveyResponses } from '../utils/survey-response';
import { Survey } from '../interfaces/survey';

interface SurveyResponseRow {
  survey_id: number;
  responses: SurveyResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService implements OnDestroy {

  private readonly supabase = createClient(
    'https://ginbpssplhilfajizmmq.supabase.co',
    'sb_publishable_FPS7bmj0U0UBx14i6DkH0A_PFQoXvUe',
  );

  readonly surveys = signal<Survey[]>([]);
  readonly surveyResponses = signal<Record<number, SurveyResponse | null>>({});

  private readonly channel: RealtimeChannel;

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

  ngOnDestroy(): void {
    this.supabase.removeChannel(this.channel);
  }

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

  async createSurvey(survey: Surveytemplate): Promise<void> {
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
  }

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
