import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Surveytemplate } from '../templates/surveytemplate';
import { SurveyResponse } from '../interfaces/survey-response';
import { mergeSurveyResponses } from '../utils/survey-response';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  supabaseUrl = 'https://ginbpssplhilfajizmmq.supabase.co';
  supabaseKey = 'sb_publishable_FPS7bmj0U0UBx14i6DkH0A_PFQoXvUe';
  private readonly supabase = createClient(this.supabaseUrl, this.supabaseKey);

  async getAllSurveys() {
    let { data, error } = await this.supabase.from('surveys').select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async createSurvey(survey: Surveytemplate) {
    const { data, error } = await this.supabase
      .from('surveys')
      .insert(survey)
      .select('id')
      .single();
    if (error) {
      throw error;
    }

    const { error: responseError } = await this.supabase
      .from('survey_responses')
      .insert({
        survey_id: data.id,
        responses: null,
      });
    if (responseError) {
      throw responseError;
    }
  }

  async submitSurveyResponse(id: number, newResponse: SurveyResponse) {
    const { data, error: selectError } = await this.supabase
      .from('survey_responses')
      .select('responses')
      .eq('survey_id', id)
      .single();
    if (selectError) {
      throw selectError;
    }
    const mergedResponse = mergeSurveyResponses(data.responses, newResponse);
    const { error } = await this.supabase
      .from('survey_responses')
      .update({
        responses: mergedResponse,
      })
      .eq('survey_id', id);
    if (error) {
      throw error;
    }
  }
}

