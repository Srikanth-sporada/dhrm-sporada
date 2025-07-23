import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineFilter'
})
export class LineFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
