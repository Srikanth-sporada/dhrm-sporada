import { Component, OnInit } from '@angular/core';
import {ClamAPIService}  from 'src/app/new-contractor-mod/clam-api.service'
import {ConfirmDialogComponent} from 'src/app/new-contractor-mod/confirm-dialog/confirm-dialog.component'
import {ConfirmDialogReasonComponent} from 'src/app/new-contractor-mod/confirm-dialog-reason/confirm-dialog-reason.component'
// import { LeaveFilterPipe } from 'src/app/new-contractor-mod/Shared/filters'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {LoaderserviceService} from 'src/app/loaderservice.service'
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-operator-coff-appr',
  templateUrl: './operator-coff-appr.component.html',
  styleUrls: ['./operator-coff-appr.component.css']
})
export class OperatorCoffApprComponent implements OnInit {
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
genId:any
a1_status:any='Waiting for Approval'
a2_status:any='Waiting for Approval'

constructor(public loader: LoaderserviceService,
  private dialog: MatDialog,private api:ClamAPIService,) { }

  ngOnInit(): void {
    this.get_coff_list()
    this.l1_status='Waiting for Approval'
    this.l2_status='Waiting for Approval'
  }

  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }

 

get_coff_list(){
  this.api.get_Coff_emp_list(this.userEmpcode).subscribe((res:any)=>{
    this.optr_Data = res
    console.log(this.optr_Data);
    
  },(error:any) => {
    if (error.status === 400) {
      this.openAlertDialog(`${error.error}`,'error');
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
  })
}


approve_Coff(data:any){

  this.api.l1_coff_approve(data).subscribe((res:any)=>{
    this.openAlertDialog(res,'check');
    this.get_coff_list()
  },(error:any) => {
    if (error.status === 400) {
      this.openAlertDialog(`${error.error}`,'error');
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
  })

}


reject_Coff(data:any){
  this.openConfirmDialogWithReason("Reason to Reject C-Off",data);
}




openConfirmDialogWithReason(message: string ,data:any): void {
  const dialogRef = this.dialog.open(ConfirmDialogReasonComponent, {
    data: {
      icon: 'warning',
      message: message,
      confirmText: 'Reject',
      cancelText: 'Cancel',
      
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result.result) {
    
      console.log(result)
      console.log('Dialog result:', result.result);
      console.log('Dialog reason:', result.reason);
      console.log(data)
   
const reject={
data:data,
Reject_reason:result.reason,
rejected_by:this.userEmpcode
}
this.api.reject_optr_Coff(reject).subscribe((res:any)=>{
this.openAlertDialog(res,'check');
this.get_coff_list()


},(error:any) => {
if (error.status === 400) {
  this.openAlertDialog(`${error.error}`,'error');
}
 else {
  this.openAlertDialog('Error in connection','error');
 
}
})

    } 
    else {
      // this.openAlertDialog(`You Cancelled Leave`,'error');

      console.log('You Cancelled Leave');
      
    }
  });
 
}




}