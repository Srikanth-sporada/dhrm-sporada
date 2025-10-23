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
  constructor(
    private http: HttpClient,
    public location: Location,
    private active: ActivatedRoute,
    private router: Router,
    private service: FormService,
    private apiservice: ApiService,
    private dailog:MatDialog,
    private messageService:MessageService
  ) {
    this.action = this.active.snapshot.paramMap.get("action");
  }

  goback() {
    this.location.back();
  }

  ngOnInit(): void {
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
          console.log(response);
        },
        error: (err) => this.messageService.add({severity:'error',summary:err.message})
      });
      this.messageService.add({severity:'info',summary:'Application has been approved'})
    // window.alert("Application has been approved");
    this.router.navigate(["rdhrm/new_joiners/hr-approval"]);
  }

  rejected() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile");
    this.uniqueId.company = this.active.snapshot.paramMap.get("company");

    this.service.rejected(this.uniqueId);
    this.messageService.add({severity:'info',summary:'Application has been rejected'})
    // window.alert("Application has been rejected");
    this.router.navigate(["rdhrm/new_joiners/hr-approval"]);
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
      },
      error: (error) => this.messageService.add({severity:'error',summary:error.message}),
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
      error: (error) => this.messageService.add({severity:'error',summary:error.message}),
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
      error: (error) => this.messageService.add({severity:'error',summary:error.message}),
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
      error: (error) => this.messageService.add({severity:'error',summary:error.message}),
    });
  }

  openDailog(){
    const rejectDailog=this.dailog.open(RejectComponent,{disableClose:false,
    width:'600px',
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
}
