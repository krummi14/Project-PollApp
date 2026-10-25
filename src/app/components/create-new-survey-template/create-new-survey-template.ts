import { Component, output } from '@angular/core';
import { Header } from './header/header';
import { SurveyForm } from '../shared/survey-form/survey-form';

@Component({
  selector: 'app-create-new-survey-template',
  imports: [Header, SurveyForm],
  templateUrl: './create-new-survey-template.html',
  styleUrl: './create-new-survey-template.scss',
})
export class CreateNewSurveyTemplate {
  readonly close = output<void>();
}
