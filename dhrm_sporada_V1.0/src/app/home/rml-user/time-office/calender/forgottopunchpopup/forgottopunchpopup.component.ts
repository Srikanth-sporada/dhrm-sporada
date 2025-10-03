import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import { ApiService } from "src/app/home/api.service";
@Component({
  selector: "app-forgottopunchpopup",
  templateUrl: "./forgottopunchpopup.component.html",
  styleUrls: ["./forgottopunchpopup.component.css"],
})
export class ForgottopunchpopupComponent implements OnInit {
  constructor(
    private dailogRef: MatDialogRef<ForgottopunchpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService
  ) {}
  date: any;
  inDate:any
  intime: any;
  in_time: any;
  out_time: any;
  outTime: any;
  outDate: any;
  entered_in_time: any = "";
  entered_out_time: any = "";
  reason: any;

  MaxIn:any
  MinIn:any
  MinOut:any
  MaxOut:any
  submitBtn: any = true;
  reasonList:any[];
  ngOnInit() {
    
    this.api.getfpreasonArs().subscribe((res:any)=>{
      if(res.status='success'){
        console.log(res.data)
        this.reasonList=res.data
        this.reason=''
      }else{
        alert(res.message)
      }
      
    })
    this.date = moment(this.data.start).format("YYYY-MM-DD");
    if (this.data.in_time == null) {
      this.in_time = false;
    } else {
      this.in_time = true;

      // this.entered_in_time = this.data.in_time;
      // this.inDate= this.data.in_time.toISOString().slice(0, 10);
      // this.intime=this.data.in_time.toISOString().slice(1, 10);

      // console.log(' this.inDate', this.inDate);
      // console.log(' this.intime', this.intime);
      

      const maxOutTime = new Date(this.date);
      maxOutTime.setDate(maxOutTime.getDate() + 1);
      this.MaxOut = maxOutTime.toISOString().slice(0, 10);
    
      const minOutTime = new Date(this.date);
      minOutTime.setDate(minOutTime.getDate() );
      // this.MinOut = minOutTime.toISOString().slice(0, 16);
      this.MinOut = this.date
  
  
      const maxInTime = new Date(this.date);
      maxInTime.setDate(maxInTime.getDate() );
      // this.MaxIn = maxInTime.toISOString().slice(0, 16);
      this.MaxIn = this.date
    
      const minInTime = new Date(this.date);
      minInTime.setDate(minInTime.getDate() -1);
      this.MinIn = minInTime.toISOString().slice(0, 10);
      
    }
    if (this.data.out_time == null) {
      this.out_time = false;
    } else {
      this.out_time = true;
      this.entered_out_time = this.data.out_time;
    

      const maxOutTime = new Date(this.date);
      maxOutTime.setDate(maxOutTime.getDate() + 1);
      this.MaxOut = maxOutTime.toISOString().slice(0, 10);
    
      const minOutTime = new Date(this.date);
      minOutTime.setDate(minOutTime.getDate() );
      // this.MinOut = minOutTime.toISOString().slice(0, 16);
      this.MinOut = this.date
  
  
  
      const maxInTime = new Date(this.date);
      maxInTime.setDate(maxInTime.getDate() );
      // this.MaxIn = maxInTime.toISOString().slice(0, 16);
      this.MaxIn = this.date
    
      const minInTime = new Date(this.date);
      minInTime.setDate(minInTime.getDate() -1);
      this.MinIn = minInTime.toISOString().slice(0, 10);

    }
  }


  checkVerify_1() {
    console.log("check");
   


    console.log(this.date);
    
    const maxOutTime = new Date(this.date);
    maxOutTime.setDate(maxOutTime.getDate() + 1);
    this.MaxOut = maxOutTime.toISOString().slice(0, 10);
  
    const minOutTime = new Date(this.date);
    minOutTime.setDate(minOutTime.getDate() );
    // this.MinOut = minOutTime.toISOString().slice(0, 16);
    this.MinOut = this.date



    const maxInTime = new Date(this.date);
    maxInTime.setDate(maxInTime.getDate() );
    // this.MaxIn = maxInTime.toISOString().slice(0, 16);
    this.MaxIn = this.date
  
    const minInTime = new Date(this.date);
    minInTime.setDate(minInTime.getDate() -1);
    this.MinIn = minInTime.toISOString().slice(0, 10);
    
    
  }

  submit() {
    let data: any;
     console.log('intime',`${this.inDate} ${this.intime}`);
    console.log('outtime',`${this.outDate} ${this.outTime}`);
    if (!this.in_time && !this.out_time) {
      data = {
        // in_time: this.entered_in_time,
        in_time: `${this.inDate} ${this.intime}`,
        out_time:`${this.outDate} ${this.outTime}`,
        // out_time: this.entered_out_time,
        apln_slno: sessionStorage.getItem("user_name"),
        date: this.date,
        reason: this.reason,
      };
    } else if (this.in_time) {
      data = {
        out_time:`${this.outDate} ${this.outTime}`,
        apln_slno: sessionStorage.getItem("user_name"),
        date: this.date,
        reason: this.reason,
      };
    } else if (this.out_time) {
      data = {
        in_time:`${this.inDate} ${this.intime}`,
        apln_slno: sessionStorage.getItem("user_name"),
        date: this.date,
        reason: this.reason,
      };
    }
    
    this.api.forgottopunchapply(data).subscribe((res:any)=>{
      if(res.status=='success'){
        alert(res.message)
        this.dailogRef.close() 
      }else if(res.status == 'failed'){
        alert(res.message)
      }
    })
  }

  onchange() {
    if (

       // console.log('intime',`${this.inDate} ${this.intime}`);
    // console.log('outtime',`${this.outDate} ${this.outTime}`);

    ( ( this.inDate != "" && this.intime != "") || ( this.outDate != "" && this.outTime != "") )
     &&
      this.reason != ""
    ) {
      this.submitBtn = false;
    } else {
      this.submitBtn = true;
    }
  }
}
