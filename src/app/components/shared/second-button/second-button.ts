import { Component, input } from '@angular/core';

@Component({
  selector: 'app-second-button',
  imports: [],
  templateUrl: './second-button.html',
  styleUrl: './second-button.scss',
})
export class SecondButton {
  readonly type = input<'button' | 'submit'>('button');
}
