import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'andToCharPipe',
})
export class AndToCharPipePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/And/g, ' & ');
  }
}
