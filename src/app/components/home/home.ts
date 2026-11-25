import { Component, inject, OnDestroy } from '@angular/core';
import { Header } from './header/header';
import { NewSurvey } from './new-survey/new-survey';
import { Surveys } from './surveys/surveys';
import { SupabaseService } from '../shared/services/supabase';
import { Dialog } from '../shared/services/dialog';
import { DOCUMENT } from '@angular/core';

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
export class Home implements OnDestroy {
  /** Whether the dialog for creating a survey is open. */
  isCreateSurveyDialogOpen = false;
  /** Service for accessing the Supabase database. */
  dbService = inject(SupabaseService);
  /** Service controlling the "Create new survey" dialog. */
  readonly dialog = inject(Dialog);
  private readonly document = inject(DOCUMENT);

  /** Loads all surveys when the component is created. */
  constructor() {
    this.dbService.getAllSurveys();
    this.document.body.classList.remove('home_page');
    this.document.body.classList.add('single_survey_page');
  }

  ngOnDestroy() {
    this.document.body.classList.remove('home_page');

  }

  /** Opens the dialog for creating a new survey. */
  openCreateSurveyDialog() {
    this.dialog.openCreateSurveyDialog();
  }
}
