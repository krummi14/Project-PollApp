import { Component, input } from '@angular/core';

/** Reusable primary button. */
@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})

export class Button {
  /** Icon to display. */
  readonly icon = input<'plus' | 'check'>('plus');
  /** HTML type of the button. */
  readonly type = input<'button' | 'submit'>('button');
}
