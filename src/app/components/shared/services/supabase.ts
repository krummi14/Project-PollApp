import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Surveytemplate } from '../templates/surveytemplate';

@Injectable({
  providedIn: 'root',
})
export class Supabase {

  supabaseUrl = 'https://ginbpssplhilfajizmmq.supabase.co';
  supabaseKey = 'sb_publishable_FPS7bmj0U0UBx14i6DkH0A_PFQoXvUe';
  private readonly supabase = createClient(this.supabaseUrl, this.supabaseKey);

  async getSurveys() {
    let { data, error } = await this.supabase.from('surveys').select('*');
    if (error) {
      throw error;
    }

    return data;
  }

  async saveSurvey(survey: Surveytemplate) {
    const { error } = await this.supabase.from('surveys').insert(survey);

    if (error) {
      throw error;
    }
  }
}

