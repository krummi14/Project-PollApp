import { Component, inject } from '@angular/core';
import { Header } from './header/header';
import { NewSurvey } from './new-survey/new-survey';
import { Surveys } from './surveys/surveys';
import { SupabaseService } from '../shared/services/supabase';
import { Dialog } from '../shared/services/dialog';

@Component({
  selector: 'app-home',
  imports: [Header, NewSurvey, Surveys],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  isCreateSurveyDialogOpen = false;
  dbService = inject(SupabaseService);
  readonly dialog = inject(Dialog);

  constructor() {
    this.dbService.getAllSurveys();
  }

  openCreateSurveyDialog() {
    this.dialog.openCreateSurveyDialog();
  }
}
