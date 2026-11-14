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

    const surveyResponse = new SurveyResponseTemplate(survey, this.surveyResponseForm.getRawValue());
    await this.dbService.submitSurveyResponse(survey.id, surveyResponse);
  }

  getControlName(questionIndex: number, answerIndex: number): string {
    return SurveyResponseTemplate.getControlName(questionIndex, answerIndex);
  }
}
