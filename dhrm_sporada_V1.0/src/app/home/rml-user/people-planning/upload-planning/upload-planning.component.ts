import { Component, OnInit } from "@angular/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import moment from "moment";
import { FormControl } from "@angular/forms";
import * as XLSX from "xlsx";
import { ApiService } from "src/app/home/api.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY",
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "upload-planning",
  templateUrl: "./upload-planning.component.html",
  styleUrls: ["./upload-planning.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class UploadPlanningComponent implements OnInit {

  date = new FormControl();
  month: any;
  year: any;
  row: any[];
  data: any[];
  all:any;
  userDetails:any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService:MessageService
  ) {}

  ngOnInit() {
    /** User details */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails =
        this.all.Emp_Name.toUpperCase() +
        `(${this.all.User_Name})` +
        "-" +
        this.all.dept_name +
        "-" +
        this.all.plant_name;
    }
    this.date.setValue(moment().toDate())
    this.month = moment(this.date.value).month() + 1;
    this.year = moment(this.date.value).year();
  }

  setMonthAndYear() {
    const selectedDate = moment(this.date.value);
    this.month = selectedDate.month() + 1;
    this.year = selectedDate.year();
  }

  /**
   *  convert excel uploaded data to json
   * @property {any} data
   */
  fileUpload(event: any) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: "binary" });
      let sheetname = workbook.SheetNames[0];
      if (sheetname == "People") {
        let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname]);
        this.data = data;
        console.log('PP SHEET DATA:',this.data);
      } else {
        //alert("People sheet is not avilable in work book");
        this.messageService.add({severity:'warn',summary:'People sheet is not avilable in work book!'})
      }
    };
  }
  
  /** download template for people planning */
  download() {
    let data = {
      plantcode: sessionStorage.getItem("plantcode"),
      month: this.month,
      year: this.year,
    };
    this.apiService.people_planning(data).subscribe({
      next:(response: any) => {
        if ((response.status = "success")) {
          this.exportexcel(response.data);
        } else {
          this.messageService.add({severity:'error',summary:response?.message})
        }
      },
      error: (error:any) => {
        console.log('DOWNLOAD API ERROR PEOPLE PLANNING:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    });
  }
  /** 
   * export excel data
   * @param {any} data
   * */
  exportexcel(data: any) {
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.writeFile(wb, `People planning ${this.month}-${this.year}.xlsx`);
  }

  upload() {
    let data = {
      pmpd: this.data,
      plant: sessionStorage.getItem("plantcode"),
      month: this.month,
      year: this.year,
    };
    this.apiService.people_planning_save(data).subscribe({
      next: (response: any) => {
        if ((response.status = "success")) {
          // alert(`Data Uploaded successfully for month ${this.month}-${this.year}`);
          this.messageService.add({severity:'info',summary:`Data Uploaded successfully for month ${this.month}-${this.year}`})
          this.router.navigate(["/rhrm", "people-planning", "monthly"]);
        } else {
          // alert("Update failed please Contack Admin");
          this.messageService.add({severity:'warn',summary:'Oops! something went wrong'});
        }
      },
      error: (error:any) => {
        console.log('PP UPLOAD API ERROR:', error);
        this.messageService.add({severity:'error', summary:error?.error?.message})
      }
    });
  }

  display() {
    this.row = this.data;
  }
}
