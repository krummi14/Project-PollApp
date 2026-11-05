import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  readonly openedCreateSurveyDialog = signal(false);

  openCreateSurveyDialog() {
    this.openedCreateSurveyDialog.set(true);
  }

  closeCreateSurveyDialog() {
    this.openedCreateSurveyDialog.set(false);
  }
}
