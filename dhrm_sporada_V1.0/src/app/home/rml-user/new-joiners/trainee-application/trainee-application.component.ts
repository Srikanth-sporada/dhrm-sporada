import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-trainee-application",
  templateUrl: "./trainee-application.component.html",
  styleUrls: ["./trainee-application.component.css"],
})
export class TraineeApplicationComponent implements OnInit {
  mobilenum: any = "";
  companyname: any = "";
  plantname: any = "";
  isHrappr: any;
  plantcode: any;
  companycode: any;
  errmsg: any = "";
  items: any[] = [];
  public inputType: string = "password";
  public Tvalue: string = "";

  // traineeApplicationForms: FormGroup;
  traineeApplicationForms: FormGroup = new FormGroup({});

  // TrianeeApplicationComponent constructor
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cookie: CookieService,
    private router: Router,
    private service: ApiService,
    private toastService: ToastService
  ) {
    // initializing the trainee application form with form builder
    this.traineeApplicationForms = fb.group({
      mobileNumber: [
        "",
        [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
      ],
      company: ["", Validators.required],
      plant: ["", Validators.required],
      pass: ["", Validators.required],
    });
    this.mobilenum = this.traineeApplicationForms.controls["mobileNumber"].value;
    this.companyname = this.traineeApplicationForms.controls["company"].value;
  }

  /*
  show() {
    console.log(this.traineeApplicationForms.value);
  }
 */

  // on component initialization
  ngOnInit(): void {
    // getting compoany code
    this.getcompanycode();
    this.toastService.success('Test Toaster!');
  }

  // setting cookie with mobile number
  setCookie() {
    this.cookie.set("mobilenum", this.mobilenum);
  }

  // password type toggle
  updateInput(event: any): void {
    if (event.target.checked) {
      this.inputType = "text";
    } else {
      this.inputType = "password";
    }
  }

  // getting plant code based on company selection
  getplantcode(event: any) {
    console.log(event.target.value);
    this.traineeApplicationForms.controls["plant"].setValue("");
    var index = event.target.value.split(".")[0] - 1;
    var company = { company_name: this.companycode[index].sno };
    this.service.getPlantCode(company).subscribe({
      next: (response) => {
        console.log(response);

        this.plantcode = response;
      },
      error: (error) => this.toastService.error(error.message),
    });
  }

  // getting company code from api
  getcompanycode() {
    this.service.getCompanyCode().subscribe({
      next: (response) => {
        this.companycode = response;
      },
      error: (error) => this.toastService.error(error.message),
    });
  }

  // sending form data to api
  sendFormData() {
    var x = this.traineeApplicationForms.controls["company"].value.split(".")[0].trim();
    var y = this.traineeApplicationForms.controls["company"].value.split(".")[1].trim();
    this.traineeApplicationForms.controls["company"].setValue(this.companycode[x - 1].sno);

    if (this.traineeApplicationForms.invalid) {
      this.toastService.error('mandatory feilds are not yet filled')
    } else {
      this.companyname = this.companycode[x - 1].sno;

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
                  // navigating to trainee application form
                  this.router.navigate([
                    "/forms",
                    this.mobilenum,
                    this.companyname,
                  ]);
                },
              });
          } else if (this.errmsg.status == "incomplete") {
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
                  this.router.navigate([
                    "/forms",
                    this.mobilenum,
                    this.companyname,
                  ]);
                },
              });
          } else if (this.errmsg.status == "registered") {
            this.toastService.warn('Your application has already been registered. kindly contact HR department')
            console.log(this.traineeApplicationForms.value);
          }else if(this.errmsg.status == "failed"){
            this.toastService.error(this.errmsg.message);
          }
        },
        error: (error: any) => this.toastService.error(error.message),
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
}
