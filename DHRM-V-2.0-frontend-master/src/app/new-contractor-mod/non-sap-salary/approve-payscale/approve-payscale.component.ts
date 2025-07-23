import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ClamAPIService} from '../../clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import { ToastComponent } from '../../toast/toast.component';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import {ConfirmDialogReasonComponent} from 'src/app/new-contractor-mod/confirm-dialog-reason/confirm-dialog-reason.component'
@Component({
  selector: 'app-approve-payscale',
  templateUrl: './approve-payscale.component.html',
  styleUrls: ['./approve-payscale.component.css']
})
export class ApprovePayscaleComponent implements OnInit {
  salarySlipForm: FormGroup;
  newSalarySlipForm: FormGroup;
Approve_screen:any
View_screen:any
Update_screen:any
Sal_Id:any
Apln_slno:any
Con_ID:any
Effective_Date:any
Salary_Details:any
Master_Payscale:any
Payscale_ID:any
// salarySlip :FormGroup
Edit:any
update:any
view:any
showRecalculateButton = false;
salaryEdited= false
plant_Code: any = sessionStorage.getItem('plantcode');
userEmpcode:string |null = sessionStorage.getItem('user_name');
issupervisor : string |null = sessionStorage.getItem('issupervisor');
ishrappr:string |null= sessionStorage.getItem('ishrappr')
isadmin:string |null= sessionStorage.getItem('isadmin')
ishr:string |null= sessionStorage.getItem('ishr')
payscale_Data: any;
apln_list: any;
PayScale_ID: any;
formGroup: FormGroup;

constructor(
  private location: Location,
  private dialog: MatDialog,
  private route: ActivatedRoute,
   private api:ClamAPIService,
   private fb: FormBuilder,
   public router: Router) {

    // console.log(this.route.snapshot.paramMap)

    this.Approve_screen = this.route.snapshot.paramMap.get('approve');
    this.View_screen = this.route.snapshot.paramMap.get('view');
    this.Apln_slno = this.route.snapshot.paramMap.get("apln_slno");
    this.Con_ID = this.route.snapshot.paramMap.get("Con_ID");
    this.Effective_Date = this.route.snapshot.paramMap.get("Effective_Date");
    this.PayScale_ID = this.route.snapshot.paramMap.get("P_Id");
    // this.Effective_Date = this.route.snapshot.paramMap.get("Effective_Date");
    this.Master_Payscale = this.route.snapshot.paramMap.get("master");
    // this.Payscale_ID = this.route.snapshot.paramMap.get("Payscale_Id");
    // this.Update_screen= this.route.snapshot.paramMap.get('update');mst_Payscale/:Payscale_Id
    // this.Sal_Id = this.route.snapshot.paramMap.get('Sal_Id');

console.log(this.route.snapshot.paramMap);

this.newSalarySlipForm = this.fb.group({
  PayScale_ID:[null],
  Effective_Date:[null],
  Effective_Date1:[null],
  Created_On:[null],
  Stipend:[null],
  Basic:[null],
  DA:[null],
  HRA:[null],
  Leave_Salary:[null],
  Washing_allow:[null],
  Monthly_Bonus:[null],
  Sat_and_Mon_Incentive:[null],
  Monthly_Attn_Incentive:[null],
  Retention_Incentive:[null],
  Spl_allow:[null],
  Night_shift_allowance:[null],
  Skilled_allow_P3:[null],
  Amenities_Allow:[null],
  Other_allowance_1:[null],
  Other_allowance_2:[null],
  Other_allowance_3:[null],
  Other_allowance_4:[null],
  Gross_Earnings:[null],
  Canteen:[null],
  Transport:[null],
  WC_Policy:[null],
  Insurance:[null],
  Shoe_FirstTime:[null],
  Glass_FirstTime:[null],
  Uniform_FirstTime:[null],
  Coat_FirstTime:[null],
  Other_deduction_1:[null],
  Other_deduction_2:[null],
  Other_deduction_3:[null],
  Other_deduction_4:[null],
  Tot_Deduction:[null],
  Service_Charge_Fixed:[null],
  Service_charges_Percentage:[null],
  SC_Base:[null],
  NSDC_Contribution:[null],
  Uniform_Charges:[null],
  Labour_Welfare_Fund:[null],
  Insurance_Premium:[null],
  Learning_Fees:[null],
  Workmen_Compensation:[null],
  Emp_Comp_Ins:[null],
  Higher_Education_Fee:[null],
  Plant_Code:[null],
  Cont_ID:[null],
  PayScale_Name:[null],
  rn:[null],
  Gross_Earning:[null],
  EM_PF_Cal_Val:[null],
  EMP_PF_Cal_Val:[null],
  EM_ESI_Cal_Val:[null],
  EMP_ESI_Cal_Val:[null],
  Servive_Charge_Val:[null],

  Gross_Deduction:[null],
  Paid_To_Contractor:[null],
  Net_Take_Home:[null],
  ToTal_Base_Value:[null],
  Service_Tax_Val:[null],
  CTC:[null],
  EM_PF_Percent:[null],
  EMP_PF_Percent:[null],
  EM_ESI_Percent:[null],
  EMP_ESI_Percent:[null]
})

  

    // this.get_Salary_Details(this.Sal_Id)
    // this.createAndPopulateForm(this.Salary_Details[0]);
   }

  ngOnInit(): void {
 

if(this.Approve_screen =='approve' ){
this.Edit = true
this.update= false
this.view= false
this.get_Trainee_Dtls(this.Apln_slno,this.Con_ID,this.PayScale_ID)
}
else if( this.View_screen == 'view'){
this.Edit=false
}
else if( this.Approve_screen == 'update'){
this.Edit=true
this.update=true
this.view=false
}
else if(this.Master_Payscale =='mst_Payscale'){
  this.Edit = false
this.update= false
this.view= true
}

this.formGroup = new FormGroup({
  apln_slno: new FormControl(),
  apln_status: new FormControl(),
  apprentice_type: new FormControl(),
  fullname: new FormControl(),
  doj: new FormControl(),
  dept_name: new FormControl(),
  Line_name: new FormControl(),
  gen_id: new FormControl(),
  punch_id: new FormControl(),
  birthdate: new FormControl(),
  Cont_company_name: new FormControl(),
  con_Id: new FormControl(),

  effective_date: new FormControl(),
});






  }




  get_Trainee_Dtls(Apln_Slno :any,Con_ID :any ,PayScale_ID:any){
    console.log(Apln_Slno,Con_ID);
    
    this.api.getTraineDtlsSal(Apln_Slno ).subscribe(
      (res) => {
        this.apln_list = res;
console.log(res);

        this.get_Payscale(Con_ID ,PayScale_ID);
       this.initvalueFormGroup();
      },
      (error) => {
        console.log(error);
      }
    );
  }


  get_Payscale(con_Id: any ,PayScale_ID:any) {
    const data ={
      plant_Code:this.plant_Code,
      con_id:con_Id,
      PayScale_ID:PayScale_ID,
    }
    this.api.getSinglePayscale(data).subscribe(
      (res) => {
        this.payscale_Data = res;
        console.log(res)
        this.payscale_Data = this.payscale_Data.filter((item:any) => item.Effective_Date==this.Effective_Date)
      console.log(this.payscale_Data[0]);
      this.newSalarySlipForm.patchValue(this.payscale_Data[0])
      console.log(this.newSalarySlipForm.value);
      
      },
      (error) => {
        console.log(error);
      }
    );
  }
  initvalueFormGroup() {
    this.formGroup = this.fb.group({
      apln_slno: [this.apln_list[0].apln_slno],
      apln_status: [this.apln_list[0].apln_status],
      apprentice_type: [this.apln_list[0].apprentice_type],
      fullname: [this.apln_list[0].fullname],
      doj: [this.apln_list[0].doj],
      dept_name: [this.apln_list[0].dept_name],
      Line_Name: [this.apln_list[0].Line_Name],
      Cont_company_name: [this.apln_list[0].Cont_company_name],
      con_Id: [this.apln_list[0].cont_id],
      gen_id: [this.apln_list[0].gen_id],
      punch_id: [this.apln_list[0].biometric_no],
      birthdate: [this.apln_list[0].birthdate],
      effective_date: [this.apln_list[0].doj],
    });
  }


// -------
get_Salary_Details(Sal_Id:any){
this.api.getSalaryDetails(Sal_Id).subscribe((res :any)=>{
  // this.createAndPopulateForm(res[0]);
this.Salary_Details = res
console.log(res)
this.salarySlipForm.patchValue(res[0])

console.log(this.Salary_Details)
},error=>{
  console.log(error)
})
}







onInputChanged(event: any, controlName: string) {
  const newValue = event.target.value; 
  const numericValue = parseFloat(newValue);
  this.salarySlipForm.get(controlName)?.patchValue(numericValue);
  this.showRecalculateButton = true;
  this.salaryEdited = true
}

formatDate(dateValue: string): string {
  if (!dateValue) {
    return ''; // Return an empty string if the date value is empty or undefined.
  }

  const date = new Date(dateValue);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
minDate(): string {
  const min_date= this.salarySlipForm.get('Effective_From')?.value
  const minDateObj = new Date(min_date);
  minDateObj.setDate(minDateObj.getDate() + 1);
  const formattedMinDate = minDateObj.toISOString().split('T')[0];
  // console.log(formattedMinDate)
  return formattedMinDate;
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





formatDateWithHr(inputDate: Date): String {
  const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
  const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
  return formattedDate;
}

approve_Salary(){
  const data= {
    Effective_Date: this.newSalarySlipForm.get('Effective_Date')?.value,
    PayScale_ID : this.newSalarySlipForm.get('PayScale_ID')?.value,
    Apln_slno: this.Apln_slno
  }
  

  this.api.approve_Edited_Salary(data,this.userEmpcode).subscribe((res:any) =>{
console.log(res);
    this.openAlertDialog(`${res}`,100,'check')
    this.goBack()
  })



}




// rework_Salary(){

//   const data= {
//     Effective_Date: this.newSalarySlipForm.get('Effective_Date')?.value,
//     PayScale_ID : this.newSalarySlipForm.get('PayScale_ID')?.value,
//     Apln_slno: this.Apln_slno
//   }
  

//   this.api.rework_Emp_Salary(data,this.userEmpcode).subscribe((res:any) =>{
// console.log(res);
//     this.openAlertDialog(`${res}`,100,'check')
//     this.goBack()
//   })



// }


reworkpayscale(){
  const data= {
    Effective_Date: this.newSalarySlipForm.get('Effective_Date')?.value,
    PayScale_ID : this.newSalarySlipForm.get('PayScale_ID')?.value,
    Apln_slno: this.Apln_slno
  }
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

this.api.rework_Emp_Salary(reject).subscribe((res:any)=>{
  this.openAlertDialog(res,500,'check');
  this.goBack()

},(error:any) => {
  if (error.status === 400) {
    this.openAlertDialog(`${error.error}`,550,'error');
  }
   else {
    this.openAlertDialog('Error in connection',500,'error');
   
  }
})
  
      } 
      else {
        // this.openAlertDialog(`You Cancelled Leave`,'error');

        console.log('You Cancelled Leave');
        
      }
    });
   
  }



goBack(): void {
  this.location.back();
 
}

}
