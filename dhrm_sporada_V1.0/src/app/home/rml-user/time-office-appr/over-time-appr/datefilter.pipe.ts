import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "datefilter",
})
export class DatefilterPipe implements PipeTransform {
  transform(items: any, date: any): any {
    // format date for filter
    date = moment(date).format('YYYY-MM-DD')
    console.log(date)
    if (!items) {
      return [];
    }
    // if date is empty a return all data
    if (!date||date=='') {
      return items;
    }
    return items.filter((item:any) => {
      return item.att_date == date || item.ot_dt ==date 
    });
  }
}
