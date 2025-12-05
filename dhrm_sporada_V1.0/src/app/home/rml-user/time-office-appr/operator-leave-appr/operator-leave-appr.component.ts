import { Component, OnInit } from '@angular/core';
import {ClamAPIService}  from 'src/app/new-contractor-mod/clam-api.service'
import {ConfirmDialogComponent} from 'src/app/new-contractor-mod/confirm-dialog/confirm-dialog.component'
import {ConfirmDialogReasonComponent} from 'src/app/new-contractor-mod/confirm-dialog-reason/confirm-dialog-reason.component'
// import { LeaveFilterPipe } from 'src/app/new-contractor-mod/Shared/filters'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {LoaderserviceService} from 'src/app/loaderservice.service'
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-operator-leave-appr',
  templateUrl: './operator-leave-appr.component.html',
  styleUrls: ['./operator-leave-appr.component.css']
})
export class OperatorLeaveApprComponent implements OnInit {

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
  genId:any
  a1_status:any='Waiting for Approval'
  a2_status:any='Waiting for Approval'
  selectAll: boolean = false;
  approveBtn : boolean = false;
  statusOptions = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Waiting for Approval', label: 'Waiting for Approval' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Rejected', label: 'Rejected' }
];
// apprShow=true

constructor(
  public loader: LoaderserviceService,
  private dialog: MatDialog,
  private api:ClamAPIService,
  private messageService:MessageService) { }

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getOptrleave();
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
this.api.reject_optr_Leave(reject).subscribe((res:any)=>{
  // this.openAlertDialog(res,'check');
  this.messageService.add({severity:'info',summary:res});
  this.getOptrleave()

},(error:any) => {
  if (error.status === 400) {
    // this.openAlertDialog(`${error.error}`,'error');
  this.messageService.add({severity:'error',summary:error.error});

  }
   else {
    // this.openAlertDialog('Error in connection','error');
    this.messageService.add({severity:'error',summary:'Error In Connection'});
    
  }
}) } 
      else {
        // this.openAlertDialog(`You Cancelled Leave`,'error');

        console.log('You Cancelled Leave');
        
      }
    });
   
  }

toggleSelect(){
  if(this.a2_status !== 'Waiting for Approval'){
    this.approveBtn=true
  }
  if(this.a2_status === 'Waiting for Approval'){
    this.approveBtn=false
  }
}



  toggleSelectAll() {
    for (const data of this.optr_Data) {
      data.isSelected = this.selectAll;

    }
  }
  
  toggleSelection(data: any) {
    // console.log(data);
  
    if (!data.isSelected && this.selectAll) {
      this.selectAll = false;
    } else {
      // Check if all items are selected
      this.selectAll = this.optr_Data.every((item: any) => item.isSelected);
    }
  }

  
  atLeastOneSelected(): boolean {
    return this.optr_Data && Array.isArray(this.optr_Data) && this.optr_Data.some((data: any) => data.isSelected);
  }
  
  


  getOptrleave(){
    this.api.get_optr_leave_data(this.plant,this.empl_slNo,this.ishrappr).subscribe((res:any)=>{
      // console.log(res)
      this.optr_Data =res
  // this.l2_status=this.optr_Data.L2_Approval_Status
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })
  }


  
l1_Approver(data:any){
  console.log(data)
  this.api.l1_Leave_approver(data,this.empl_slNo).subscribe((res:any)=>{
    this.openAlertDialog(res,'check');
    this.getOptrleave()

  },(error:any) => {
    if (error.status === 400) {
      this.messageService.add({severity:'error',summary:error.error});
    }
     else {
      this.messageService.add({severity:'error',summary:'Error In Connection'});
    }
  })
  
}
l2_Approver(data:any){
  // console.log(data)
  this.api.l2_Leave_approver(data).subscribe((res:any)=>{
    // this.openAlertDialog(res,'check');
    this.messageService.add({severity:'info',summary:res})
    this.getOptrleave()

  },(error:any) => {
    if (error.status === 400) {
      // this.openAlertDialog(`${error.error}`,'error');
      this.messageService.add({severity:'warn',summary:error.error})
    }
     else {
      this.messageService.add({severity:'error',summary:'Error In Connection'});
    }
  })
  
}


submit() {
  const selectedItems = this.optr_Data.filter((data: any) => data.L2_Approval_Status === 'Waiting for Approval' && data.isSelected);
  // console.log('Selected Items:', selectedItems);

  if (selectedItems.length === 0) {
    // Show a message indicating that there are no items to approve
    // this.openAlertDialog('No items to approve', 'info');
     this.messageService.add({severity:'warn',summary:'No items to Approve'})
    return;
  }

  this.api.l2_Leave_approver_Selected(selectedItems).subscribe((res:any)=>{
    this.messageService.add({severity:'info',summary:res})
    this.getOptrleave()
  },(error:any) => {
    if (error.status === 400) {
     this.messageService.add({severity:'warn',summary:error.error})
    }
     else {
      this.messageService.add({severity:'error',summary:'Error In Connection'});
    }
  })
 
}

reject_leave(data:any){
  this.openConfirmDialogWithReason("Do you want to Reject leave",data);
}

}
