import { Component, OnInit } from '@angular/core';
import {ClamAPIService} from '../clam-api.service'
import { DatePipe } from '@angular/common';
import { FormControl,FormBuilder } from '@angular/forms';
import moment from 'moment';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { NgForm } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {AttendanceReprocessResultDialogComponent } from '../attendance-reprocess-result-dialog/attendance-reprocess-result-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shift-change',
  templateUrl: './shift-change.component.html',
  styleUrls: ['./shift-change.component.css']
})
export class ShiftChangeComponent implements OnInit {

  all: any = JSON.parse(sessionStorage.getItem('all')!);
  userDetails:any;
  dept:any = this.all.Department
  selectedPlantCode: string;
  Emp_slno:any = this.all.empl_slno
  plant_Code: any = sessionStorage.getItem('plantcode');
  username: any = sessionStorage.getItem('user_name');
  isHr: any = sessionStorage.getItem('ishr');
  is_admin: any = sessionStorage.getItem('isadmin');
  loading: boolean = false;
  shiftData:any
  minDate: any;
  maxDate: any;
  Plant:any
  Plant_id:any
  gen_id:String
  Attn_Date:any
  shift_Id:number
  shift_data:any
  attn_data:any
  in_data:any
  out_data:any
min_time:any
max_time:any

verifyBtn:boolean=false

button:boolean= false


  constructor(private dialog: MatDialog,private fb:FormBuilder
   ,private api:ClamAPIService,private datePipe: DatePipe, private messageService:MessageService) { }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.calculateMinMaxDates();
    this.getShift(this.plant_Code)
    this.get_plant();
  }

  get_plant(){
    this.api.getPlant().subscribe(res =>{
      this.Plant=res
      console.log(this.Plant);
      
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
  })
  }
  calculateMinMaxDates() {
    const currentDate = new Date();
    
    // Set min date to 1 month below
    this.minDate = new Date(currentDate.setDate(currentDate.getDate() - 60));
    
    // Set max date to 1 month above
    this.maxDate = new Date(currentDate.setDate(currentDate.getDate() + 60));
  }

  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }
  getShift( plant_Code:any){
    this.api.get_Shift(plant_Code).subscribe(res => {
this.shiftData =res
console.log(res)
// console.log(this.shiftData)
this.shiftData =  this.shiftData.filter((item:any) =>item.shift_id !== 0)

    },(error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
  })
  }



  onSubmit() {
    if (this.validateForm()) {
      let plantcode
      if(this.is_admin =='true'){
        plantcode = this.Plant_id
      }else{
        plantcode = this.plant_Code
      }
      
      this.loading = true;
      const data ={
        gen_id:this.gen_id,
        Attn_Date:moment(this.Attn_Date).format('YYYY-MM-DD'),
        plant:plantcode
      }
      // console.log('GenID:', this.gen_id);
      // console.log('Date:', this.Attn_Date.format('yyyy-MM-DD'));

this.button=true
this.api.shiftChangedetails(data).subscribe( (res:any) =>{

  this.attn_data=res[0]
  this.in_data=res[1]
  this.out_data=res[2]
  this.shift_data=res[3]
  this.verifyBtn=true
this.button=false
this.loading = false;
} ,(error:any) => {
  if (error.status === 400) {
    console.log(error)
    // this.openAlertDialog(`${error.error}`,'error');
    this.messageService.add({severity:'warn', summary:`${error.error}`})
    this.button=false
    this.loading = false;

  }
   else {
    // this.openAlertDialog('Error in connection','error');
    this.messageService.add({severity:'error',summary:'Error In Connection'})
    this.button=false
    this.loading = false;

  }
})


    } else {
      //  this.openAlertDialog(`Please fill in all required fields`,'error');
       this.messageService.add({severity:'warn',summary:'Please fill in all required fields'});
    }
  }

  private validateForm(): boolean {
    return !!this.gen_id && !!this.Attn_Date ;
  }
  private validateattn(): boolean {
    return !!this.min_time && !!this.max_time  && !! this.shift_Id;
  }



  process_attn(){
    if (this.validateattn()) {
      let plantcode
      if(this.is_admin =='true'){
        plantcode = this.Plant_id
      }else{
        plantcode = this.plant_Code
      }
      this.loading = true;
      const data ={
        gen_id:this.gen_id,
        Attn_Date:this.Attn_Date.format('yyyy-MM-DD'),
        Attn_data:this.attn_data,
        plantcode:plantcode,
        min_time:this.min_time,
        max_time:this.max_time,
        shift_Id:this.shift_Id,
        Applied_by:this.username
      }

      this.api.shiftChangeProcess(data).subscribe((res:any) => {
console.log(res);
this.button=false
this.loading = false;
if (res.message === 'Attendance Re Processed successfully') {
  // Open the dialog with the response data
  this.dialog.open(AttendanceReprocessResultDialogComponent, {
    data: res.data
  });
  this.verifyBtn=false
  this.max_time=''
  this.min_time=''
  this.out_data=''
  this.in_data=''
  this.attn_data=''
  this.shift_data=''
  this.gen_id=''
  this.maxDate=null
  this.minDate=null
  this.Plant_id=''
  this.Attn_Date=''


  
} else {
  // Handle other messages or errors
  this.openAlertDialog(res.message, 'error');
}


      },(error:any) => {
        if (error.status === 400) {
          console.log(error)
          this.openAlertDialog(`${error.error}`,'error');
          this.button=false
          this.loading = false;
      
        }
         else {
          this.openAlertDialog('Error in connection','error');
          this.button=false
          this.loading = false;
      
        }
      }
      
      )

    }
    else {
      this.openAlertDialog(`Please fill in all required fields for Attendance Reprocess`,'error');
   }
  }

}
