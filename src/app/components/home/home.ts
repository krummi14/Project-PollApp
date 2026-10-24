import { Component } from '@angular/core';
import { Header } from './header/header';
import { NewSurvey } from './new-survey/new-survey';
import { Surveys } from './surveys/surveys';

@Component({
  selector: 'app-home',
  imports: [Header, NewSurvey, Surveys],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home { }
