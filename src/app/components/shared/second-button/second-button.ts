import { Component, input } from '@angular/core';

/** Reusable secondary button. */
@Component({
  selector: 'app-second-button',
  imports: [],
  templateUrl: './second-button.html',
  styleUrl: './second-button.scss',
})
export class SecondButton {
  /** HTML type of the button. */
  readonly type = input<'button' | 'submit'>('button');
}
