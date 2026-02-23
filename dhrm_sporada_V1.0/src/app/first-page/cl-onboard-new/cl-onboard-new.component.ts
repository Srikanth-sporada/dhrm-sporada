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
  apprenticeType: any = [
    { label: "CL-Labour", value: "CL" },
    { label: "CL-Piece Rate", value: "CL - PIECE RATE" },
  ];
  clApplicationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messgeService: MessageService,
    private router: Router,
    private apiService: ApiService,
  ) {
    /** construct application form */
    this.clApplicationForm = this.formBuilder.group({
      aadhar_no: ["", [Validators.required]],
      apprentice_type: ["", Validators.required],
      mobile_no1: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {}

  /** check user adhaar and number */
  checkUserAdhaar() {
    this.apiService
      .checkAdhaarClOnboardNew(this.clApplicationForm.value)
      .subscribe({
        next: (response: any) => {
          console.log("Aadhar check:", response);
          if (response?.success) {
            /** route to contractor-application */
            console.log(response?.success)
            this.navigateToOnboardForm();
          }
        },
        error: (error: any) => {
          console.error("ERROR:", error);
          this.messgeService.add({
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
    console.log(`cl-onboard/${aadhar}/${mobileNo}/${type}`)
    this.router.navigateByUrl(`cl-onboard/${aadhar}/${mobileNo}/${type}`)
  }
}
