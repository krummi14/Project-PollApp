import { Component, input } from '@angular/core';
import { DeleteButton } from '../../shared/delete-button/delete-button';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AddNewAnswerButton } from '../add-new-answer-button/add-new-answer-button';
import { getAnswerLabel as getAnswerLabelIndex } from '../../shared/utils/answer-label';

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
  readonly getAnswerLabel = getAnswerLabelIndex;

  addAnswer() {
    this.answers.push(new FormControl('', Validators.required));
  }

  get answers() {
    return this.questionForm().controls.answers;
  }

  delete(field: string, index?: number) {
    switch (field) {
      case 'question':
        this.questionForm().controls.question.reset('');
        break;
      case 'answers':
        if (index !== undefined) {
          const answerControl = this.answers.at(index);

          if (answerControl.value?.trim()) {
            answerControl.reset('');
          } else {
            this.answers.removeAt(index);
          }
        } else {
          this.answers.clear();
          this.answers.push(new FormControl('', Validators.required));
        }

        break;
    }
  }
}
