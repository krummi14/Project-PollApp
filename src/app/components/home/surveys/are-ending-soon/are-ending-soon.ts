import { Component } from '@angular/core';
import { EndingSurvey } from './ending-survey/ending-survey';

@Component({
  selector: 'app-are-ending-soon',
  imports: [EndingSurvey],
  templateUrl: './are-ending-soon.html',
  styleUrl: './are-ending-soon.scss',
})
export class AreEndingSoon {}
