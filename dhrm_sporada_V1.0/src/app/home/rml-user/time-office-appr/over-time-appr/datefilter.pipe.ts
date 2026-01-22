import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

@Pipe({
  name: "datefilter",
})
export class DatefilterPipe implements PipeTransform {
  transform(items: any, date: any): any {
    // console.log('FILTER DATE',date , items)
    if (!items) {
      return [];
    }
    // if date is empty a return all data
    if (!date || date=='') {
      return items;
    }else{
      // format date for filter
    date = moment(date).format('YYYY-MM-DD');
     return items.filter((item:any) => {
      return item.att_date == date || item.ot_dt ==date 
    });
    }
   
  }
}
