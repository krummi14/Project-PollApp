import { Component, input } from '@angular/core';
import { DeleteButton } from '../../shared/delete-button/delete-button';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AddNewAnswerButton } from '../add-new-answer-button/add-new-answer-button';
import { getAnswerLabel as getAnswerLabelIndex } from '../../shared/utils/answer-label';

/**
 * Typed form group for a single question of a survey.
 *
 * @remarks
 * - `question` – Question text
 * - `multipleChoice` – Whether multiple answers may be selected
 * - `answers` – List of answer options
 */
export type QuestionForm = FormGroup<{
  question: FormControl<string | null>;
  multipleChoice: FormControl<boolean | null>;
  answers: FormArray<FormControl<string | null>>;
}>;

/**
 * Component for editing a single question including its answer options
 * in the form for creating a new survey.
 */
@Component({
  selector: 'app-add-new-question',
  imports: [DeleteButton, ReactiveFormsModule, AddNewAnswerButton],
  templateUrl: './add-new-question.html',
  styleUrl: './add-new-question.scss',
})
export class AddNewQuestion {
  /** Form group of the question, passed in by the parent component. */
  readonly questionForm = input.required<QuestionForm>();
  /** Sequential number of the question, displayed in the template. */
  readonly questionNumber = input.required<number>();
  /** Returns the letter (A, B, C, …) for an answer index. */
  readonly getAnswerLabel = getAnswerLabelIndex;

  /** Adds a new, empty, required answer option to the question. */
  addAnswer() {
    this.answers.push(new FormControl('', Validators.required));
  }

  /**
   * Returns the `FormArray` containing the answer options of the question.
   *
   * @returns The answer controls of the current question
   */
  get answers() {
    return this.questionForm().controls.answers;
  }

  /**
   * Clears or removes fields of the question.
   *
   * @remarks
   * - `'question'` – Resets the question text.
   * - `'answers'` with `index` – Clears the answer if it contains text,
   *   otherwise removes the answer.
   * - `'answers'` without `index` – Removes all answers and adds a new empty answer.
   *
   * @param field - Name of the field to clear (`'question'` or `'answers'`)
   * @param index - Optional index of the affected answer
   */
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
