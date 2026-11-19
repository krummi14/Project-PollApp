import { Component, output } from '@angular/core';
import { SecondButton } from '../../shared/second-button/second-button';

/** Header of the "Create new survey" dialog with a close button. */
@Component({
  selector: 'app-header',
  imports: [SecondButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  /** Emitted when the user wants to close the dialog. */
  readonly close = output<void>()
}
