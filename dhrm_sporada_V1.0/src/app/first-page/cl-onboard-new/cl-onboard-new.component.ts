import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment.prod";
import { Utility } from "src/app/utils/utils";
import { Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";

@Component({
  selector: "app-cl-onboard-new",
  templateUrl: "./cl-onboard-new.component.html",
  styleUrls: ["./cl-onboard-new.component.css"],
})

export class ClOnboardNewComponent implements OnInit {

  companyList:any = [];
  plantList:any = [];
  apln_slno:any;
  apprenticeType: any = [
    { label: "CL-Labour", value: "CL" },
    { label: "CL-Piece Rate", value: "CL - PIECE RATE" },
  ];
  clApplicationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private apiService: ApiService,
  ) {
    /** construct application form */
    this.clApplicationForm = this.formBuilder.group({
      aadhar_no: ["", [Validators.required]],
      apprentice_type: ["", Validators.required],
      mobile_no1: ["", [Validators.required]],
      company_code:['',Validators.required],
      plant_code:['',Validators.required],
    });
  }

  ngOnInit(): void {
    /** get company code */
    this.getcompanycode();
  }


  /**
   * get company code list
   * @property {*} companyList
   */
  getcompanycode() {
    this.apiService.getCompanyCode().subscribe({
      next: (response) => {
        this.companyList = response;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message});
      }
    });
  }

  /** get plant by company code */
  getPlantsByCompanyCode(compantCode:any){
    this.apiService.getPlantsByCompanyCode(compantCode).subscribe({
      next: (response:any) => {
         if(response?.message == 'failed' || response?.message == 'failure'){
        this.messageService.add({severity:'error',summary:'Error Occured!'})
      }
       this.plantList = response;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }

  /** check user adhaar and number */
  checkUserAdhaar() {
    console.log('formdata:',this.clApplicationForm.value)
    this.apiService
      .checkAdhaarClOnboardNew(this.clApplicationForm.value)
      .subscribe({
        next: (response: any) => {
          console.log("Aadhar check:", response);
          if (response?.success) {
            /** route to contractor-application */
            console.log('response:',response);
            this.apln_slno = response?.apln_slno;
            this.navigateToOnboardForm();
          }
        },
        error: (error: any) => {
          console.error("ERROR:", error);
          this.messageService.add({
            severity: "error",
            summary: error?.error?.message,
          });
        },
      });
  }

  /** navigate to cl onboad application form */
  navigateToOnboardForm() {
    const mobileNo = this.clApplicationForm.get('mobile_no1')?.value;
    const type = this.clApplicationForm.get('apprentice_type')?.value;
    const aadhar = this.clApplicationForm.get('aadhar_no')?.value;
    const apln_slno = this.apln_slno;
    const company = this.clApplicationForm.get('company_code')?.value;
    const plant = this.clApplicationForm.get('plant_code')?.value
    console.log(`cl-onboard/${aadhar}/${mobileNo}/${type}/${company}/${plant}/${apln_slno}`)
    this.router.navigateByUrl(`cl-onboard/${aadhar}/${mobileNo}/${type}/${company}/${plant}/${apln_slno}`);
    // this.router.navigate([
    //  '/cl-onboard',
    //   aadhar,
    //   mobileNo,
    //   encodeURIComponent(type),
    //   encodeURIComponent(company),
    //   encodeURIComponent(plant),
    //   apln_slno
    // ])
  }

  /** 
   * find plant & company name by code
   */
  findCodeByName(type:any,searchValue:any){
    if(type === 'company'){
      const {company_name} = this.companyList.find((company:any) => company.company_code == searchValue);
      return company_name
    }else{
       const {plant_name} = this.plantList.find((plant:any) => plant.plant_code == searchValue);
       return plant_name;
    }
  }
}
