import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { time } from "console";
import * as moment from "moment";
import { ApiService } from "src/app/home/api.service";
import {OtpopupComponent} from './otpopup/otpopup.component'
import {MatDialog} from '@angular/material/dialog'

@Component({
  selector: "app-over-time-appr",
  templateUrl: "./over-time-appr.component.html",
  styleUrls: ["./over-time-appr.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OverTimeApprComponent implements OnInit {
  data: any;
  date:any=''
  constructor(private apiService: ApiService,private dailog:MatDialog) {}

  ngOnInit(): void {
    this.getData()
  }

  getTime(time: any) {
    let temp_time = time.split("T")[1].split(".")[0];
    return temp_time
  }

  getData(){
    this.apiService.get_ot_details_supervisor().subscribe((res: any) => {
      if ((res.status = "success")) {
        this.data = res.data.map((element: any) => {
          this.getTime(element.in_time);
          return {
            ...element,
            in_time: this.getTime(element.in_time),
            out_time: this.getTime(element.out_time),
            att_date: moment(element.att_date).format("YYYY-MM-DD"),
          };
        });
        console.log(this.data)
      } else {
        alert(res.message);
      }
    });
  }

  openModel(dailogData:any){
    const otdailog=this.dailog.open(OtpopupComponent,{
      data:dailogData
    }).afterClosed().subscribe(()=>{
      this.getData()
    })
    
  }
}
