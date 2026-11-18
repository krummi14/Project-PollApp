
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../shared/services/supabase';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AddQuestionMarkPipe } from '../../shared/pipes/add-question-mark-pipe';
import { SecondButton } from '../../shared/second-button/second-button';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { SurveyResponseTemplate } from '../../shared/templates/survey-response-model';
import { getAnswerLabel as getAnswerLabelIndex } from '../../shared/utils/answer-label';
import { isSurveyAvailable } from '../../shared/utils/ends-in-days';

@Component({
  selector: 'app-content',
  imports: [CapitalizePipe, AddQuestionMarkPipe, SecondButton, ReactiveFormsModule],
  templateUrl: './content.html',
  styleUrl: './content.scss',
})
export class Content {

  private readonly route = inject(ActivatedRoute);
  readonly dbService = inject(SupabaseService);
  readonly router = inject(Router);
  readonly surveyId = Number(this.route.snapshot.paramMap.get('id'));
  readonly survey = computed(() => this.dbService.surveys().find(item => item.id == this.surveyId));
  readonly surveyResponseForm = new FormGroup<Record<string, FormControl<boolean>>>({});
  readonly getAnswerLabel = getAnswerLabelIndex;
  readonly isSurveyAvailable = isSurveyAvailable;
  readonly isSurveyCompleted = signal(false);

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

  getControlName(questionIndex: number, answerIndex: number): string {
    return SurveyResponseTemplate.getControlName(questionIndex, answerIndex);
  }
}
