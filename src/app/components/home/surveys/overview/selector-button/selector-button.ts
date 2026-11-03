import { Component } from '@angular/core';

@Component({
  selector: 'app-selector-button',
  imports: [],
  templateUrl: './selector-button.html',
  styleUrl: './selector-button.scss',
})
export class SelectorButton {
  protected activatedButton = false;

  protected toggleButtonActivation(): void {
    this.activatedButton = !this.activatedButton;
  }
}
