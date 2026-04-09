import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormService } from "../form.service";
import { HttpClient,HttpEventType } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { MessageService, ConfirmationService } from "primeng/api";

@Component({
  selector: "app-forms",
  templateUrl: "./forms.component.html",
  styleUrls: ["./forms.component.css"],
})
export class FormsComponent implements OnInit, OnDestroy {
  bankdata: any;
  basicData: any;
  eduData: any;
  emerData: any;
  famData: any;
  otherData: any;
  prevData: any;
  a: any;
  uniqueKey: any;
  uniqueId: any = {
    mobile: "",
    company: this.active.snapshot.paramMap.get("company"),
  };
  ishr: any;
  Bodhi_training: any;
  dept_Id: any;
  Role_id: any;
  // #NEW FROM RML
  cont_id: any;
  ishrappr: any;
  status: any = { status: "" };
  basic: any;
  submit: any = "SUBMIT";
  apln_no: any = "";
  flag: any = true;
  apln_status: any = "";
  flag_submit_all: any = this.formservice.flag_submit_all;
  message: any = false;
  message_from_basic: any;
  message_from_bank: any;
  message_from_edu: any;
  message_from_choose: any;
  message_from_prev: any;
  message_from_emer: any;
  message_from_fam: any;
  message_from_lang: any;
  message_from_other: any;
  message_from_category: any;
  basicdetails: any;
  isHrappr: any;
  details: any;
  Load: any = false;
  // #NEW FROM RML
  payscale: any;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  all: any;
  userDetails: any;
  // show onboard form
  showOnboard: Boolean = true;
  showCategory: Boolean = false;
  constructor(
    private formservice: FormService,
    private service: ApiService,
    // #NEW FROM RML
    private http: HttpClient,
    private router: Router,
    private active: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnDestroy(): void {
    if (this.ishr == "undefined") {
      sessionStorage.clear();
    }
  }

  ngOnInit(): void {
    /** logged in user data */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails =
        this.all.Emp_Name.toUpperCase() +
        `(${this.all.User_Name})` +
        "-" +
        this.all.dept_name +
        "-" +
        this.all.plant_name;
    }
    this.getDataForID();
    /** get trainee basic data */
    this.getTraineeBasicData();
    console.log("MESSAGE", this.message);
  }

  /** get trainee basic */
  getTraineeBasicData() {
    this.formservice.getdatabasic(this.uniqueId).subscribe({
      next: (data: any) => {
        this.details = data;
        /** initial apln_slno */
        this.apln_no = this.details[0]?.apln_slno;
        console.log("NUMBER:", this.apln_no);
        this.Load = true;

        this.ishr = sessionStorage.getItem("ishr") || "";

        /**
         * @var showOnboard setting if application is filled by supervisor false
         * @var details[0] has trainee application data
         * @var showCategory if application is filled by supervisor true to show category
         * **/
        if (
          this.details[0]?.apprentice_type == "CL" &&
          this.details[0]?.cont_id
        ) {
          this.showOnboard = false;
          this.showCategory = true;
        }
        /**
         *  @var showOnboard
         * 1. setting false if trainee fills tha application
         * @var ishr if ishr is undefined the application is trainee
         * **/
        if (this.ishr == "undefined") {
          this.submit = "SUBMIT";
          this.showOnboard = false;
          this.message_from_category = false;
        } else {
          this.message_from_category = true;
          this.submit = "SEND FOR APPROVAL";
        }
        /** setting apln_status */
        this.apln_status = this.details[0]?.apln_status;

        if (this.ishr == "true" && this.apln_status == "NEW INCOMPLETE")
          this.submit = "SUBMIT";

        if (
          (this.apln_status == "NEW INCOMPLETE" && this.submit == "SUBMIT") ||
          (this.apln_status == "PENDING" &&
            this.submit == "SEND FOR APPROVAL") ||
          (this.apln_status == "REJECTED" && this.submit == "SEND FOR APPROVAL")
        )
          this.flag = true;
        else this.flag = false;
      },
      error: (error: any) => {
        console.error("GET BASIC API ERROR:", error);
        this.messageService.add({ severity: "error", summary: error?.message });
      },
    });
  }

  category_event(data: any) {
    console.log("catagerd", data);
    console.log("catagerd", data.Bodhi_training);
    this.Bodhi_training = data.Bodhi_training || "NO";
    this.Role_id = data.Role_id || "";
    this.dept_Id = data.dept_Id || "";
    // #NEW FROM RML
    this.payscale = data.payscale || "";
    this.cont_id = data.cont_id || ""; // make sure cont_id is captured
    console.log("data.category", data.category);
    console.log('DATA FROM CATEGORY:',data);

    this.message_from_category = data.category;
    console.log(this.message_from_category);
     // payscale mandatory only if cont_id exists
    const isPayscaleValid = this.cont_id ? !!this.payscale : true;

    if (
      this.message_from_category == false &&
      this.message_from_basic == false &&
      this.message_from_edu == false &&
      this.message_from_fam == false &&
      this.message_from_emer == false &&
      this.message_from_choose == false && // #NEW FROM RML
      this.dept_Id &&
      this.Role_id &&
      this.Bodhi_training &&
      isPayscaleValid // #NEW FROM RML
    ) {
      this.message = false;
    } else {
      this.message = true;
    }
  }

  eventchanger_basic(data: any) {
    console.log(data);

    this.message_from_basic = data.basic;

    if (
      this.message_from_category == false &&
      this.message_from_basic == false &&
      this.message_from_edu == false &&
      this.message_from_fam == false &&
      this.message_from_emer == false &&
      this.message_from_choose == false
    )
      this.message = false;
    else this.message = true;
  }

  eventchanger_fam(data: any) {
    console.log("family data change event:", data);
    this.message_from_fam = data.fam;

    if (
      this.message_from_category == false &&
      this.message_from_basic == false &&
      this.message_from_edu == false &&
      this.message_from_fam == false &&
      this.message_from_emer == false &&
      this.message_from_choose == false
    )
      this.message = false;
    else this.message = true;
  }

  eventchanger_emer(data: any) {
    console.log("emergency data:", data);
    this.message_from_emer = data.emer;

    if (
      this.message_from_category == false &&
      this.message_from_basic == false &&
      this.message_from_edu == false &&
      this.message_from_fam == false &&
      this.message_from_emer == false &&
      this.message_from_choose == false
    )
      this.message = false;
    else this.message = true;
  }

  eventchanger_edu(data: any) {
    console.log("education data:", data);

    this.message_from_edu = data.edu;

    if (
      this.message_from_category == false &&
      this.message_from_basic == false &&
      this.message_from_edu == false &&
      this.message_from_fam == false &&
      this.message_from_emer == false &&
      this.message_from_choose == false
    )
      this.message = false;
    else this.message = true;
  }

  eventchanger_choose(data: any) {
    console.log("file upload data:", data);

    this.message_from_choose = data.choose;

    if (
      this.message_from_category == false &&
      this.message_from_basic == false &&
      this.message_from_edu == false &&
      this.message_from_fam == false &&
      this.message_from_emer == false &&
      this.message_from_choose == false
    )
      this.message = false;
    else this.message = true;
  }

  allSave(event: Event) {
    if (
      this.message_from_category == true &&
      this.message_from_basic == true &&
      this.message_from_edu == true &&
      this.message_from_fam == true &&
      this.message_from_emer == true &&
      this.message_from_choose == true
    )
      this.message = true;
    else {
      // this.formservice.submitbank();
      // console.log(this.formservice.bank);

      // this.formservice.submitbasic();
      // console.log(this.formservice.basic);

      // this.formservice.submitedu();
      // console.log(this.formservice.edu);

      // this.formservice.submitemer();
      // console.log(this.formservice.emer);

      // this.formservice.submitfamily();
      // console.log(this.formservice.fam);

      // this.formservice.submitother();
      // console.log(this.formservice.other);

      // this.formservice.submitprev();
      // console.log(this.formservice.prev);

      // this.formservice.sumbitlang();

      console.log("this.ishr", this.ishr);
      console.log("type.ishr", typeof this.ishr);

      if (this.ishr !== "true") {
        // this.messageService.add({severity:'info',summary: "Your application " + this.apln_no +"has been submitted. \n Contact HR for more information"});

        // window.alert(
        //   "Your application " +
        //     this.apln_no +
        //     " has been submitted. \n Contact HR for more information"
        // );

        /**
         * confirmation service [primeng]
         * open the popup modal to show the application Number
         */
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message:
            "Your application " +
            this.apln_no +
            " has been submitted. \n Contact HR for more information",
          header: "Confirmation",
          rejectVisible: false,
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            /** route back to login */
            window.history.back();
          },
        });
        // this.router.navigate(["/"]);
      }

      if (this.ishr === "true") {
        console.log(this.ishr);

        // this.formservice.submitCategory(this.Bodhi_training,this.dept_Id,this.Role_id)

        // this.formservice
        //   .submitCategory(this.Bodhi_training, this.dept_Id, this.Role_id)
        //   .subscribe({
        //     next: (res: any) => {
        //       console.log("Data saved successfully");
        //       this.submitted();

        //       setTimeout(() => {
        //         this.mainalert();
        //       }, 1000);
        //       this.uniqueId.mobile =
        //         this.active.snapshot.paramMap.get("mobile_no1");
        //       this.uniqueId.company =
        //         this.active.snapshot.paramMap.get("company");
        //     },
        //     error: (error: any) => {
        //       console.error("Error saving data", error);
        //       if (error.status === 400) {
        //         console.log('SUBMIT CATEGORY API ERROR:',error);
        //         this.messageService.add({
        //           severity: "error",
        //           summary: error.error.message,
        //         });
        //       } else {
        //         this.messageService.add({
        //           severity: "error",
        //           summary: `An unexpected error occurred. Status code: ${error.status}`,
        //         });
        //         // alert(`An unexpected error occurred. Status code: ${error.status}`);
        //       }
        //     },
        //   });

        /** #NEW FROM RML */
        this.uploadProgress = 0;
        this.isUploading = true;

        this.formservice.submitCategory(
          this.Bodhi_training,
          this.dept_Id,
          this.Role_id,
          this.payscale
        ).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.uploadProgress = Math.round((100 * event.loaded) / event.total);
              console.log("Progress:", this.uploadProgress + "%");
            }
            if (event.type === HttpEventType.Response) {
              console.log("Data saved successfully:", event.body);
              this.isUploading = false;
              this.uploadProgress = 100;
              /** SUBMIT API CALL */
              this.submitted();
              setTimeout(() => this.mainalert(), 1000);
            }
          },
          error: (error:any) => {
            this.isUploading = false;
            console.error("SUMIT CATEGORY API ERROR:", error);
            this.messageService.add({severity:'error',summary:error?.message});
          }
        });
      }
    }
  }

  mainalert() {
    this.ishr = sessionStorage.getItem("ishr");

    if (this.ishr == "undefined") {
      this.alert();
      this.router.navigate([""]);
    } else if (this.ishr == "true") {
      this.alertforapproval();
      this.router.navigate(["rhrm/new_joiners/trainee-application-status"]);
    }
  }

  alert() {
    this.messageService.add({
      severity: "info",
      summary:
        "Your application " +
        this.apln_no +
        " has been submitted. \n Contact HR for more information",
    });
    // window.alert(
    //   "Your application " +
    //     this.apln_no +
    //     " has been submitted. \n Contact HR for more information"
    // );
  }
  alertforapproval() {
    this.messageService.add({
      severity: "info",
      summary: "Trainee Form " + this.apln_no + " had been updated",
    });
    // window.alert("Trainee Form " + this.apln_no + " had been updated");
  }

  submitted() {
    this.ishr = sessionStorage.getItem("ishr");
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile_no1");
    this.uniqueId.company = this.details[0]?.company_code;
    console.log(this.uniqueId);
    console.log('SUBMITTED MAIL API DATA:', {
          plant_code: sessionStorage.getItem("plantcode"),
          mobile: this.uniqueId.mobile,
          company: this.uniqueId.company,
        })
    if (this.ishr == "true" && this.apln_status == "PENDING") {
      /** mail API */
      this.service
        .submitted_mail({
          plant_code: sessionStorage.getItem("plantcode"),
          mobile: this.uniqueId.mobile,
          company: this.uniqueId.company,
        })
        .subscribe({
          next: (response: any) => {
            console.log('SUBMITTED MAIL API RES:',response);
          },
          error: (error) => {
            console.log('SUBMITED API MAIl ERROR:',error);
            this.messageService.add({
              severity: "error",
              summary: error.message,
            });
          },
        });
      this.formservice.submitted(this.uniqueId);
    } else if (this.ishr == "true" && this.apln_status == "REJECTED") {
      this.formservice.submitted(this.uniqueId);
    } else if (this.ishr == "true" && this.apln_status == "NEW INCOMPLETE") {
      this.formservice.pending(this.uniqueId);
    } else if (this.ishr == "undefined") {
      this.formservice.pending(this.uniqueId);
    }
  }

  getDataForID() {
    this.uniqueId.mobile = this.active.snapshot.paramMap.get("mobile_no1");
    this.status.status = this.active.snapshot.paramMap.get("apln_status");
  }

  /**
   * shows confirmation popup modal trainee application
   * @param {Event} event
   * @memberof FormsComponent
   */
  submitTraineeApplication(event: Event) {
    if (this.ishr !== "true") {
      
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message:
          "Your application " +
          this.apln_no +
          " has been submitted. \n Contact HR for more information",
        header: "Confirmation",
        rejectVisible: false,
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          /** window back to load previous query params */
          window.history.back();
          // this.router.navigate(["/"]);
        },
      });
      // this.router.navigate(["/"]);
    }
  }
}
