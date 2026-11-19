import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that appends a question mark to a text if it does not already end with one.
 *
 * @example
 * ```html
 * {{ 'How are you' | addQuestionMark }} <!-- How are you? -->
 * ```
 */
@Pipe({
  name: 'addQuestionMark',
})
export class AddQuestionMarkPipe implements PipeTransform {
  /**
   * @param question - The question text
   * @returns The question text ending with a question mark
   */
  transform(question: string): string {
    return question.endsWith('?') ? question : `${question}?`;
  }
}
