import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'swipid'
})
export class SwipidPipe implements PipeTransform {

  transform(value: any, id: any): any {
    if (!value) {
      return [];
    }
    if (!id) {
      return value;
    }
    const filterdata =  value.filter((data:any)=>{
      return data.punchID==id
    })
    return filterdata
  }

}
