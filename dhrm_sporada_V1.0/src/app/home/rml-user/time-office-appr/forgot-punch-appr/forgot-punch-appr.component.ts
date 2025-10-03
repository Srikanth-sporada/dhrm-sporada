import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  ViewContainerRef,
  TemplateRef,
  NgModule,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { environment } from "src/environments/environment.prod";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-forgot-punch-appr",
  templateUrl: "./forgot-punch-appr.component.html",
  styleUrls: ["./forgot-punch-appr.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPunchApprComponent implements OnInit {
  dates: any;
  data: any = [""];
  table_temp: any;
  table_data: any;
  temp_a: any;
  disable: number = 1;
  emp_id: any;
  all:any;
  userDetails:any;
  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private service: ApiService,
    private messageService:MessageService
  ) {
    var x: any = sessionStorage.getItem("all");
    x = JSON.parse(x);
    this.emp_id = x.gen_id;
  }
  dummy: any = [""];

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getDates();
  }

  open(content1: any, a: any) {
    this.temp_a = a;
    console.log("opening");
    this.modalService.open(content1, { centered: true });
  }
  open1(content2: any, a: any) {
    this.temp_a = a;
    console.log("opening");
    this.modalService.open(content2, { centered: true });
  }

  getDates() {
    this.table_data = [];
    var form = { id: this.emp_id };
    this.service.forgotPunchRequestDisplay(form).subscribe({
      next: (response: any) => {
        console.log(response);
        this.table_data = response;
      },
      error: (error) =>{
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    });
  }

  approve(flag:any) {
    var form = {
      status: flag,
      apprID: sessionStorage.getItem('user_name'),
      date: this.table_data[this.temp_a].attDate,
      empId: this.table_data[this.temp_a].EmpID,
      in_time: this.table_data[this.temp_a].requestedIn==null?this.table_data[this.temp_a].actualIn:this.table_data[this.temp_a].requestedIn,
      out_time: this.table_data[this.temp_a].requestedOut==null?this.table_data[this.temp_a].actualOut:this.table_data[this.temp_a].requestedOut,
      plant:sessionStorage.getItem('plantcode')
    };
    this.service.approveForgotToPunch(form).subscribe({
      next: (response: any) => {
        
        if (response.status == "success") {
          // alert(response.message);
          this.messageService.add({severity:'info',summary:response.message})
          this.getDates();
        }
      },
      error: (err) => {
        console.log(err);
         this.messageService.add({severity:'error',summary:err.message})
      },
    });
  }

}
