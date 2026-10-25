import { Component } from '@angular/core';
import { SecondButton } from '../../shared/second-button/second-button';

@Component({
  selector: 'app-header',
  imports: [SecondButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
