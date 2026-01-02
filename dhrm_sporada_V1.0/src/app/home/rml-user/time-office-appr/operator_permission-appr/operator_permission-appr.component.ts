import { Component, OnInit } from "@angular/core";
import { ClamAPIService } from "src/app/new-contractor-mod/clam-api.service";
import { ToastComponent } from "src/app/new-contractor-mod/toast/toast.component";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "primeng/api";


@Component({
  selector: "app-od-appr",
  templateUrl: "./operator_permission-appr.component.html",
  styleUrls: ["./operator_permission-appr.component.css"],
})
export class OptrApprComponent implements OnInit {
  // item:any[] = essionStorage.getItem("all");

  all: any = sessionStorage.getItem("all");
  userDetails: any;
  item: any = JSON.parse(this.all);
  ishr = sessionStorage.getItem("ishr");
  isRA = this.item.Is_ReportingAuth;
  empl_slNo = this.item.empl_slno;
  ishrappr = sessionStorage.getItem("ishrappr");
  isadmin = sessionStorage.getItem("isadmin");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  plant: any = sessionStorage.getItem("plantcode");
  gen_id: any = sessionStorage.getItem("gen_id");
  l1_status: any;
  l2_status: any;
  optr_Data: any = [
    {
      Gen_id: "EMP001",
      fullname: "Arun Kumar",
      att_date: "2025-12-20",
      Present_Before: "Yes",
      applied_on: "2025-12-18",
      reason: "Medical leave",
      Present_After: "No",
      Approver_1_name: "Ravi Shankar",
      L1_Approval_Status: "Pending",
      Approver_2_name: "Priya Menon",
      L2_Approval_Status: "Not Started",
      Mid_Permission:'TRUE'
    },
    {
      Gen_id: "EMP002",
      fullname: "Meena R",
      att_date: "2025-12-21",
      Present_Before: "No",
      applied_on: "2025-12-19",
      reason: "Family function",
      Present_After: "Yes",
      Approver_1_name: "Ravi Shankar",
      L1_Approval_Status: "Approved",
      Approver_2_name: "Priya Menon",
      L2_Approval_Status: "Approved",
      Mid_Permission:'TRUE'
    },
    {
      Gen_id: "EMP003",
      fullname: "Suresh Babu",
      att_date: "2025-12-22",
      Present_Before: "Yes",
      applied_on: "2025-12-20",
      reason: "Travel",
      Present_After: "Yes",
      Approver_1_name: "Ravi Shankar",
      L1_Approval_Status: "Rejected",
      Approver_2_name: "Priya Menon",
      L2_Approval_Status: "Not Applicable",
      Mid_Permission:'FALSE'
    },
  ];
  apprShow = true;
  genId: any;
  a1_status: any = "Waiting for Approval"; // deafult status
  a2_status: any = "Waiting for Approval"; // default status
  statusOptions = [
    { value: "", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Waiting for Approval", label: "Waiting for Approval" },
    { value: "Approved", label: "Approved" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Rejected", label: "Rejected" },
  ];

  constructor(
    public loader: LoaderserviceService,
    private dialog: MatDialog,
    private api: ClamAPIService,
    private messageService: MessageService
  ) {}

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
    /** get permission data */
    this.getOptrPermission();
    this.l1_status = "Waiting for Approval";
    this.l2_status = "Waiting for Approval";

    // this.l2_status=this.optr_Data.L2_Approval_Status

    // if(this.optr_Data.L2_Approval_Status ===  this.l2_status ){
    //   console.log(true)
    // }else{
    //   console.log(false)
    // }
  }

  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
      },
    });
  }

  /** 
   * get permission data
   * @property {*} optr_Data
   */
  getOptrPermission() {
    this.api
      .get_optr_permission_data(this.plant, this.empl_slNo, this.ishrappr)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.optr_Data = res;
          // this.l2_status = this.optr_Data.L2_Approval_Status
        },
        error: (error) => {
          console.error('ERROR:',error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        }
      });
  }

  /** 
   * First Approver API
   */
  l1_Approver(data: any) {
    console.log('A1 DATA:',data);
    this.api.l1_approver(data, this.empl_slNo).subscribe({
      next: (res: any) => {
        // this.openAlertDialog(res,'check');
        console.log('A1 RES:',res);
        this.messageService.add({ severity: "info", summary: res });
        this.getOptrPermission();
      },
      error: (error: any) => {
        console.error('ERROR:',error)
        if (error.status === 400) {
          this.messageService.add({ severity: "error", summary: error.error });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error In Connection",
          });
        }
      }
    });
  }

  /** 
   * Second Approver API
   */
  l2_Approver(data: any) {
    // console.log(data)
    this.api.l2_approver(data).subscribe({
      next: (res: any) => {
        console.log('A2 RES:',res);
        this.messageService.add({ severity: "info", summary: res });
        this.getOptrPermission();
      },
      error: (error: any) => {
        console.error('ERROR:',error);
        if (error.status === 400) {
          this.messageService.add({ severity: "error", summary: error.error });
        } else {
          // this.openAlertDialog('Error in connection','error');
          this.messageService.add({
            severity: "error",
            summary: "Error In Connection",
          });
        }
      }
    });
  }
}
