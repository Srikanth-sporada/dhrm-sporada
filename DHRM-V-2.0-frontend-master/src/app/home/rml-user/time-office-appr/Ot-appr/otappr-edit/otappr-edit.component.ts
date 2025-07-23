import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "src/app/home/api.service";

@Component({
  selector: "app-otappr-edit",
  templateUrl: "./otappr-edit.component.html",
  styleUrls: ["./otappr-edit.component.css"],
})
export class OtapprEditComponent implements OnInit {
  otApprovers: any;
  headHr: any;

  selectedOtAppr: any;
  selectedHr: any;
  constructor(
    private api: ApiService,
    private matDailog: MatDialogRef<OtapprEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getFHListForMapping();
    this.gethrApprList();
    this.selectedHr = this.data.hr_slno;
    this.selectedOtAppr = this.data.func_slno;
  }

  getFHListForMapping() {
    this.api
      .getEmplListForMapping(this.data.plant)
      .subscribe((response: any) => {
        if (response.status == "success") {
          this.otApprovers = response.data;
          console.log('FH lisy',response.data);
          
        } else {
          alert(response.message);
        }
      });
  }

  gethrApprList() {
    this.api.gethrApprList(this.data.plant).subscribe((response: any) => {
      if (response.status == "success") {
        this.headHr = response.data;
        console.log('hr hread',response.data);
      } else {
        alert(response.message);
      }
    });
  }

  close() {
    this.matDailog.close();
  }

  submit() {
    let data = {
      fh: this.selectedOtAppr,
      hr: this.selectedHr,
      id: this.data.id,
      empId: sessionStorage.getItem("user_name"),
    };
    this.api.editOtMapping(data).subscribe((response:any)=>{
      if(response.status='success'){
        alert(response.message)
        this.matDailog.close()
      }else{
        alert(response.message)
      }
    })
  }
}
