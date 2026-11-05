import { Component, inject } from '@angular/core';
import { Header } from './header/header';
import { NewSurvey } from './new-survey/new-survey';
import { Surveys } from './surveys/surveys';
import { Supabase } from '../shared/services/supabase';
import { Dialog } from '../shared/services/dialog';

@Component({
  selector: 'app-home',
  imports: [Header, NewSurvey, Surveys],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  isCreateSurveyDialogOpen = false;
  dbService = inject(Supabase);
  readonly dialog = inject(Dialog);

  constructor() {
    this.dbService.getSurveys();
  }

  openCreateSurveyDialog() {
    this.dialog.openCreateSurveyDialog();
  }
}
