import { Component, OnInit } from '@angular/core';
import {LoaderserviceService} from '../../loaderservice.service'
import {ClamAPIService} from '../clam-api.service'
import { DatePipe } from '@angular/common';
import { FormControl,FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';

import { DateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-shift-cancel',
  templateUrl: './shift-cancel.component.html',
  styleUrls: ['./shift-cancel.component.css']
})
export class ShiftCancelComponent implements OnInit {

  selected_Line:any=''
  selected_Date:any=''
  genId:any;
  shift:any;
  maxDate: Date;
  minDate: Date;
  currentDate:Date
  shiftCancel:any
  lineData:any
  shiftData:any
  NoshiftData:any
  presentShiftData:any
  punchData:any
  all: any = JSON.parse(sessionStorage.getItem('all')!);
  dept:any = this.all.Department
  Emp_slno:any = this.all.empl_slno
  plant_Code: any = sessionStorage.getItem('plantcode');
  isHr: any = sessionStorage.getItem('ishr');
  
  // Emp_slno: any = sessionStorage.getItem('empl_slno');

  selectedShifts: any[] = [];
  shift_id = new FormControl('');
  alt_shift_id = new FormControl('');



  presentShiftControl = new FormControl();
  alternateShiftControl = new FormControl();


  // selected_LineControl = new FormControl('');
  // selected_Date = new FormControl('');

  constructor(private dialog: MatDialog,private fb:FormBuilder,public loader: LoaderserviceService,private api:ClamAPIService,private dateAdapter: DateAdapter<Date>,private datePipe: DatePipe) { 
    this.dateAdapter.setLocale('en-GB');
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);

  }

  ngOnInit(): void {


   this.currentDate = new Date();
  
    this.selected_Date = this.currentDate.toISOString().split('T')[0];
this.getLine(this.plant_Code,this.dept,this.isHr)
this.getShift(this.plant_Code)
// this.getpunchData(this.plant_Code, '2023-07-12',this.dept,this.isHr)
this.getpunchData(this.plant_Code, this.selected_Date ,this.dept,this.isHr)

console.log(this.isHr)

  }

  onDateFilterChange(event: any): void {
    this.selected_Date = event.value;
    const formattedDate = this.datePipe.transform(this.selected_Date, 'yyyy-MM-dd');
    console.log(formattedDate);
    this.getpunchData(this.plant_Code, formattedDate, this.dept,this.isHr);
  }
  formatDateWithHr(inputDate: Date): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
    return formattedDate;
  }
  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }

  getLine( plant_Code:any,dept:any,hr:any){
    this.api.getLinebyplant(plant_Code,dept,hr).subscribe(res => {
      this.lineData=res;
      // console.log(this.lineData);
    },error=>{
      console.log(error)
    })
  }

  getShift( plant_Code:any){
    this.api.get_Shift(plant_Code).subscribe(res => {
this.shiftData =res
console.log(res)
console.log(this.shiftData)
this.NoshiftData =  this.shiftData.filter((item:any) =>item.shift_id !== 0)

    },error=>{
      console.log(error)
    })
  }

  getpunchData(plant_Code: any, date: any, dept: any, hr: any) {
    this.api.getrawShiftData(plant_Code, date, dept, hr).subscribe(
      (res: any) => {
        if (res.message) {
          // If a message exists in the response, display it
          this.punchData = null
          this.openAlertDialog(res.message, 'chcek');

        } else {
          // If no message, set punchData to the response data
          this.punchData = res;
          console.log(res);
        }
      },
      (error) => {
        if (error.status === 400) {
          console.log(error)
          this.openAlertDialog(`${error.error}`,'error');
         
        }
         else {
          this.openAlertDialog('Error in connection','error');
      
        }
    })
  }
  


  CancelShift(data:any){
    data.Cancel_by = this.Emp_slno;
    data.Cancel_date = this.formatDateWithHr(this.currentDate);
    data.Plant_code=this.plant_Code
console.log(data )
this.api.cancelShift(data).subscribe((res:any)=>{
  console.log(res)
  this.openAlertDialog(res,'check')
  const currentDate = new Date();

 // Format the current date to 'yyyy-mm-dd' format
 const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
 this.selected_Date=formattedDate
 // Call getpunchData with the formatted current date
 this.getpunchData(this.plant_Code, formattedDate, this.dept, this.isHr);
  // this.getpunchData(this.plant_Code, '2023-07-12',this.dept,this.isHr)
  //.getpunchData(this.plant_Code, this.selected_Date ,this.dept,this.isHr)
},(error) => {
  if (error.status === 400) {
    console.log(error)
    this.openAlertDialog(`${error.error}`,'error');
   
  }
   else {
    this.openAlertDialog('Error in connection','error');
   
  }
})

}






}
