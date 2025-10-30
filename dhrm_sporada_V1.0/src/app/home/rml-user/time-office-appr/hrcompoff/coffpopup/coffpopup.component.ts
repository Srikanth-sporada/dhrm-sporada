import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "src/app/home/api.service";
import moment from "moment";

@Component({
  selector: "app-coffpopup",
  templateUrl: "./coffpopup.component.html",
  styleUrls: ["./coffpopup.component.css"],
})
export class CoffpopupComponent implements OnInit {
  applyBtn: any = true;
  date: any;
  minDateApply: any;
  maxDateApply: any;
  message: any = "";
  constructor(
    private dialogRef: MatDialogRef<CoffpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService
      .getlockDateByEmp(this.data.apln_slno)
      .subscribe((response: any) => {
        let newDate = new Date(response.date);
        newDate.setDate(newDate.getDate() + 1);
        this.minDateApply = moment(newDate).format("YYYY-MM-DD");
        this.maxDateApply = moment(new Date()).format("YYYY-MM-DD");
      });
    console.log(this.data);
  }

  checkDate() {
    this.applyBtn = true;
    this.apiService
      .checkCoffDate(this.date, this.data.apln_slno)
      .subscribe((response: any) => {
        if (response.message == "failed") {
          alert(response.message);
        } else if (response.eligible == true) {
          this.applyBtn = false;
          this.message = "";
        } else if (response.eligible == false) {
          this.applyBtn = true;
          this.message = `You Are Alredy Present On This Date`;
        }
      });
  }
  apply() {
    let data = {
      apln_slno: this.data.apln_slno,
      Coff_date: this.date,
      work_date: this.data.att_date,
      emp_id: sessionStorage.getItem("user_name"),
      plant: sessionStorage.getItem("plantcode"),
    };
    this.apiService.applyHrCoff(data).subscribe((response:any)=>{
      if(response.status=='success'){
        this.dialogRef.close()
        alert(response.message)
      }else{
        alert(response.message)
      }
    })
  }
}
