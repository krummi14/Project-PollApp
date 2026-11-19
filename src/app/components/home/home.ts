import { Component, inject } from '@angular/core';
import { Header } from './header/header';
import { NewSurvey } from './new-survey/new-survey';
import { Surveys } from './surveys/surveys';
import { SupabaseService } from '../shared/services/supabase';
import { Dialog } from '../shared/services/dialog';

/**
 * Home page of the application.
 *
 * @remarks
 * Loads all surveys on creation and provides the entry point
 * for creating a new survey.
 */
@Component({
  selector: 'app-home',
  imports: [Header, NewSurvey, Surveys],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  /** Whether the dialog for creating a survey is open. */
  isCreateSurveyDialogOpen = false;
  /** Service for accessing the Supabase database. */
  dbService = inject(SupabaseService);
  /** Service controlling the "Create new survey" dialog. */
  readonly dialog = inject(Dialog);

  /** Loads all surveys when the component is created. */
  constructor() {
    this.dbService.getAllSurveys();
  }

  /** Opens the dialog for creating a new survey. */
  openCreateSurveyDialog() {
    this.dialog.openCreateSurveyDialog();
  }
}
