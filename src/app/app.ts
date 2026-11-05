import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateNewSurveyTemplate } from './components/create-new-survey-template/create-new-survey-template';
import { Dialog } from './components/shared/services/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateNewSurveyTemplate],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pollapp');
  readonly dialog = inject(Dialog);
}
