import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "datefilter",
})
export class DatefilterPipe implements PipeTransform {
  transform(items: any, date: any): any {
    if (!items) {
      return [];
    }
    if (!date||date=='') {
      return items;
    }
    return items.filter((item:any) => {
      return item.att_date == date || item.ot_dt ==date 
    });
  }
}
