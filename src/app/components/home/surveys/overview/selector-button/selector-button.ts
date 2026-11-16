import { Component, computed, input, model } from '@angular/core';

type SurveyStatus = 'active' | 'past';

@Component({
  selector: 'app-selector-button',
  imports: [],
  templateUrl: './selector-button.html',
  styleUrl: './selector-button.scss',
})
export class SelectorButton {
  readonly surveyStatus = input.required<SurveyStatus>();
  readonly selectedSurveyStatus = model.required<SurveyStatus>();
  readonly isSelected = computed(() => this.selectedSurveyStatus() == this.surveyStatus());

  protected selectSurveyStatus(): void {
    this.selectedSurveyStatus.set(this.surveyStatus());
  }
}
