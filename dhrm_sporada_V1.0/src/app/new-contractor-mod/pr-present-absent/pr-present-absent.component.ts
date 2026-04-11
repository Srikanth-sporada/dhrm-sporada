import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { ApiService } from "src/app/home/api.service";

@Component({
  selector: 'app-pr-present-absent',
  templateUrl: './pr-present-absent.component.html',
  styleUrls: ['./pr-present-absent.component.css']
})
export class PrPresentAbsentComponent implements OnInit {
  date: any = moment().format("yyyy-MM");
  displayDate: any = moment().format("MM-yyyy");
  plant: any;
  plantlist: any;
  isadmin: any;
  genid: any = "";
  noOfDays: any = moment(this.date, "yyyy-MM").daysInMonth();
  atndData: any[];
  cat: any = "";
  selectedLine: any = '';
  lines: any;
  filteredData: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
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

  // this.api.pieceatndReport(data).subscribe((response: any) => {
  //   if (response.status === "success") {
  //     this.atndData = response.data;
  //     this.displayDate = moment(this.date, "yyyy-MM");

  //     // Apply filter here
  //     this.filteredData = this.atndData.filter(item => {
  //       let matchCat = this.cat ? item.apprentice_type === this.cat : true;
  //       let matchLine = this.selectedLine ? item.Line_Name === this.selectedLine : true;
  //       return matchCat && matchLine;
  //     });
  //   } else {
  //     alert(response.message);
  //   }
  // });
}

submit() {
  this.noOfDays = moment(this.date, "yyyy-MM").daysInMonth();
  this.getData();
}

  exportexcel() {
    const year = parseInt(this.date.split("-")[0], 10);
    const month = parseInt(this.date.split("-")[1], 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Build header order
    const headers = [
      "SL no",
      "Gen Id",
      "Punch ID",
      "Name",
      "Category",
      "Department",
      "Contract_Name"
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      headers.push(day.toString()); // add "1", "2", "3", etc.
    }

    // Map data
    const formattedData = this.atndData.map((row, index) => {
      const newRow:any = {
        "SL no": index + 1,
        "Gen Id": row.gen_id,
        "Punch ID": row.biometric_no,
        "Name": row.fullname,
        "Category": row.apprentice_type,
        "Department": row.dept_name,
        "Contract_Name": row.Cont_company_name
      };

      for (let day = 1; day <= daysInMonth; day++) {
        newRow[day.toString()] = row[day] || "";
      }

      return newRow;
    });

    // Create worksheet with explicit header order
    const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');

    // Save file
    XLSX.writeFile(wb, 'Attendance Data.xlsx');
  }

}
