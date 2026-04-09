import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Location } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { threadId } from "worker_threads";
import { FormService } from "../form.service";
import { environment } from "src/environments/environment.prod";
import { ApiService } from "src/app/home/api.service";
import { MatDialog } from "@angular/material/dialog";
import { RejectComponent } from "./reject/reject.component";
import { MessageService } from "primeng/api";
import { FormGroup, FormBuilder } from "@angular/forms"; // #NEW FROM RML
@Component({
  selector: "app-hr-view-data",
  templateUrl: "./hr-view-data.component.html",
  styleUrls: ["./hr-view-data.component.css"],
})
export class HrViewDataComponent implements OnInit {
  action: any;
  var1: any = "NULLL";
  uniqueId: any = { mobile: "" };
  basic: any;
  career: any;
  education: any;
  family: any;
  url: any = environment.path + "/";
  flag: any = false;

  urlforResume: any;
  urlforMark: any;
  urlforTc: any;
  urlforaadhar: any;
  urlforbankpass: any;
  urlforphoto: any;
  urlforSign: any;
  tick: any = "✔️";
  ex: any = "";
  is_vaccinated: any;

  url_appointmentorder_file: any;
  url_declaration_file: any;
  url_medicalfitness_file: any;
  url_formA4_file: any;
  url_form11_file: any;
  url_formh2_file: any;
  url_natx_file: any;
  // trainee details for onboard form
  apln_status: any;
  applicationNumber:any;
  // #NEW FROM RML
  NewPayScaleFormGroup: FormGroup;
  payscale_Data: any;
  plant: any = sessionStorage.getItem("plantcode");
  genid : any = sessionStorage.getItem('user_name');
  payscaleForm = false;
  cont_id: any;
  constructor(
    private http: HttpClient,
    public location: Location,
    private active: ActivatedRoute,
    private router: Router,
    private service: FormService,
    private apiservice: ApiService,
    private dailog:MatDialog,
    private messageService:MessageService,
    private fb: FormBuilder, // #NEW FROM RML
  ) {
    this.action = this.active.snapshot.paramMap.get("action");
  }

  goback() {
    this.location.back();
  }

  ngOnInit(): void {
    /** get Trainee data API's */
    this.getdatabasic();
    this.getdataqualifn();
    this.getdatacareer();
    this.getdatafamily();

    setTimeout(() => {
      console.log(this.basic[0]?.apln_status);
      if (this.basic[0]?.apln_status == "SUBMITTED") this.flag = true;

      if (this.basic[0]?.any_empl_rane == "Y")
        this.basic[0].any_empl_rane = "Yes";
      else if (this.basic[0]?.any_empl_rane == "N")
        this.basic[0].any_empl_rane = "No";

      if (this.basic[0]?.prev_rane_empl == "Y")
        this.basic[0].prev_rane_empl = "Yes";
      else if (this.basic[0]?.prev_rane_empl == "N")
        this.basic[0].prev_rane_empl = "No";
      var dt = this.basic[0]?.dose1_dt;
      var dt2 = this.basic[0]?.dose2_dt;
      if (dt?.includes("-")) this.is_vaccinated = "YES";
      else if (dt == null && dt2 == null) this.is_vaccinated = "NO";
      else if (dt == "null" && dt2 == "null") this.is_vaccinated = "NO";
      else this.is_vaccinated = "YES";

      this.url_appointmentorder_file =
        this.url + "uploads/" + this.basic[0]?.other_files8;
      this.url_declaration_file =
        this.url + "uploads/" + this.basic[0].other_files9;
      this.url_medicalfitness_file =
        this.url + "uploads/" + this.basic[0].other_files10;
      this.url_formA4_file =
        this.url + "uploads/" + this.basic[0].other_files11;
      this.url_form11_file =
        this.url + "uploads/" + this.basic[0].other_files12;
      this.url_formh2_file =
        this.url + "uploads/" + this.basic[0].other_files13;
      this.url_natx_file = this.url + "uploads/" + this.basic[0].other_files14;

      this.urlforResume = this.url + "uploads/" + this.basic[0].other_files1;
      this.urlforMark = this.url + "uploads/" + this.basic[0].other_files2;
      this.urlforTc = this.url + "uploads/" + this.basic[0].other_files3;
      this.urlforaadhar = this.url + "uploads/" + this.basic[0].other_files4;
      this.urlforbankpass = this.url + "uploads/" + this.basic[0].other_files5;
      this.urlforphoto = this.url + "uploads/" + this.basic[0].other_files6;
      this.urlforSign = this.url + "uploads/" + this.basic[0].other_files7;

      console.log(this.urlforResume);
    }, 1000);
     // #NEW FROM RML
    this.NewPayScaleFormGroup = this.fb.group({
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
      EM_ESI_Cal_Val: [null],
      EM_PF_Cal_Val: [null],
      EMP_PF_Cal_Val: [null],
      EMP_ESI_Cal_Val: [null],
      EM_PF_Percent: [null],
      EM_ESI_Percent: [null],
      EMP_PF_Percent: [null],
      EMP_ESI_Percent: [null],
      Service_Tax_Val: [null],
      Servive_Charge_Val: [null],
      Effective_Date: [null],
      Effective_Date1: [null],
      CTC: [null],
      ToTal_Base_Value: [null],
      Net_Take_Home: [null],
    })
  }

  approved() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile");
    this.uniqueId.company = this.active.snapshot.paramMap.get("company");
    this.service.approved(this.uniqueId);

    this.apiservice
      .approved_mail({
        plant_code: sessionStorage.getItem("plant_code"),
        mobile: this.uniqueId.mobile,
        company: this.uniqueId.company,
      })
      .subscribe({
        next: (response: any) => {
          console.log('APPROVED MAIL RESPONSE:',response);
        },
        error: (err) => {
          console.error('HR APPROVE MAIL API ERROR:',err);
          this.messageService.add({severity:'error',summary:err.message})
        }
      });
      this.messageService.add({severity:'info',summary:'Application has been approved'})
      this.router.navigate(["rhrm/new_joiners/hr-approval"]);
  }

  rejected() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile");
    this.uniqueId.company = this.active.snapshot.paramMap.get("company");

    this.service.rejected(this.uniqueId);
    this.messageService.add({severity:'info',summary:'Application has been rejected'})
    this.router.navigate(["rhrm/new_joiners/hr-approval"]);
  }

  getdatabasic() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile");
    this.uniqueId.company = this.active.snapshot.paramMap.get("company");

    this.service.getdatabasic(this.uniqueId).subscribe({
      next: (response) => {
        console.log("basic", response);
        this.basic = response;
        // setting trainee details for onboard
        this.apln_status = this.basic[0]?.apln_status;
        this.applicationNumber = this.basic[0]?.apln_slno;
        /** #NEW FROM RML */
        this.cont_id = this.basic[0]?.cont_id;
        const payScaleId = this.basic[0]?.payScaleInfo?.PayScale_ID;
        if (this.cont_id && payScaleId) {
          console.log('TRAINEE PAYSCALE ID:',payScaleId);
          this.get_Payscale(payScaleId);
        }
      },
      error: (error) => {
        console.error('GET BASIC API ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    });
  }

  getdataqualifn() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile");
    this.uniqueId.company = this.active.snapshot.paramMap.get("company");

    this.service.getdataqualifn(this.uniqueId).subscribe({
      next: (response) => {
        console.log("qual", response);
        this.education = response;
      },
      error: (error) => {
        console.error('GET QUALIFICATION API ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }

  getdatafamily() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile");
    this.uniqueId.company = this.active.snapshot.paramMap.get("company");

    this.service.getdatafamily(this.uniqueId).subscribe({
      next: (response) => {
        console.log("fam", response);
        this.family = response;
      },
      error: (error) => {
        console.error('GET FAMILY DATA API ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message});
      },
    });
  }

  getdatacareer() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile");
    this.uniqueId.company = this.active.snapshot.paramMap.get("company");

    this.service.getdatacareer(this.uniqueId).subscribe({
      next: (response) => {
        console.log("career", response);
        this.career = response;
      },
      error: (error) => {
        console.error('GET CAREER API ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message});
      },
    });
  }

  openDailog() {
    const rejectDailog = this.dailog.open(RejectComponent, {
      disableClose: false, // #NEW FROM RML
      width: '600px',
    })
    rejectDailog.afterClosed().subscribe(data=>{
      if(data){
        this.uniqueId.reason=data
        this.rejected()
      }
    })
  }

  printid() {
    const url = this.router.createUrlTree([  `/${environment.prodLink}`,  "idcard",
      this.apln_status,
      this.uniqueId.mobile,
      this.uniqueId.company,
    ]);
    window.open(url.toString(), "_blank");
  }

  // #NEW FROM RML
  /**
   * get trainee payscale data #SINGLE
   * @param {*} payId
   * @memberof HrViewDataComponent
   */
  get_Payscale(payId: any) {
    const data = {
      plant_Code: this.plant,
      con_id: this.cont_id,
      PayScale_ID: payId,
    };

    this.service.getSinglePayscale(data).subscribe({
      next: (res: any) => {
        this.payscale_Data = res;
        if (Array.isArray(res) && res.length > 0) {
          this.payscaleForm = true;
          this.NewPayScaleFormGroup.patchValue(res[0]);
        }
      },
      error: (error) => {
        console.error("GET PAYSCALE API ERROR:", error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
    });
  }

// #NEW FROM RML
/**
 * @param {*} event
 * @param {string} controlName
 * @memberof HrViewDataComponent
 */
onInputChanged(event: any, controlName: string) {
    const newValue = event.target.value;
    const numericValue = parseFloat(newValue);
    this.NewPayScaleFormGroup.get(controlName)?.patchValue(numericValue);
  }
}
