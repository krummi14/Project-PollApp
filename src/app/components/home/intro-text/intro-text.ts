import { Component } from '@angular/core';
import { Button } from '../../shared/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-intro-text',
  imports: [Button, RouterLink],
  templateUrl: './intro-text.html',
  styleUrl: './intro-text.scss',
})
export class IntroText {
  path = "";
}
