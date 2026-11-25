import { Component } from '@angular/core';
import { Animation } from '../animation/animation';

/** Introduction text of the home page with a button for creating a survey. */
@Component({
  selector: 'app-intro-text',
  imports: [Animation],
  templateUrl: './intro-text.html',
  styleUrl: './intro-text.scss',
})
export class IntroText {
}
