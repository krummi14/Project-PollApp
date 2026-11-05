import { Component, inject } from '@angular/core';
import { Button } from '../shared/button/button';
import { Dialog } from '../shared/services/dialog';
import { Content } from './content/content';
import { Results } from './results/results';

@Component({
  selector: 'app-single-survey-view',
  imports: [Button, Content, Results],
  templateUrl: './single-survey-view.html',
  styleUrl: './single-survey-view.scss',
})
export class SingleSurveyView {
  readonly dialog = inject(Dialog);
}
