import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "src/app/home/api.service";

@Component({
  selector: "app-otpopup",
  templateUrl: "./otpopup.component.html",
  styleUrls: ["./otpopup.component.css"],
})
export class OtpopupComponent implements OnInit {
  enteredHours: any = "";
  machine: any = "";
  reason: any = "";
  masterMachine: any[];
  consoumedOtDetails: any = { day: 0, month: 0, week: 0 };
  allowedOTHours: any = { day: 0, month: 0, week: 0 };
  pendingOtHours: any;
  apply: any = true;
  otHourValid: any;
  invalidMessage: any;
  constructor(
    private dailogref: MatDialogRef<OtpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {
    console.log(this.data);
    this.apiService.getMachine(this.data.apln_slno).subscribe((res: any) => {
      if (res.status == "success") {
        this.masterMachine = res.data;
      } else if (res.status == "failed") {
        alert(res.message);
      }
    });
  }

  ngOnInit() {
    this.apiService
      .getConsumedOtDetails(this.data.apln_slno, this.data.att_date)
      .subscribe((res: any) => {
        if (res.status == "success") {
          this.consoumedOtDetails = res.data;
        } else if (res.status == "failed") {
          alert(res.message);
        }
      });

    this.apiService.getAllowedOtHours().subscribe((res: any) => {
      if (res.status == "success") {
        this.allowedOTHours = res.data;
      } else if (res.status == "failed") {
        alert(res.message);
      }
    });

    console.log(this.pendingOtHours);
  }

  onOtHourChange() {
    if (this.enteredHours > this.data.expect_othr) {
      this.invalidMessage =
        "Entered OT Hours Is Greater Then Excess Hours Worked";
      this.otHourValid = false;
      return;
    }
    if (
      this.enteredHours >
      this.allowedOTHours.month - this.consoumedOtDetails.month
    ) {
      this.invalidMessage = `Entered OT Hours ${
        this.enteredHours
      } Is Greater Then Monthly Allowed Limit Pending:${
        this.allowedOTHours.month - this.consoumedOtDetails.month
      } Hours`;
      this.otHourValid = false;
      return;
    }
    if (
      this.enteredHours >
      this.allowedOTHours.week - this.consoumedOtDetails.week
    ) {
      this.invalidMessage = `Entered OT Hours ${
        this.enteredHours
      } Is Greater Then Weekly Allowed Limit Pending:${
        this.allowedOTHours.week - this.consoumedOtDetails.week
      } Hours`;
      this.otHourValid = false;
      return;
    }
    if (
      this.enteredHours >
      this.allowedOTHours.day - this.consoumedOtDetails.day
    ) {
      this.invalidMessage = `Entered OT Hours ${
        this.enteredHours
      } Is Greater Then Daily Allowed Limit Pending:${
        this.allowedOTHours.day - this.consoumedOtDetails.day
      } Hours`;
      this.otHourValid = false;
      return;
    }
    this.invalidMessage = "";
    this.otHourValid = true;

    this.applyBtn();
  }
  applyBtn() {
    console.log(this.enteredHours);
    if (
      this.otHourValid &&
      // this.machine != "" &&
      this.reason != "" &&
      this.enteredHours != null
    ) {
      this.apply = false;
    } else {
      this.apply = true;
    }
  }

  applyOT() {
    let values = {
      apln_slno: this.data.apln_slno,
      date: this.data.att_date,
      othr: this.enteredHours,
      machine: this.machine,
      reason: this.reason,
      plant: sessionStorage.getItem("plantcode"),
      requested_by: sessionStorage.getItem("user_name"),
    };
    this.apiService.requestOt(values).subscribe((respose: any) => {
      if (respose.status == "success") {
        alert(respose.message);
        this.dailogref.close();
      } else {
        alert(respose.message);
      }
    });
  }
}
