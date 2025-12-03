import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { ToastService } from "angular-toastify";
import { MessageService } from 'primeng/api';
import { Input } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Utility } from 'src/app/utils/utils';
@Component({
  selector: 'trainee-application',
  templateUrl: './trainee-application.component.html',
  styleUrls: ['./trainee-application.component.css']
})

export class TraineeApplicationComponent implements OnInit {
  /** company and plant code from first page component */
  @Input() companyCode:any;
  @Input() plantCode:any;
  mobilenum: any = "";
  companyname: any = "";
  companyCodeSno:any;
  plantName:any;
  plantname: any = "";
  isHrappr: any;
  plantcode: any;
  companycode:any;
  errmsg: any = "";
  items: any[] = [];
  disableCompayDropdown:boolean = environment.disableCompanyDropDown;
  disablePlantDropdown:boolean = environment.disablePlantDropDown;
  public inputType: string = "password";
  public Tvalue: string = "";

  // traineeApplicationForms: FormGroup;
  traineeApplicationForms: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private service: ApiService,
    private messageService: MessageService,
    public utils:Utility
  ) {}

  // on component initialization
  ngOnInit(): void {
    /** getting company and plant data */
    this.getcompanycode();
    this.getPlantsByCompanyCode(this.companyCode);

    
   
    // initializing the trainee application form with form builder
    this.traineeApplicationForms = this.fb.group({
      mobileNumber: ["",Validators.required],
      company: ['', Validators.required],
      plant: ['', Validators.required],
      pass: ["", Validators.required],
    });
    this.mobilenum = this.traineeApplicationForms.controls["mobileNumber"].value;
    this.companyname = this.traineeApplicationForms.controls["company"].value;
    console.log(this.traineeApplicationForms.value);
  }

  // setting cookie with mobile number
  setCookie() {
    this.cookie.set("mobilenum", this.mobilenum);
  }
  // getting plant code based on company selection
  getplantcode(event: any) {
    console.log(event.value);
    // this.traineeApplicationForms.controls["plant"].setValue("");
    var company = { company_name: event.value };
    this.service.getPlantCode(company).subscribe({
      next: (response) => {
        console.log(response);
        this.plantcode = response;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message})
      },
    });
  }

  // getting company code from api
  getcompanycode() {
    this.service.getCompanyCode().subscribe({
      next: (response) => {
        this.companycode = response;
        this.companyCodeSno = this.companycode.filter((company:any) => company.company_code == this.companyCode);
        /** setting company sno */
        this.traineeApplicationForms.controls['company'].setValue(this.companyCodeSno[0]?.sno)
       console.log("company",this.companyCodeSno);
      },
      error: (error) => this.messageService.add({severity:'error',summary:error.message})
    });
  }

  /** trainee application form api call */
  sendFormData() {
    /** throttle handle function */
    this.utils.throttledClick();
    // console.log(this.traineeApplicationForms.value)
    if (this.traineeApplicationForms.invalid) {
      this.messageService.add({severity:'error',summary:'Please fill all fields!'})
    } else {
      console.log('TRAINEE APPLICATION DATA:',this.traineeApplicationForms.value)
      this.service.traineeFormData(this.traineeApplicationForms.value).subscribe({
        next: (response: any) => {
          this.errmsg = response;
          if (this.errmsg.status == "newform") {
            this.service
              .getHr({ username: "newuser", user: "emp2" })
              .subscribe({
                next: (response) => {
                  console.log("hr", response);
                  this.isHrappr = response;
                  sessionStorage.setItem("ishr", this.isHrappr[0]?.Is_HR);
                  sessionStorage.setItem(
                    "ishrappr",
                    this.isHrappr[0]?.Is_HRAppr
                  );
                  sessionStorage.setItem("user", "emp2");
                  /** navigating to trainee application form */ 
                  this.router.navigate([
                    "/forms",
                    this.mobilenum,
                    this.traineeApplicationForms.value.company,
                  ]);
                },
              });
          } else if (this.errmsg.status == "PENDING") {
            this.service
              .getHr({ username: "newuser", user: "emp2" })
              .subscribe({
                next: (response) => {
                  console.log("hr", response);
                  this.isHrappr = response;
                  sessionStorage.setItem("ishr", this.isHrappr[0]?.Is_HR);
                  sessionStorage.setItem(
                    "ishrappr",
                    this.isHrappr[0]?.Is_HRAppr
                  );
                  sessionStorage.setItem("user", "emp2");
                   /** navigating to trainee application form */
                  this.router.navigate([
                    "/forms",
                    this.mobilenum,
                    this.companyname,
                  ]);
                },
              });
          } else if (this.errmsg.status == "registered") {
            this.messageService.add({severity:'info',summary:'Already Registered! Contact HR'})
            this.traineeApplicationForms.reset();
            console.log(this.traineeApplicationForms.value);
          }else if(this.errmsg.status == "failed"){
           this.messageService.add({severity:'info',summary:this.errmsg.message});
          /** window reload function */
           setTimeout(() => {
             window.location.reload();
           }, 3100)
          }
        },
        error: (error: any) => {
          console.error('ERROR:',error);
          this.messageService.add({severity:'error',summary:error?.message})
        },
      });
    }
  }

  // trim mobile number to last 4 digits
  getPassword(event: any) {
    if (event?.length == 10) {
       this.traineeApplicationForms.controls["pass"].setValue(
        this.traineeApplicationForms.controls["mobileNumber"].value.substr(-4)
      );
      this.Tvalue = this.traineeApplicationForms.controls["mobileNumber"].value.substr(-4);
    }
  }

  submitTraineeApplicationForm() {
    console.log(this.traineeApplicationForms.value);
  }

  /** get plant by company code */
  getPlantsByCompanyCode(compantCode:any){
    this.service.getPlantsByCompanyCode(compantCode).subscribe({
      next: (response:any) => {
         if(response?.message == 'failed' || response?.message == 'failure'){
        this.messageService.add({severity:'error',summary:'Error Occured!'})
      }
       this.plantcode = response;
       this.plantName = this.plantcode.filter((plant:any) => plant.plant_code == this.plantCode);
       console.log(this.plantcode);
       this.traineeApplicationForms.controls['plant'].setValue(this.plantName[0]?.plant_name);
       console.log(this.traineeApplicationForms.value);
       console.log(response);
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }
}
