
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../shared/services/supabase';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AddQuestionMarkPipe } from '../../shared/pipes/add-question-mark-pipe';
import { SecondButton } from '../../shared/second-button/second-button';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { SurveyResponseTemplate } from '../../shared/templates/survey-response-model';
import { getAnswerLabel as getAnswerLabelIndex } from '../../shared/utils/answer-label';
import { isSurveyAvailable } from '../../shared/utils/ends-in-days';
import { AndToCharPipePipe } from '../../shared/pipes/and-to-char-pipe-pipe';

/** Displays the questions of a survey and allows answering them. */
@Component({
  selector: 'app-content',
  imports: [CapitalizePipe, AddQuestionMarkPipe, SecondButton, ReactiveFormsModule, AndToCharPipePipe, RouterLink],
  templateUrl: './content.html',
  styleUrl: './content.scss',
})
export class Content {

  /** Current route used to read the survey ID. */
  private readonly route = inject(ActivatedRoute);
  /** Service for accessing the Supabase database. */
  readonly dbService = inject(SupabaseService);
  /** Router used for navigation after submitting. */
  readonly router = inject(Router);
  /** ID of the displayed survey from the `id` route parameter. */
  readonly surveyId = Number(this.route.snapshot.paramMap.get('id'));
  /** The displayed survey, or `undefined` if it was not found. */
  readonly survey = computed(() => this.dbService.surveys().find(item => item.id == this.surveyId));
  /** Form with one boolean control per answer option. */
  readonly surveyResponseForm = new FormGroup<Record<string, FormControl<boolean>>>({});
  /** Returns the letter (A, B, C, …) for an answer index. */
  readonly getAnswerLabel = getAnswerLabelIndex;
  /** Checks whether a survey is still available. */
  readonly isSurveyAvailable = isSurveyAvailable;
  /** Whether the survey has already been submitted. */
  readonly isSurveyCompleted = signal(false);

  /** Creates a form control for every answer option of the loaded survey. */
  private readonly formEffect = effect(() => {
    const survey = this.survey();
    if (!survey) {
      return;
    }
    for (const [questionIndex, question] of survey.questions.entries()) {
      for (const answerIndex of question.answers.keys()) {
        const controlName = this.getControlName(
          questionIndex,
          answerIndex
        );
        if (!this.surveyResponseForm.contains(controlName)) {
          this.surveyResponseForm.addControl(
            controlName,
            new FormControl(false, { nonNullable: true })
          );
        }
      }
    }
  });

  /**
   * Submits the responses of the survey.
   *
   * @remarks
   * If the survey has already been submitted, navigates to the home page instead.
   * After successful submission, the form is disabled.
   *
   * @throws Error if the survey was not found or has already ended
   */
  async onSubmit() {
    if (this.isSurveyCompleted()) {
      await this.router.navigateByUrl('/');
      return;
    }
    const survey = this.survey();
    if (survey?.id == undefined) {
      throw new Error('Survey was not found.');
    }
    if (!this.isSurveyAvailable(survey.date)) {
      throw new Error(
        'This survey has ended and can no longer be completed.'
      );
    }
    const surveyResponse = new SurveyResponseTemplate(
      survey,
      this.surveyResponseForm.getRawValue()
    );
    await this.dbService.submitSurveyResponse(
      survey.id,
      surveyResponse
    );
    this.surveyResponseForm.disable();
    this.isSurveyCompleted.set(true);
  }

  /**
   * Deselects all other answers for single-choice questions.
   *
   * @param questionIndex - Index of the question
   * @param selectedAnswerIndex - Index of the answer just selected
   * @param multipleChoice - Whether multiple answers are allowed
   * @param answerCount - Number of answer options
   * @param isSelected - Whether the answer was selected (rather than deselected)
   */
  deselectOtherAnswers(questionIndex: number, selectedAnswerIndex: number, multipleChoice: boolean, answerCount: number, isSelected: boolean) {
    if (multipleChoice || !isSelected) {
      return;
    }
    for (let answerIndex = 0; answerIndex < answerCount; answerIndex += 1) {
      if (answerIndex != selectedAnswerIndex) {
        this.surveyResponseForm.controls[
          this.getControlName(questionIndex, answerIndex)
        ].setValue(false);
      }
    }
  }

  /**
   * Builds the name of the form control for an answer.
   *
   * @param questionIndex - Index of the question
   * @param answerIndex - Index of the answer
   * @returns The control name
   */
  getControlName(questionIndex: number, answerIndex: number): string {
    return SurveyResponseTemplate.getControlName(questionIndex, answerIndex);
  }
}
