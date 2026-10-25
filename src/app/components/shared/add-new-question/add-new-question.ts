import { Component } from '@angular/core';
import { SecondButton } from '../second-button/second-button';

@Component({
  selector: 'app-add-new-question',
  imports: [SecondButton],
  templateUrl: './add-new-question.html',
  styleUrl: './add-new-question.scss',
})
export class AddNewQuestion {
  questionNumber = 1;
  answerNumber = '';
  answersCount = 2;
  answerNumbers = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
  ];

  addQuestion() {
    this.answersCount++;
  }
}
