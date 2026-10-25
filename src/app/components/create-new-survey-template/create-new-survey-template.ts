import { Component } from '@angular/core';
import { Button } from '../shared/button/button';
import { Header } from './header/header';

@Component({
  selector: 'app-create-new-survey-template',
  imports: [Button, Header],
  templateUrl: './create-new-survey-template.html',
  styleUrl: './create-new-survey-template.scss',
})
export class CreateNewSurveyTemplate { }
