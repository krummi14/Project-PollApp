import { Injectable, signal } from '@angular/core';

/** Service for globally controlling the "Create new survey" dialog. */
@Injectable({
  providedIn: 'root',
})
export class Dialog {
  /** Whether the dialog is open. */
  readonly openedCreateSurveyDialog = signal(false);

  /** Opens the dialog. */
  openCreateSurveyDialog() {
    this.openedCreateSurveyDialog.set(true);
  }

  /** Closes the dialog. */
  closeCreateSurveyDialog() {
    this.openedCreateSurveyDialog.set(false);
  }
}
