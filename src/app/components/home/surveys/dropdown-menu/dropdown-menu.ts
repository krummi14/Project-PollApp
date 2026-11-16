import { Component, output } from '@angular/core';
import { SURVEY_CATEGORIES } from '../../../shared/utils/survey-categories';

@Component({
  selector: 'app-dropdown-menu',
  imports: [],
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.scss',
})
export class DropdownMenu {
  readonly categories = SURVEY_CATEGORIES;
  readonly categorySelected = output<string>();

  handleCategoryChange(event: Event) {
    this.categorySelected.emit((event.target as HTMLSelectElement).value);
  }
}
