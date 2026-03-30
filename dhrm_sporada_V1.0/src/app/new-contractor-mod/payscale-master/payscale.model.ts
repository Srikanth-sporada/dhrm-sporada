

export class NewPayScaleObj{
    Payscale_ID: number
    Con_Id: number
    Payscale_code: string
    EffectiveDate:string
  

}

export class NewEarningAllowance{
    Basic_amt: number 
    Stipend: number 
    DA_amt: number 
    HRA_amt: number 
    Spcl_allow_amt: number
    Skilled_allow_amt: number
    Leave_Salary_amt: number
    Washing_allow_amt: number
    Monthly_Bonus_amt:number
    Attendance_Bonus_amt: number
    Sat_Mon_amt:number
    Amenities_allow_amt:number
    Retention__amt:number
    Night_shift_allow_amt:number
    // new
    hostel:number
    Food:number
    Workallowance:number
    Other_allow_1_amt: number
    Other_allow_2_amt: number
    Other_allow_3_amt: number
    Other_allow_4_amt: number
    Gross_Earnings:number
}

export class NewDeduction{
Canteen_amt:number
Transport_amt :number
WC_Policy_amt: number
Professional_Tax_amt: number
Insurance: number
Shoes_amt: number
Uniform_Tshirt: number
Goggles: number
Coat: number
Other_deduction_1_amt: number
Other_deduction_2_amt: number
Other_deduction_3_amt: number
Other_deduction_4_amt: number
Gross_Deduction:number
}




export class NewPaidToContractor{
Service_chrge:number
Service_percent:number
Service_Type:string
Sc_Base:string
Emp_Comp_Ins:number
NSDC:number
    Uniform_Charges_amt:number
    LWF:number
    Learning_Fee:number
    Workmen_Compensation:number
    Insurance_Premium:number
    Higher_Education_Fee:number
}


export class Emp_Payscale{
    Apln_Slno:number
    Payscale_Id:number
}



export class PayscaleObj{
    Payscale_SlNo: number
    Plant_code: string
    Payscale_code: string
    Description: string
    Wage_type: string
    Basic_amt: number =0
    stipend: number =0
    DA_amt: number =0
    HRA_amt: number =0
    Con_Id: number
    Conveyance_amt: number=0
    Medi_allow: string
    Medi_allow_amt: number=0
    Attendance_allow: string
    Attendance_allow_amt: number=0
    Spcl_allow: string
    Spcl_allow_amt: number=0
    Night_shift_allow: string
    Night_shift_allow_amt: number=0
    Skilled_allow: string
    Skilled_allow_amt: number=0
    Unskilled_allow: string
    Unskilled_allow_amt: number=0
    Transport_allow: string
    Transport_allow_amt: number=0
    Washing_allow: string
    Washing_allow_amt: number=0
    leave_Salary: string
    leave_Salary_amt: number=0
    Attendance_bonus: string
    Attendance_bonus_amt: number=0
    Food_Allowance: string
    Food_Allowance_amt: number=0
    insurance_deduction: string
    insurance_deduction_amt: number=0
    Other_allow_1: string
    Other_allow_1_amt: number
    Other_allow_2: string
    Other_allow_2_amt: number
    Other_allow_3: string
    Other_allow_3_amt: number
    Other_allow_4: string
    Other_allow_4_amt: number
    // new
    hostel_4:string
    hostel:number
    Food_4:string
    Food:number
    Workallowance_4:string
    Workallowance:number
    // Canteen_deduct: string
    PF_Check: string
    ESI_Check: string
    max_Canteen:string
    canteen_Check:string
    max_PF_Value:string
    max_ESI_Value:string
    Prof_Tax: string
    Service_chrg:string
    Service_Percent:string
    Service_Value:string
    Service_Tax:string


    Other_deduct_1: string
    Other_deduct_1_amt: number
    Other_deduct_2: string
    Other_deduct_2_amt: number
    Other_deduct_3: string
    Other_deduct_3_amt: number
    Other_deduct_4: string
    Other_deduct_4_amt: number

    PF_Emplyoyee_Percent: number
    PF_Emplyoyer_Percent: number
    ESI_Emplyoyee_Percent: number
    ESI_Emplyoyer_Percent: number

    Effective_from: String
    Status: boolean
    Created_By: string|null
    Created_On: string 
    Modifed_By: string|null
    Modifed_On: string 
}