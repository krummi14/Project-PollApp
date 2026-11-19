import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that capitalizes the first letter of a text.
 *
 * @example
 * ```html
 * {{ 'survey' | capitalize }} <!-- Survey -->
 * ```
 */
@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  /**
   * @param value - The text to transform
   * @returns The text with a capitalized first letter, or the unchanged value if it is empty
   */
  transform(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
