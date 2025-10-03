import { Component, OnInit } from '@angular/core';
import {ClamAPIService}  from 'src/app/new-contractor-mod/clam-api.service'

import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {LoaderserviceService} from 'src/app/loaderservice.service'
import { MatDialog } from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'src/app/new-contractor-mod/confirm-dialog/confirm-dialog.component'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-od-appr',
  templateUrl: './operator_permission-appr.component.html',
  styleUrls: ['./operator_permission-appr.component.css']
})
export class OptrApprComponent implements OnInit {

  // item:any[] = essionStorage.getItem("all");

all :any = sessionStorage.getItem("all");
userDetails:any;
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
genId:any;
a1_status:any='Waiting for Approval'
a2_status:any='Waiting for Approval'
statusOptions = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Waiting for Approval', label: 'Waiting for Approval' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Rejected', label: 'Rejected' }
];


  constructor(public loader: LoaderserviceService,
    private dialog: MatDialog,private api:ClamAPIService, private messageService:MessageService) { }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
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
    }, (error) =>{
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message});
    })
  }



l1_Approver(data:any){
  console.log(data)
  this.api.l1_approver(data,this.empl_slNo).subscribe((res:any)=>{
    // this.openAlertDialog(res,'check');
    this.messageService.add({severity:'info',summary:res});
    this.getOptrPermission()

  },(error:any) => {
    if (error.status === 400) {
      // this.openAlertDialog(`${error.error}`,'error');
      this.messageService.add({severity:'error',summary:error.error});
    }
     else {
      // this.openAlertDialog('Error in connection','error');
      this.messageService.add({severity:'error',summary:'Error In Connection'});
    }
  })
  
}
l2_Approver(data:any){
  // console.log(data)
  this.api.l2_approver(data).subscribe((res:any)=>{
    // this.openAlertDialog(res,'check');
    this.messageService.add({severity:'info',summary:res});
    this.getOptrPermission()

  },(error:any) => {
    if (error.status === 400) {
      // this.openAlertDialog(`${error.error}`,'error');
      this.messageService.add({severity:'error',summary:error.error});

    }
     else {
      // this.openAlertDialog('Error in connection','error');
      this.messageService.add({severity:'error',summary:'Error In Connection'});     
    }
  })
  
}



}
