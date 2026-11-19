import { Component, output } from '@angular/core';
import { Header } from './header/header';
import { SurveyForm } from './survey-form/survey-form';

/**
 * Container component for creating a new survey.
 * Consists of a header and the survey form.
 */
@Component({
  selector: 'app-create-new-survey-template',
  imports: [Header, SurveyForm],
  templateUrl: './create-new-survey-template.html',
  styleUrl: './create-new-survey-template.scss',
})
export class CreateNewSurveyTemplate {
  /** Emitted when the dialog should be closed. */
  readonly close = output<void>();
}
