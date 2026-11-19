import { Component, output } from '@angular/core';

/** Button for adding another answer option to a question. */
@Component({
  selector: 'app-add-new-answer-button',
  imports: [],
  templateUrl: './add-new-answer-button.html',
  styleUrl: './add-new-answer-button.scss',
})
export class AddNewAnswerButton {
  /** Emitted when the user wants to add a new answer. */
  readonly add = output<void>();
}
