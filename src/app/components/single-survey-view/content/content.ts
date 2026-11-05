import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Supabase } from '../../shared/services/supabase';
import { Survey } from '../../shared/interfaces/survey';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AddQuestionMarkPipe } from '../../shared/pipes/add-question-mark-pipe';
import { SecondButton } from '../../shared/second-button/second-button';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-content',
  imports: [CapitalizePipe, AddQuestionMarkPipe, SecondButton, ReactiveFormsModule],
  templateUrl: './content.html',
  styleUrl: './content.scss',
})
export class Content {
  readonly surveyId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly dbService = inject(Supabase);
  readonly survey = signal<Survey | undefined>(undefined);
  readonly surveyResponseForm = new FormGroup<Record<string, FormControl<boolean>>>({});

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  async ngOnInit() {
    const surveys = await this.dbService.getSurveys() ?? [];
    const survey = surveys.find((item) => String(item.id) == this.surveyId);
    if (survey) {
      survey.questions = JSON.parse(survey.questions as any);
      this.survey.set(survey);
      for (const [questionIndex, question] of (survey?.questions ?? []).entries()) {
        for (const answerIndex of question.answers.keys()) {
          this.surveyResponseForm.addControl(
            this.getControlName(questionIndex, answerIndex),
            new FormControl(false, { nonNullable: true }),
          );
        }
      }
    }
  }

  async onSubmit() {
    const survey = this.survey();
    if (survey?.id == undefined) {
      throw new Error('Survey was not found.');
    }
    await this.dbService.submitVote(survey.id, this.surveyResponseForm.getRawValue());
  }

  getControlName(questionIndex: number, answerIndex: number): string {
    return `question${questionIndex}Answer${answerIndex}`;
  }
}
