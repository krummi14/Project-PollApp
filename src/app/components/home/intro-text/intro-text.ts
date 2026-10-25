import { Component, output } from '@angular/core';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-intro-text',
  imports: [Button],
  templateUrl: './intro-text.html',
  styleUrl: './intro-text.scss',
})
export class IntroText {
  readonly createSurvey = output<void>();
}
