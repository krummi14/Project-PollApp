import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../shared/services/supabase';
import { Survey } from '../../shared/interfaces/survey';
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
  readonly surveyId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly dbService = inject(SupabaseService);
  readonly survey = signal<Survey | undefined>(undefined);
  readonly surveyResponseForm = new FormGroup<Record<string, FormControl<boolean>>>({});
  readonly getAnswerLabel = getAnswerLabelIndex;
  readonly isSurveyAvailable = isSurveyAvailable;

  async ngOnInit() {
    const surveys = await this.dbService.getAllSurveys() ?? [];
    const survey = surveys.find(
      (item) => String(item.id) == this.surveyId
    );
    if (!survey) {
      return;
    }
    this.survey.set(survey);
    for (const [questionIndex, question] of survey.questions.entries()) {
      for (const answerIndex of question.answers.keys()) {
        this.surveyResponseForm.addControl(
          this.getControlName(questionIndex, answerIndex),
          new FormControl(false, { nonNullable: true }),
        );
      }
    }
  }

  async onSubmit() {
    const survey = this.survey();
    if (survey?.id == undefined) {
      throw new Error('Survey was not found.');
    }
    if (!this.isSurveyAvailable(survey.date)) {
      throw new Error('This survey has ended and can no longer be completed.');
    }
    const surveyResponse = new SurveyResponseTemplate(survey, this.surveyResponseForm.getRawValue());
    await this.dbService.submitSurveyResponse(survey.id, surveyResponse);
  }

  deselectOtherAnswers(questionIndex: number, selectedAnswerIndex: number, multipleChoice: boolean, answerCount: number, isSelected: boolean) {
    if (multipleChoice || !isSelected) return;
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
