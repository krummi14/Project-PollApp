import { Component, output } from '@angular/core';
import { Button } from '../../shared/button/button';

/** Introduction text of the home page with a button for creating a survey. */
@Component({
  selector: 'app-intro-text',
  imports: [Button],
  templateUrl: './intro-text.html',
  styleUrl: './intro-text.scss',
})
export class IntroText {
  /** Emitted when the user wants to create a new survey. */
  readonly createSurvey = output<void>();
}
