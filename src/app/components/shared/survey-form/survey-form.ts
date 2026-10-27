import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Button } from '../button/button';
import { AddNewQuestion, QuestionForm } from '../add-new-question/add-new-question';
import { DeleteButton } from '../delete-button/delete-button';
import { SecondButton } from '../second-button/second-button';

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
    description: new FormControl(''),
    question: new FormArray([this.createQuestionForm()]),
  });

  readonly questions = this.surveyForm.controls.question;

  onSubmit() {
    console.log(this.surveyForm.value);
    this.surveyForm.controls.name.reset('');
    this.surveyForm.controls.date.reset(new Date(2023, 4, 11));
    this.surveyForm.controls.description.reset('');
    this.questions.clear();
    this.questions.push(this.createQuestionForm());
    this.surveyForm.markAsPristine();
    this.surveyForm.markAsUntouched();
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
}
