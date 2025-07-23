import { Component, OnInit } from '@angular/core';
import {ClamAPIService}  from 'src/app/new-contractor-mod/clam-api.service'

import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {LoaderserviceService} from 'src/app/loaderservice.service'
import { MatDialog } from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'src/app/new-contractor-mod/confirm-dialog/confirm-dialog.component'
@Component({
  selector: 'app-od-appr',
  templateUrl: './operator_permission-appr.component.html',
  styleUrls: ['./operator_permission-appr.component.css']
})
export class OptrApprComponent implements OnInit {

  // item:any[] = essionStorage.getItem("all");

all :any = sessionStorage.getItem("all");
item:any =JSON.parse(this.all);

ishr = sessionStorage.getItem('ishr')
isRA = this.item.Is_ReportingAuth
empl_slNo = this.item.empl_slno
ishrappr = sessionStorage.getItem('ishrappr')
isadmin = sessionStorage.getItem('isadmin')
userEmpcode:string |null = sessionStorage.getItem('user_name');
plant: any = sessionStorage.getItem("plantcode");
gen_id: any = sessionStorage.getItem("gen_id");
l1_status:any
l2_status:any
optr_Data:any
apprShow=true
genId:any
a1_status:any='Waiting for Approval'
a2_status:any='Waiting for Approval'

  constructor(public loader: LoaderserviceService,
    private dialog: MatDialog,private api:ClamAPIService,) { }

  ngOnInit(): void {
    this.getOptrPermission()
    this.l1_status='Waiting for Approval'
    this.l2_status='Waiting for Approval'

    // this.l2_status=this.optr_Data.L2_Approval_Status

    // if(this.optr_Data.L2_Approval_Status ===  this.l2_status ){
    //   console.log(true)
    // }else{
    //   console.log(false)
    // }
  }
// console

openAlertDialog(message: string , icon:string): void {
  this.dialog.open(ToastComponent, {
    data: {
      icon: icon,
      message: message
    }
  });
}


  getOptrPermission(){
    this.api.get_optr_permission_data(this.plant,this.empl_slNo,this.ishrappr).subscribe((res:any)=>{
      console.log(res)
this.optr_Data =res

// this.l2_status=this.optr_Data.L2_Approval_Status
    })
  }



l1_Approver(data:any){
  console.log(data)
  this.api.l1_approver(data,this.empl_slNo).subscribe((res:any)=>{
    this.openAlertDialog(res,'check');
    this.getOptrPermission()

  },(error:any) => {
    if (error.status === 400) {
      this.openAlertDialog(`${error.error}`,'error');
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
  })
  
}
l2_Approver(data:any){
  // console.log(data)
  this.api.l2_approver(data).subscribe((res:any)=>{
    this.openAlertDialog(res,'check');
    this.getOptrPermission()

  },(error:any) => {
    if (error.status === 400) {
      this.openAlertDialog(`${error.error}`,'error');
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
  })
  
}



}
