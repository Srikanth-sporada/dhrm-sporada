import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {ClamAPIService} from '../../clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import { ToastComponent } from '../../toast/toast.component';
import { Location } from '@angular/common';
import * as XLSX from'xlsx'
import * as moment from 'moment';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
@Component({
  selector: 'app-revise-payscale',
  templateUrl: './revise-payscale.component.html',
  styleUrls: ['./revise-payscale.component.css']
})
export class RevisePayscaleComponent implements OnInit {
  payroll_Data: any;
  payscaleForm = false;
  showSaveBtn = false;
  selectedPayscale: any;
  canteen_amt: any;
  bonus_val: any;
  Apln_slno: any;
  Apln_status: any;
  Salary_Status: any;
  Gen_id: any;
  CurrentPayScale_ID: any;
  apln_list: any;
  plant_Code: any = sessionStorage.getItem("plantcode");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  payscale_Data: any;
  NewPayScaleFormGroup: FormGroup;
  CurrentPayScaleFormGroup: FormGroup;
  payRollFormGroup: FormGroup;


  reviseButton=false

  formGroup: FormGroup;

  constructor(
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
     private api:ClamAPIService,
     private fb: FormBuilder,
     public router: Router) {}

  ngOnInit(): void {

    this.Apln_slno = this.route.snapshot.paramMap.get("apln_slno");
    this.Gen_id = this.route.snapshot.paramMap.get("gen_id");
    this.Apln_status = this.route.snapshot.paramMap.get("apln_status");
    this.Salary_Status = this.route.snapshot.paramMap.get("Salary_Status");
    this.CurrentPayScale_ID = this.route.snapshot.paramMap.get("PayScale_ID");
    console.log( this.route.snapshot.paramMap.get("PayScale_ID"));

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

    
    this.NewPayScaleFormGroup =this.fb.group({
      PayScale_ID: [null],
        Plant_Code: [null],
        Cont_ID: [null],
        PayScale_Name: [null],
        Stipend: [null],
        Basic: [null],
        DA: [null],
        HRA: [null],
        Leave_Salary: [null],
        Washing_allow: [null],
        Monthly_Bonus: [null],
        Sat_and_Mon_Incentive: [null],
        Monthly_Attn_Incentive: [null],
        Retention_Incentive: [null],
        Spl_allow: [null],
        Night_shift_allowance: [null],
        Skilled_allow_P3: [null],
        Amenities_Allow: [null],
        Other_allowance_1: [null],
        Other_allowance_2: [null],
        Other_allowance_3: [null],
        Other_allowance_4: [null],
        Gross_Earning: [null],

        Canteen: [null],
        Transport: [null],
        Professional_Tax: [null],
        
        WC_Policy: [null],
        Insurance: [null],
        Shoe_FirstTime: [null],
        Glass_FirstTime: [null],
        Uniform_FirstTime: [null],
        Coat_FirstTime: [null],
        Other_deduction_1: [null],
        Other_deduction_2: [null],
        Other_deduction_3: [null],
        Other_deduction_4: [null],
        Gross_Deduction: [null],

        Service_Charge_Fixed: [null],
        Service_charges_Percentage: [null],
        SC_Base: [null],
        NSDC_Contribution: [null],
        Uniform_Charges: [null],
        Labour_Welfare_Fund: [null],
        Insurance_Premium: [null],
        Learning_Fees: [null],
        Workmen_Compensation: [null],
        Emp_Comp_Ins: [null],
        Higher_Education_Fee: [null],    
        
        EM_ESI_Cal_Val:[null],
        EM_PF_Cal_Val:[null],
        EMP_PF_Cal_Val:[null],
        EMP_ESI_Cal_Val:[null],
        EM_PF_Percent:[null],
        EM_ESI_Percent:[null],
        EMP_PF_Percent:[null],
        EMP_ESI_Percent:[null],
        Service_Tax_Val:[null],
        Servive_Charge_Val:[null],
        Effective_Date:[null],
        Effective_Date1:[null],


        CTC:[null],
        ToTal_Base_Value:[null],
        Net_Take_Home:[null],
        
        


    })
    this.CurrentPayScaleFormGroup =this.fb.group({
      PayScale_ID: [null],
        Plant_Code: [null],
        Cont_ID: [null],
        PayScale_Name: [null],
        Stipend: [null],
        Basic: [null],
        DA: [null],
        HRA: [null],
        Leave_Salary: [null],
        Washing_allow: [null],
        Monthly_Bonus: [null],
        Sat_and_Mon_Incentive: [null],
        Monthly_Attn_Incentive: [null],
        Retention_Incentive: [null],
        Spl_allow: [null],
        Night_shift_allowance: [null],
        Skilled_allow_P3: [null],
        Amenities_Allow: [null],
        Other_allowance_1: [null],
        Other_allowance_2: [null],
        Other_allowance_3: [null],
        Other_allowance_4: [null],
        Gross_Earning: [null],

        Canteen: [null],
        Transport: [null],
        Professional_Tax: [null],
        
        WC_Policy: [null],
        Insurance: [null],
        Shoe_FirstTime: [null],
        Glass_FirstTime: [null],
        Uniform_FirstTime: [null],
        Coat_FirstTime: [null],
        Other_deduction_1: [null],
        Other_deduction_2: [null],
        Other_deduction_3: [null],
        Other_deduction_4: [null],
        Gross_Deduction: [null],

        Service_Charge_Fixed: [null],
        Service_charges_Percentage: [null],
        SC_Base: [null],
        NSDC_Contribution: [null],
        Uniform_Charges: [null],
        Labour_Welfare_Fund: [null],
        Insurance_Premium: [null],
        Learning_Fees: [null],
        Workmen_Compensation: [null],
        Emp_Comp_Ins: [null],
        Higher_Education_Fee: [null],    
        
        EM_ESI_Cal_Val:[null],
        EM_PF_Cal_Val:[null],
        EMP_PF_Cal_Val:[null],
        EMP_ESI_Cal_Val:[null],
        EM_PF_Percent:[null],
        EM_ESI_Percent:[null],
        EMP_PF_Percent:[null],
        EMP_ESI_Percent:[null],
        Service_Tax_Val:[null],
        Servive_Charge_Val:[null],
        Effective_Date:[null],
        Effective_Date1:[null],


        CTC:[null],
        ToTal_Base_Value:[null],
        Net_Take_Home:[null],
        
        


    })

    this.get_trainee_dtls(this.Apln_slno, this.Gen_id, this.Apln_status,this.route.snapshot.paramMap.get("PayScale_ID"));
  }

  get_trainee_dtls(apln_slno: any, gen_id: any, apln_status: any,PayScale_ID:any) {
    console.log(apln_slno, gen_id, apln_status);
    
    this.api.getTraineDtls(apln_slno, gen_id, apln_status).subscribe(
      (res) => {
        this.apln_list = res;

        console.log(this.apln_list);
        this.get_Payscale(this.apln_list[0].cont_id,PayScale_ID);
        this.initvalueFormGroup();
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
      Line_name: [this.apln_list[0].Line_Name],
      Cont_company_name: [this.apln_list[0].Cont_company_name],
      con_Id: [this.apln_list[0].cont_id],
      gen_id: [this.apln_list[0].gen_id],
      punch_id: [this.apln_list[0].biometric_no],
      birthdate: [this.apln_list[0].birthdate],
      effective_date: [this.apln_list[0].doj],
    });
  }

  get_Payscale(con_Id: any,PayScale_ID:number) {
    console.log(con_Id);
    console.log(PayScale_ID);
    
    this.api.getConPayscale(this.plant_Code, con_Id).subscribe(
      (res) => {
        this.payscale_Data = res;
     console.log(res);
     
        const currentPayScale = this.payscale_Data.find((item:any) => item.PayScale_ID == PayScale_ID);
  console.log(currentPayScale);
  
  
        if (currentPayScale) {
          console.log('Current PayScale:', currentPayScale);
          this.CurrentPayScaleFormGroup.patchValue(currentPayScale);
          
  
          console.log('CurrentPayScaleFormGroup value:', this.CurrentPayScaleFormGroup.value);
        } else {
          console.log('No matching PayScale found for ID:', this.CurrentPayScale_ID);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  onInputChanged(event: any, controlName: string) {
    const newValue = event.target.value;
    const numericValue = parseFloat(newValue);
    this.NewPayScaleFormGroup.get(controlName)?.patchValue(numericValue);
  }

  onOptionSelected(selectedData: any) {
    console.log("Selected data:", selectedData);
    this.selectedPayscale = selectedData;
    this.payscaleForm = true;

if(selectedData.PayScale_ID == this.CurrentPayScale_ID){
  this.reviseButton=true
}
else{
  this.reviseButton=false
}
    // to get max  amount
    // this.payScaleFormGroup.patchValue(this.selectedPayscale);
    this.NewPayScaleFormGroup.patchValue(this.selectedPayscale);
    
  }

  goBack(): void {
    this.location.back();
  }
  openAlertDialog(message: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: "Check",
        message: message,
      },
    });
  }
  submit(){
    const data = {
      PayScale_ID: this.NewPayScaleFormGroup.get('PayScale_ID')?.value,
      Effective_Date:this.NewPayScaleFormGroup.get('Effective_Date')?.value,
      apln_slno: this.formGroup.get('apln_slno')?.value,
          plant_Code: this.plant_Code,
          Requested_By: this.userEmpcode,
        };
      this.api.reviseWagemaster(data).subscribe((res: any) => {
        this.router.navigate(["/rml/contra/upt_payscale"]);
        this.openAlertDialog(`${res}`);
      });

    
  }

}
