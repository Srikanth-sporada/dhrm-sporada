import { Component, OnInit } from "@angular/core";
import{Location} from '@angular/common'
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatSidenav } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import * as XLSX from "xlsx"; 
import { FormControl } from "@angular/forms";
import { ApiService } from "src/app/home/api.service";

const material = [MatSidenav, MatTableModule];

import { MatDatepicker } from "@angular/material/datepicker";
import * as _moment from "moment";
import { Moment } from "moment";

const moment = _moment;

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
  selector: "app-dept",
  templateUrl: "./monthly-planning.component.html",
  styleUrls: ["./monthly-planning.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MonthlyPlanningComponent implements OnInit {
  date = new FormControl(moment());
  month: any;
  year: any;
  data:any;
  constructor(private route:ActivatedRoute,private router:Router,private location: Location,private apiService:ApiService) {}
  ngOnInit(): void {
    this.month=this.date.value?.month()
    this.month=this.month+1
    this.year=this.date.getRawValue()?.year()
    this.getData()
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

  naviagToUpload() {
    this.router.navigate(['/rml','people-planning','upload'])
  }

  getData(){
    let data={
      plantcode:sessionStorage.getItem('plantcode'),
      month:this.month,
      year:this.year
    }
    this.apiService.people_planning(data).subscribe((response:any)=>{
      if(response.status='success'){
        this.data=response.data
      }else{
        alert(response.message)
      }
    })
  }

  

  // gen(event:any, i:any)
  // {
  //   this.questions[i].genl_reqd = event.target.value

  //   this.questions[i].total_reqd = Number(this.questions[i].shift1_reqd == undefined ? 0: this.questions[i].shift1_reqd)
  //    +Number(this.questions[i].shift2_reqd  == undefined ? 0: this.questions[i].shift2_reqd)
  //   +Number(this.questions[i].shift3_reqd  == undefined ? 0: this.questions[i].shift3_reqd)
  //   +Number(this.questions[i].genl_reqd  == undefined ? 0: this.questions[i].genl_reqd)

  //   console.log(this.questions[i])
  // }
  // total(i:any)
  // {
  //   this.questions[i].total_reqd = Number(this.questions[i].shift1_reqd) +Number(this.questions[i].shift2_reqd)
  //   +Number(this.questions[i].shift3_reqd) +Number(this.questions[i].genl_reqd)

  //   console.log(this.questions)

  // }
  // shift1(event:any, i:any)
  // {
  //   this.questions[i].shift1_reqd = event.target.value

  //   this.questions[i].total_reqd = Number(this.questions[i].shift1_reqd == undefined ? 0: this.questions[i].shift1_reqd)
  //    +Number(this.questions[i].shift2_reqd  == undefined ? 0: this.questions[i].shift2_reqd)
  //   +Number(this.questions[i].shift3_reqd  == undefined ? 0: this.questions[i].shift3_reqd)
  //   +Number(this.questions[i].genl_reqd  == undefined ? 0: this.questions[i].genl_reqd)

  //   console.log(this.questions[i])
  // }
  // shift2(event:any, i:any)
  // {
  //   this.questions[i].shift2_reqd = event.target.value

  //   this.questions[i].total_reqd = Number(this.questions[i].shift1_reqd == undefined ? 0: this.questions[i].shift1_reqd)
  //    +Number(this.questions[i].shift2_reqd  == undefined ? 0: this.questions[i].shift2_reqd)
  //   +Number(this.questions[i].shift3_reqd  == undefined ? 0: this.questions[i].shift3_reqd)
  //   +Number(this.questions[i].genl_reqd  == undefined ? 0: this.questions[i].genl_reqd)

  //   console.log(this.questions[i])
  // }
  // shift3(event:any, i:any)
  // {
  //   this.questions[i].shift3_reqd = event.target.value

  //   this.questions[i].total_reqd = Number(this.questions[i].shift1_reqd == undefined ? 0: this.questions[i].shift1_reqd)
  //    +Number(this.questions[i].shift2_reqd  == undefined ? 0: this.questions[i].shift2_reqd)
  //   +Number(this.questions[i].shift3_reqd  == undefined ? 0: this.questions[i].shift3_reqd)
  //   +Number(this.questions[i].genl_reqd  == undefined ? 0: this.questions[i].genl_reqd)

  //   console.log(this.questions[i])
  // }

  // addrow(i:any)
  // {
  //       if(i == this.questions.length-1)
  //       {
  //         this.questions.push({})
  //         this.inserted += 1;
  //       }
  // }
}
