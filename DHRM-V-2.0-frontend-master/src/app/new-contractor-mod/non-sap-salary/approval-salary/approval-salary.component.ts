import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {ClamAPIService} from '../../clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import { ToastComponent } from '../../toast/toast.component';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { error } from 'console';
import {ConfirmDialogReasonComponent} from 'src/app/new-contractor-mod/confirm-dialog-reason/confirm-dialog-reason.component'
@Component({
  selector: 'app-approval-salary',
  templateUrl: './approval-salary.component.html',
  styleUrls: ['./approval-salary.component.css']
})
export class ApprovalSalaryComponent implements OnInit {

  plant_Code: any = sessionStorage.getItem('plantcode');
  
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  ishrappr:string |null= sessionStorage.getItem('ishrappr')
isadmin:string |null= sessionStorage.getItem('isadmin')
ishr:string |null= sessionStorage.getItem('ishr')
defaultStatus: string;
  WageList:any
  wageListCopy :any
  deptList:any
  Con_list:any
  selectedGenId:any
  selectedDept:any
  selectedStatus:any
  button:boolean=false


  selectedRecords: any[] = [];
  allSelected: boolean = false;
 
  constructor(
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
     private api:ClamAPIService,
     public router: Router) {

      this.defaultStatus = this.ishrappr ? 'PENDING' : 'ALL';
    
   
    this.selectedStatus = this.defaultStatus;
     }

  ngOnInit(): void {

    this.get_Wage_Mst()
    this.get_Dept_Mst()
    this.getContra()
    // Initialize filters
    this.selectedDept = null;
    this.selectedStatus = null;
    this.selectedGenId = null;
  }


  toggleSelectAll() {
    this.WageList.forEach((item: any) => {
      item.selected = this.allSelected;
    });
  }

  onRowSelectChange() {
    this.allSelected = this.WageList.every((item: any) => item.selected);
  }

  anyRowSelected() {
    return this.WageList.some((item: any) => item.selected);
  }


  openAlertDialog(message: string, delayMilliseconds: number = 500,icon:string): void {
    setTimeout(() => {
      this.dialog.open(ToastComponent, {
        data: {
          icon: icon,
          message: message
        }
      });
    }, delayMilliseconds);
  } 

  approveSelectedItems() {
    this.button=true
    const selectedItems = this.WageList.filter((item: any) => item.selected);
    console.log('Selected items for approval:', selectedItems);
    // Implement your approval logic here
    this.api.approve_Bulk_Salary(selectedItems,this.userEmpcode).subscribe((res:any) =>{
      console.log(res);
      this.openAlertDialog(`${res.message}`,100,'check')
     
      this.button=false
      this.get_Wage_Mst()
    },(error)=>{
      console.log(error);
      this.button=false
    })
  }



get_Dept_Mst(){
  this.api.getDeptMst(this.plant_Code).subscribe(res=>{
    this.deptList =res
  //  console.log(this.deptList)
  })
}





getContra(){
  this.api.getContractor().subscribe(res =>{
    this.Con_list = res;
    // console.log(res)
    this.Con_list =  this.Con_list.filter((item:any) => item.Plant_code == this.plant_Code  && item.Status=== true)
   },error=>{
    console.log(error)
  })
}


  get_Wage_Mst(){
this.api.getWageMst(this.plant_Code,this.userEmpcode).subscribe((res:any) =>{
this.WageList = res
this.wageListCopy = [...this.WageList];
console.log("🚀 ~ file: revise-payscale.component.ts:18 ~ RevisePayscaleComponent ~ ̥WageList:", this.WageList)

})
  }

   onIshrapprChange() {
    // console.log(ishrappr)
    this.defaultStatus = this.ishrappr== 'true' ? 'PENDING' : 'ALL';
    // this.selectedStatus = this.defaultStatus;
  }




  
reworkpayscale(data:any){
  this.openConfirmDialogWithReason("Do you want to send for Rework Payscale",data);
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

console.log(reject);

// this.api.reject_optr_Leave(reject).subscribe((res:any)=>{
//   this.openAlertDialog(res,500,'check');
//   // this.getOptrleave()

// },(error:any) => {
//   if (error.status === 400) {
//     this.openAlertDialog(`${error.error}`,550,'error');
//   }
//    else {
//     this.openAlertDialog('Error in connection',500,'error');
   
//   }
// })





        
      } 
      else {
        // this.openAlertDialog(`You Cancelled Leave`,'error');

        console.log('You Cancelled Leave');
        
      }
    });
   
  }

}
