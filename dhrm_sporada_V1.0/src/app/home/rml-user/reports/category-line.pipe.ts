import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "categoryline",
})
export class CategoryLinePipe implements PipeTransform {
  transform(value: any, category: any, line: any): any {
    if (!value) {
      return [];
    }
    console.log(line)
    if (category == "All" && line == "All") {
      return value;
    } else if (category != "All" && line == "All") {
      return value.filter((item: any) => {
        return item.apprentice_type == category;
      });
    } else if (category == "All" && line != "All") {
      return value.filter((item: any) => {
        console.log(item.Line_Name, line)
        return item.Line_Name == line;
      });
    } else if (category != "All" && line != "All") {
      return value.filter((item: any) => {
        return item.Line_Name == line && item.apprentice_type == category;
      });
    }
  }
}
