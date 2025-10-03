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
import * as _moment from "moment";
import { Moment } from "moment";
const moment = _moment;
import { FormControl } from "@angular/forms";
import * as XLSX from 'xlsx';
import { ApiService } from "src/app/home/api.service";
import { Router } from "@angular/router";

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
  date = new FormControl(moment());
  month: any;
  year: any;
  row:any[];
  data:any[];
  constructor(private apiService:ApiService,private router:Router) {}

  ngOnInit() {
    this.month=this.date.value?.month()
    this.month=this.month+1
    this.year=this.date.getRawValue()?.year()
  }
  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue: any = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.month = normalizedMonthAndYear.month();
    this.month=this.month+1
    this.year = normalizedMonthAndYear.year();
    this.date.setValue(ctrlValue);
    datepicker.close();
    console.log(this.month, this.year);
  }

  fileUpload(event:any){
    const selectedFile = event.target.files[0]
    const fileReader =new FileReader()
    fileReader.readAsBinaryString(selectedFile)
    fileReader.onload=(event:any)=>{
   
      let binaryData= event.target.result;
      let workbook=XLSX.read(binaryData,{type:'binary'})
      let sheetname = workbook.SheetNames[0]
      if(sheetname =='People'){
        let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname])
        this.data=data
        console.log(this.data)
      }else{
        alert('People sheet is not avilable in work book')
      }
      
    }
  }

  download(){
    let data={
      plantcode:sessionStorage.getItem('plantcode'),
      month:this.month,
      year:this.year
    }
    this.apiService.people_planning(data).subscribe((response:any)=>{
      if(response.status='success'){
        this.exportexcel(response.data)
      }else{
        alert(response.message)
      }
    })
  }

  exportexcel(data: any) {
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.writeFile(wb, `People planning ${this.month}-${this.year}.xlsx`);
  }

  upload(){
    let data={
      pmpd:this.data,
      plant:sessionStorage.getItem('plantcode'),
      month:this.month,
      year:this.year
    }
    this.apiService.people_planning_save(data).subscribe((response:any)=>{
      if(response.status='success'){
        alert(`Data Uploaded successfully for month ${this.month}-${this.year}`)
        this.router.navigate(['/rml','people-planning','monthly'])
      }else{
        alert('Update failed please Contack Admin')
      }
    })
    
  }

  display(){
    this.row=this.data
  }
}
