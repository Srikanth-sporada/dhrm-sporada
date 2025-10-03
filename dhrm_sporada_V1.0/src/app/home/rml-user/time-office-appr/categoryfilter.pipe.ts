import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "categoryfilter",
})
export class CategoryfilterPipe implements PipeTransform {
  transform(value: any, category: any, dept: any): any {
    if (!value) {
      return [];
    }
    if (category == "All" && dept == "All") {
      console.log(1)
      return value;
    } else if (category != "All" && dept == "All") {
      console.log(2)
      return value.filter((item: any) => {
        return item.apprentice_type == category;
      });
    } else if (category == "All" && dept != "All") {
      console.log(3)
      return value.filter((item: any) => {
        return item.dept_name == dept;
      });
    } else if (category != "All" && dept != "All") {
      console.log(4)
      return value.filter((item: any) => {
        return item.dept_name == dept && item.apprentice_type == category;
      });
    }
  }
}
