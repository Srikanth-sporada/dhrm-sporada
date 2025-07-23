import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'code'
})
export class CodePipe implements PipeTransform {

  transform(value: any, code: any): any {
    if (!value) {
      return [];
    }
    if (!code) {
      return value;
    }
    const filterdata =  value.filter((data:any)=>{
      return data.mat_code.includes(code)
    })
    return filterdata
  }

}
