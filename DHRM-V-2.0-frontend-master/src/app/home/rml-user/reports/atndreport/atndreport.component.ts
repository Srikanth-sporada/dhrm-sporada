import { Component, OnInit } from "@angular/core";
import * as XLSX from 'xlsx';
import * as moment from "moment";
import { ApiService } from "src/app/home/api.service";


@Component({
  selector: "app-atndreport",
  templateUrl: "./atndreport.component.html",
  styleUrls: ["./atndreport.component.css"],
})
export class AtndreportComponent implements OnInit {
  date: any = moment().format("yyyy-MM");
  displayDate:any=moment().format("MM-yyyy");
  plant: any;
  plantlist: any;
  isadmin: any;
  genid: any = "";
  noOfDays: any = moment(this.date, "yyyy-MM").daysInMonth();
  atndData: any[];
  categories: any[];
  cat: any = "";
  selectedLine: any='';
  lines: any;
  constructor(private api: ApiService) {}

  ngOnInit() {
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    this.plant = plantCode;

    this.api.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
      },
      error: (error) => console.log(error),
    });
    this.getData();
    this.api.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
    this.api.getlineBydept().subscribe((response: any) => {
      this.lines = response;
    
    });
  }

  getData() {
    let data = {
      plant: this.plant,
      id: this.genid,
      year: this.date.split("-")[0],
      month: this.date.split("-")[1],
    };
    this.api.atndReport(data).subscribe((response: any) => {
      
      if ((response.status = "success")) {
        this.atndData = response.data;
        this.displayDate=moment(this.date, "yyyy-MM")
      } else {
        alert(response.message);
      }
    });
  }

  submit(){
    this.noOfDays=moment(this.date, "yyyy-MM").daysInMonth();
    this.getData()
  }

  exportexcel() {
    const x = document.querySelector("#atnddata")
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Table');
    XLSX.writeFile(wb, 'Attendance Data.xlsx');
  }


  
}
