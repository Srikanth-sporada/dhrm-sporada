import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, UntypedFormBuilder} from '@angular/forms';
import {MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS}from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { isThisSecond } from 'date-fns';
import * as _moment from 'moment';
import {Moment} from 'moment';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { ApiService } from 'src/app/home/api.service';
import { ClamAPIService } from 'src/app/new-contractor-mod/clam-api.service';
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import {ConfirmDialogComponent} from 'src/app/new-contractor-mod/confirm-dialog/confirm-dialog.component'
import {ConfirmDialogReasonComponent} from 'src/app/new-contractor-mod/confirm-dialog-reason/confirm-dialog-reason.component'

import { CoffDetailsComponent } from '../../time-office-appr/coff-details/coff-details.component';

import { ExcessHoursDetailsComponent } from '../../time-office-appr/excess-hours-details/excess-hours-details.component'; 

import  {CoffotpopupComponent }  from '../../time-office-appr/ot-compoff/coffpopup/coffpopup.component'
const moment = _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'comp-off',
  templateUrl: 'comp-off.component.html',
  styleUrls: ['comp-off.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CompOffComponent implements OnInit{
  all :any = sessionStorage.getItem("all");
item:any =JSON.parse(this.all);
lines:any
ishr = sessionStorage.getItem('ishr')
isRA = this.item.Is_ReportingAuth
empl_slNo = this.item.empl_slno
ishrappr = sessionStorage.getItem('ishrappr')
isadmin = sessionStorage.getItem('isadmin')
userEmpcode:string |null = sessionStorage.getItem('user_name');
plant: any = sessionStorage.getItem("plantcode");
gen_id: any = sessionStorage.getItem("gen_id");
  data: any;

  list:any

  constructor(private matdailog:MatDialog,private api:ClamAPIService
    ,private service: ApiService, private fb: UntypedFormBuilder, private modalService: NgbModal)
  {
    
    
  }

  ngOnInit(): void {
// console.log(this.userEmpcode);

   this.get_approved_excesshr()
   this.getCoffList()

  //  this.service.getlineBydept().subscribe((response: any) => {
  //   this.lines = response;
  
  // });
  }




  get_approved_excesshr() {
    this.service.getApprovedExcessHoursOptr(this.plant,this.userEmpcode).subscribe((response: any) => {
      if (response.status == "failed") {
        alert(response.message);
      } else {
        console.log(response.data);
        // this.downlodData = response.data
        this.data = response.data
        // .map((element: any) => {
        //   return { ...element, approvedHr: null, reason: "" };
        // }).filter((element:any)=>{
        //   return element.bal !=0
        // });;

        console.log(this.data);
      }
    });
  }

   
  openCoffDeatils(data:any){
    this.matdailog.open(CoffDetailsComponent,{
      data:data
    })
  }

  openExcessHourDetais(data:any){
    this.matdailog.open(ExcessHoursDetailsComponent,{
      data:data
    })
  }

  openDailog(details:any){
    this.matdailog.open(CoffotpopupComponent,{
      data:details
    }).afterClosed().subscribe((data:any)=>{
      this.get_approved_excesshr()
      this.getCoffList()
    })
  }



  getCoffList(){
    this.api.get_Coff_optr_list(this.userEmpcode).subscribe((res:any)=>{
this.list=res
console.log(res);

    })
  }


  coff_cancel_Popup(data:any){
console.log(data);
this.openConfirmDialogWithReason("Reason to Cancel C-OFF",data);
  }


  
  openConfirmDialogWithReason(message: string ,data:any): void {
    const dialogRef = this.matdailog.open(ConfirmDialogReasonComponent, {
      data: {
        icon: 'warning',
        message: message,
        confirmText: 'Yes',
        cancelText: 'No',
        buttonName:'Cancel'
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result.result) {

     
const coff={
data:data,
cncl_reason:result.reason
}

        this.api.cancel_Optr_Coff(coff).subscribe((res:any) =>{
          this.openAlertDialog(res,'Check');
   this.get_approved_excesshr()
   this.getCoffList()
        },(error)=>{
          if (error.status === 400) {
            this.openAlertDialog(`${error.error}`,'error');
          }
           else {
            this.openAlertDialog('Error in connection','error');
           
          }
        })
      } 
      else {
      //  this.openAlertDialog(`You Cancelled Leave`,'error');

      console.log('');
      
      }
    });
   
  }

  openAlertDialog(message: string , icon:string): void {
    this.matdailog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }




}