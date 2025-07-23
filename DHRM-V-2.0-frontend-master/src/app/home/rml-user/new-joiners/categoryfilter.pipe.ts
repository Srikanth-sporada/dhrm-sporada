import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryfilter'
})
export class CategoryfilterPipe implements PipeTransform {

  transform(value: any[], age: any): any[] {
    console.log(value)
    return value.filter((item)=>{
      return item.age_limit<=age
    })
  }

}
