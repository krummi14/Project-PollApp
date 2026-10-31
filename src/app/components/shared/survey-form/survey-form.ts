import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Button } from '../button/button';
import { AddNewQuestion, QuestionForm } from '../add-new-question/add-new-question';
import { DeleteButton } from '../delete-button/delete-button';
import { SecondButton } from '../second-button/second-button';
import { Supabase } from '../services/supabase';
import { Surveytemplate } from '../templates/surveytemplate';

@Component({
  selector: 'app-survey-form',
  imports: [Button, AddNewQuestion, ReactiveFormsModule, DeleteButton, SecondButton],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})

export class SurveyForm {
  surveyForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(new Date(2026, 10, 25)),
    category: new FormControl(''),
    description: new FormControl(''),
    question: new FormArray([this.createQuestionForm()]),
  });

  readonly questions = this.surveyForm.controls.question;
  surveyService: Supabase = inject(Supabase);

  async onSubmit() {
    if (this.surveyForm.valid) {
      const value = this.surveyForm.getRawValue();
      const surveyData = new Surveytemplate({
        name: value.name ?? '',
        date: value.date ?? new Date(2023, 4, 11),
        category: value.category ?? '',
        description: value.description ?? '',
        questions: value.question.map((question) => ({
          question: question.question ?? '',
          multipleChoice: question.multipleChoice ?? false,
          answers: question.answers.map((answer) => answer ?? ''),
        })),
      });

      await this.surveyService.saveSurvey(surveyData);

      this.surveyForm.controls.name.reset('');
      this.surveyForm.controls.date.reset(new Date(2023, 4, 11));
      this.surveyForm.controls.description.reset('');
      this.questions.clear();
      this.questions.push(this.createQuestionForm());
      this.surveyForm.markAsPristine();
      this.surveyForm.markAsUntouched();
    }
  }

  addQuestion() {
    this.questions.push(this.createQuestionForm());
  }

  private createQuestionForm(): QuestionForm {
    return new FormGroup({
      question: new FormControl(''),
      multipleChoice: new FormControl(false),
      answers: new FormArray([
        new FormControl(''),
        new FormControl(''),
      ]),
    });
  }

  delete(field: string) {
    switch (field) {
      case 'name':
        this.surveyForm.controls.name.reset('');
        break;
      case 'date':
        this.surveyForm.controls.date.reset(new Date(2023, 4, 11));
        break;
      case 'describing':
        this.surveyForm.controls.description.reset('');
        break;
      default:
        break;
    }
  }
}
