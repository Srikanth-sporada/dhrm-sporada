import { Component, OnInit } from "@angular/core";
import { isToday } from "date-fns";
import * as moment from "moment";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-musterreport",
  templateUrl: "./musterreport.component.html",
  styleUrls: ["./musterreport.component.css"],
})
export class MusterreportComponent implements OnInit {
  from: any;
  to: any;
  toMax: any;
  toMin: any;
  frommax:any=moment(new Date()).format("YYYY-MM-DD")
  constructor(private apiService: ApiService) {}

  ngOnInit() {}
  onchange() {
    this.toMin = this.from;
    let date = new Date(this.from);
    date.setDate(date.getDate() + 7);
    let today = new Date();
    if (date > today) {
      this.toMax = moment(today).format("YYYY-MM-DD");
      this.to = moment(today).format("YYYY-MM-DD")
    } else {
      this.toMax = moment(date).format("YYYY-MM-DD");
      this.to = moment(date).format("YYYY-MM-DD")
    }
    console.log(this.from,this.to)
  }

  onClick() {
    console.log(this.to,this.from)
    this.apiService
      .musterReport(this.from, this.to)
      .subscribe((response: any) => {
        console.log(response);
        if (response.status == "failed") {
          alert(response.message);
        } else {
          let data = response.data.map((element: any) => {
            return {
              ...element,
              InTime: this.getTime(element["InTime"]),
              OutTime: this.getTime(element["OutTime"]),
              Date: moment(element["Date"]).format("DD-MM-YYY"),
            };
          });
          this.exportexcel(data);
        }
      });
  }

  exportexcel(data: any) {
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Muster Report");
    XLSX.writeFile(wb, "Muster-report.xlsx");
  }
  getTime(time: any) {
    let temp_time = time.split("T")[1].split(".")[0];
    return temp_time;
  }
}
