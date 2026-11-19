import { Component, input } from '@angular/core';

/** Progress bar, e.g. for displaying voting results. */
@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  /** Current value. */
  readonly value = input.required<number>();
  /** Maximum value. */
  readonly max = input.required<number>();
}
