import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { AddNewQuestion } from '../add-new-question/add-new-question';

@Component({
  selector: 'app-survey-form',
  imports: [Button, AddNewQuestion, ReactiveFormsModule],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})

export class SurveyForm {
  surveyForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(new Date(2026, 10, 25)),
    describtion: new FormControl('')
  });

  onSubmit() {
    console.log("Das Formular wurde mit folgenden Infos ausgefüllt:", this.surveyForm.value);
  }
}
