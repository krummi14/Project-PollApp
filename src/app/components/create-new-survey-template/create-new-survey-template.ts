import { Component } from '@angular/core';
import { SecondButton } from '../shared/second-button/second-button';
import { Button } from '../shared/button/button';

@Component({
  selector: 'app-create-new-survey-template',
  imports: [SecondButton, Button],
  templateUrl: './create-new-survey-template.html',
  styleUrl: './create-new-survey-template.scss',
})
export class CreateNewSurveyTemplate { }
