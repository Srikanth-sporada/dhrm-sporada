import {
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
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
  table_data: any = [
  {
    gen_id: "EMP001",
    EmpName: "Arun Kumar",
    attDate: "2025-12-20",
    actualIn: "09:05 AM",
    actualOut: "06:15 PM",
    requestedIn: null,
    requestedOut: null,
    reason: "-"
  },
  {
    gen_id: "EMP002",
    EmpName: "Priya Sharma",
    attDate: "2025-12-20",
    actualIn: "09:30 AM",
    actualOut: "06:00 PM",
    requestedIn: "09:00 AM",
    requestedOut: "05:30 PM",
    reason: "Doctor appointment"
  },
  {
    gen_id: "EMP003",
    EmpName: "Ravi Singh",
    attDate: "2025-12-20",
    actualIn: null,
    actualOut: null,
    requestedIn: "10:00 AM",
    requestedOut: "04:00 PM",
    reason: "Work from home"
  },
  {
    gen_id: "EMP004",
    EmpName: "Meena Joseph",
    attDate: "2025-12-20",
    actualIn: "08:55 AM",
    actualOut: "05:45 PM",
    requestedIn: null,
    requestedOut: null,
    reason: "-"
  }
];
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
    /** logged in user data */
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    /** get FP request data */
    this.getDates();
  }

  /** 
   * open approve modal
   * @param content1  templateRef
   * @param a index
   */
  open(content1: any, a: any) {
    this.temp_a = a;
    console.log("opening");
    this.modalService.open(content1, { centered: true });
  }

  /** 
   * open reject modal
   * @param content2 templateRef
   * @param a  index
   */
  open1(content2: any, a: any) {
    this.temp_a = a;
    console.log("opening");
    this.modalService.open(content2, { centered: true });
  }

  /** 
   * get FP request data
   * @property {*} table_data
   */
  getDates() {
    // this.table_data = [];
    var form = { id: this.emp_id };
    this.service.forgotPunchRequestDisplay(form).subscribe({
      next: (response: any) => {
        console.log(response);
        // this.table_data = response;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    });
  }

  /** 
   * @property {*} temp_a index of selected FP data
   * @param flag to identify approved or rejected 0 | 1
   */
  approve(flag:any) {
    var form = {
      status: flag,
      apprID: sessionStorage.getItem('user_name'),
      date: this.table_data[this.temp_a].attDate,
      empId: this.table_data[this.temp_a].EmpID,
      in_time: this.table_data[this.temp_a].requestedIn == null?this.table_data[this.temp_a].actualIn:this.table_data[this.temp_a].requestedIn,
      out_time: this.table_data[this.temp_a].requestedOut == null?this.table_data[this.temp_a].actualOut:this.table_data[this.temp_a].requestedOut,
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
        console.error('ERROR:',err);
         this.messageService.add({severity:'error',summary:err.message})
      },
    });
  }

}
