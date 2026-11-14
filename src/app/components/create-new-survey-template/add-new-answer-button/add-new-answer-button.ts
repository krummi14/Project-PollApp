import { Component, output } from '@angular/core';

@Component({
  selector: 'app-add-new-answer-button',
  imports: [],
  templateUrl: './add-new-answer-button.html',
  styleUrl: './add-new-answer-button.scss',
})
export class AddNewAnswerButton {
  readonly add = output<void>();
}
