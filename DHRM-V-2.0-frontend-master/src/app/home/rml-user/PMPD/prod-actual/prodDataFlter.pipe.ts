import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "prodDataFlter",
})
export class ProdDataFlterPipe implements PipeTransform {
  transform(value: any, plant: any, code: any): any {
    console.log(code)
    if (!value) {
      return value;
    }

    if (plant == "" && code == "") {
      return value;
    }

    if (plant != "" && code == "") {
      return value.filter((item: any) => {
        return item.plant == plant;
      });
    }
    if (plant == "" && code != "") {
      return value.filter((item: any) => {
        console.log(item.mat_code == code)
        return item.mat_code.includes(code)
      });
    }
    if (plant != "" && code != "") {
      return value.filter((item: any) => {
        return item.mat_code.includes(code) && item.plant == plant;
      });
    }
  }
}
