import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators ,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-payroll-display-form',
  templateUrl: './payroll-display-form.component.html',
  styleUrls: ['./payroll-display-form.component.css']
})
export class PayrollDisplayFormComponent implements OnInit {
  @Input() selectedPayscale: any;
  @Input() selectedPayrollData: any;
  @Input() selectedContractorData: any;
  @Input() Pay_apln_slno: any;

  Cl_Salary_Form: FormGroup;
  isLoading: boolean = true;

  constructor(private fb:FormBuilder) { 
    
  }

  ngOnInit(): void {

    this.initializeForm();

    console.log('selectedPayscale:', this.selectedPayscale);
    console.log('selectedPayrollData:', this.selectedPayrollData);
    console.log('selectedContractorData:', this.selectedContractorData);
    console.log('Pay_apln_slno:', this.Pay_apln_slno);

   
  }
 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPayscale || changes.selectedPayrollData || changes.selectedContractorData || changes.Pay_apln_slno) {
      this.initializeForm();
    }
  }

  initializeForm(): void {

    if (this.selectedPayscale &&  this.selectedPayrollData.length > 0 && this.selectedContractorData.length > 0 && this.Pay_apln_slno) {

      const payrollData = this.selectedPayrollData[0];
      const contractorData = this.selectedContractorData[0];
      this.Cl_Salary_Form = this.fb.group({
        payDescp: [this.selectedPayscale?.Description],
        apln_slno: [this.Pay_apln_slno],
        effective_from: [this.selectedPayscale?.Effective_from],
        basic_amt: [this.selectedPayscale?.Basic_amt],
        da_amt: [this.selectedPayscale?.DA_amt],
        hra_amt: [this.selectedPayscale?.HRA_amt],
        conveyance_amt: [this.selectedPayscale?.Conveyance_amt],
        medi_amt: [this.selectedPayscale?.Medi_allow_amt],
        spcl_amt: [this.selectedPayscale?.Spcl_allow_amt],
        skilled_amt: [this.selectedPayscale?.Skilled_allow_amt],
        unskilled_amt: [this.selectedPayscale?.Unskilled_allow_amt],
        attend_amt: [this.selectedPayscale?.Attendance_allow_amt],
        night_amt: [this.selectedPayscale?.Night_shift_allow_amt],
        transport_amt: [this.selectedPayscale?.Transport_allow_amt],
        washing_amt: [this.selectedPayscale?.Washing_allow_amt],
        other_allow_amt1: [this.selectedPayscale?.Other_allow_1_amt],
        other_allow_amt2: [this.selectedPayscale?.Other_allow_2_amt],
        other_allow_amt3: [this.selectedPayscale?.Other_allow_3_amt],
        other_allow_amt4: [this.selectedPayscale?.Other_allow_4_amt],

        other_allow1_amt_name: [this.selectedPayscale?.Other_allow_1],
        other_allow2_amt_name: [this.selectedPayscale?.Other_allow_2],
        other_allow3_amt_name: [this.selectedPayscale?.Other_allow_3],
        other_allow4_amt_name: [this.selectedPayscale?.Other_allow_4],

        Total_earnings_amt: [''],
        DPF_amt: [payrollData?.PF_Employee],
        DESI_amt: [payrollData?.ESI_Employee],
        DLWF_amt: [payrollData?.LWF_Employee],
        canteen: [this.selectedPayscale?.Canteen_deduct],
        other_ded_amt1: [this.selectedPayscale?.Other_deduct_1_amt],
        other_ded_amt2: [this.selectedPayscale?.Other_deduct_2_amt],
        other_ded_amt3: [this.selectedPayscale?.Other_deduct_3_amt],
        other_ded_amt4: [this.selectedPayscale?.Other_deduct_4_amt],
        other_ded_amt1_name: [this.selectedPayscale?.Other_deduct_1],
        other_ded_amt2_name: [this.selectedPayscale?.Other_deduct_2],
        other_ded_amt3_name: [this.selectedPayscale?.Other_deduct_3],
        other_ded_amt4_name: [this.selectedPayscale?.Other_deduct_4],
        total_deduction: [''],
        EPF_amt: [payrollData?.PF_Employer],
        EESI_amt: [payrollData?.ESI_Employer],
        ELWF_amt: [payrollData?.LWF_Employer],
        service_charge_amt: [contractorData?.Service_Charge],
        Service_tax_amt: [contractorData?.Service_Tax],
        ctc_amt: [''],
        net_amt: [''],
      });
    
      this.isLoading = false;
    }
  }


  submit(){

    console.log(this.Cl_Salary_Form.value);
    console.log('selectedPayscale:', this.selectedPayscale);
    console.log('selectedPayrollData:', this.selectedPayrollData);
    console.log('selectedContractorData:', this.selectedContractorData);
    console.log('Pay_apln_slno:', this.Pay_apln_slno);

  }

}
