import { Component, inject } from '@angular/core';
import { Header } from './header/header';
import { NewSurvey } from './new-survey/new-survey';
import { Surveys } from './surveys/surveys';
import { CreateNewSurveyTemplate } from '../create-new-survey-template/create-new-survey-template';
import { Supabase } from '../shared/services/supabase';

@Component({
  selector: 'app-home',
  imports: [Header, NewSurvey, Surveys, CreateNewSurveyTemplate],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  isCreateSurveyDialogOpen = false;
  dbService = inject(Supabase);

  constructor() {
    this.dbService.getSurveys();
  }
}
