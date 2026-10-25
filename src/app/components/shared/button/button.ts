import { Component, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})

export class Button {
  private readonly router = inject(Router);
  path = this.router.url;
}
