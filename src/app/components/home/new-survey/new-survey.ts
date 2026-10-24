import { Component } from '@angular/core';
import { Animation } from '../animation/animation';
import { IntroText } from '../intro-text/intro-text';

@Component({
  selector: 'app-new-survey',
  imports: [IntroText, Animation],
  templateUrl: './new-survey.html',
  styleUrl: './new-survey.scss',
})
export class NewSurvey {}
