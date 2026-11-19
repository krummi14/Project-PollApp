import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateNewSurveyTemplate } from './components/create-new-survey-template/create-new-survey-template';
import { Dialog } from './components/shared/services/dialog';

/**
 * Root component of the application.
 *
 * @remarks
 * Contains the `RouterOutlet` and shows the dialog for creating a new survey
 * depending on the state of the {@link Dialog} service.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateNewSurveyTemplate],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Title of the application. */
  protected readonly title = signal('pollapp');
  /** Service controlling the "Create new survey" dialog. */
  readonly dialog = inject(Dialog);
}
