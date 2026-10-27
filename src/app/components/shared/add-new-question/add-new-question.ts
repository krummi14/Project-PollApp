import { Component, input } from '@angular/core';
import { DeleteButton } from '../delete-button/delete-button';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AddNewAnswerButton } from '../add-new-answer-button/add-new-answer-button';

export type QuestionForm = FormGroup<{
  question: FormControl<string | null>;
  multipleChoice: FormControl<boolean | null>;
  answers: FormArray<FormControl<string | null>>;
}>;

@Component({
  selector: 'app-add-new-question',
  imports: [DeleteButton, ReactiveFormsModule, AddNewAnswerButton],
  templateUrl: './add-new-question.html',
  styleUrl: './add-new-question.scss',
})
export class AddNewQuestion {
  readonly questionForm = input.required<QuestionForm>();
  readonly questionNumber = input.required<number>();
  readonly answerOpportunities = ["A", "B", "C", "D", "E", "F"];

  addAnswer() {
    if (this.answers.controls.length < this.answerOpportunities.length) {
      this.answers.push(new FormControl(''));
    }
  }

  get answers() {
    return this.questionForm().controls.answers;
  }
}
