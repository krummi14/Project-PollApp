import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addQuestionMark',
})
export class AddQuestionMarkPipe implements PipeTransform {
  transform(question: string): string {
    return question.endsWith('?') ? question : `${question}?`;
  }
}
