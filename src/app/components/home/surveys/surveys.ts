import { Component } from '@angular/core';
import { Overview } from './overview/overview';
import { AreEndingSoon } from './are-ending-soon/are-ending-soon';

/** Section of the home page containing the survey overview and the surveys ending soon. */
@Component({
  selector: 'app-surveys',
  imports: [Overview, AreEndingSoon],
  templateUrl: './surveys.html',
  styleUrl: './surveys.scss',
})
export class Surveys {}
