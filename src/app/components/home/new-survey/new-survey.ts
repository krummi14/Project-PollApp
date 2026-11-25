import { Component, output } from '@angular/core';
import { Animation } from '../animation/animation';
import { IntroText } from '../intro-text/intro-text';
import { Button } from '../../shared/button/button';

/** Section of the home page combining the introduction text and the animation. */
@Component({
  selector: 'app-new-survey',
  imports: [IntroText, Animation, Button],
  templateUrl: './new-survey.html',
  styleUrl: './new-survey.scss',
})
export class NewSurvey {
  /** Emitted when the user wants to create a new survey. */
  readonly createSurvey = output<void>();
}
