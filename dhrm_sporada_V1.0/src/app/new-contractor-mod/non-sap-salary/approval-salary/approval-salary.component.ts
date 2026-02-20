import { Component, OnInit, Inject, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ClamAPIService } from "../../clam-api.service";
import { MatDialog } from "@angular/material/dialog";
import { ToastComponent } from "../../toast/toast.component";
import { Location } from "@angular/common";
import moment from "moment";
import { ConfirmDialogReasonComponent } from "src/app/new-contractor-mod/confirm-dialog-reason/confirm-dialog-reason.component";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";
@Component({
  selector: "app-approval-salary",
  templateUrl: "./approval-salary.component.html",
  styleUrls: ["./approval-salary.component.css"],
})
export class ApprovalSalaryComponent implements OnInit {
  plant_Code: any = sessionStorage.getItem("plantcode");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  ishrappr: string | null = sessionStorage.getItem("ishrappr");
  isadmin: string | null = sessionStorage.getItem("isadmin");
  ishr: string | null = sessionStorage.getItem("ishr");
  defaultStatus: string;
  WageList: any = [];
  wageListCopy: any;
  deptList: any;
  Con_list: any;
  selectedGenId: any;
  selectedDept: any;
  selectedStatus: any;
  button: boolean = false;
  selectedRecords: any[] = [];
  allSelected: boolean = false;
  userDetails: any;
  all: any;
  constructor(
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private api: ClamAPIService,
    public router: Router,
    private messageService: MessageService,
    protected loader:LoaderserviceService,
  ) {
    this.defaultStatus = this.ishrappr ? "PENDING" : "ALL";
    this.selectedStatus = this.defaultStatus;
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
    /** get wage master */
    this.get_Wage_Mst();
    /** get department master */
    this.get_Dept_Mst();
    this.getContra();
    // Initialize filters
    this.selectedDept = null;
    this.selectedStatus = null;
    this.selectedGenId = null;
  }

  /** handle select all */
  toggleSelectAll() {
    this.WageList.forEach((item: any) => {
      item.selected = this.allSelected;
    });
  }

  /** handle single row selected */
  onRowSelectChange() {
    this.allSelected = this.WageList.every((item: any) => item.selected);
  }
 
  /** handle any row selected */
  anyRowSelected() {
    return this.WageList?.some((item: any) => item.selected);
  }

  openAlertDialog(
    message: string,
    delayMilliseconds: number = 500,
    icon: string,
  ): void {
    setTimeout(() => {
      this.dialog.open(ToastComponent, {
        data: {
          icon: icon,
          message: message,
        },
      });
    }, delayMilliseconds);
  }

  approveSelectedItems() {
    this.button = true;
    /** filter only selected item */
    const selectedItems = this.WageList.filter((item: any) => item.selected);
    console.log("Selected items for approval:", selectedItems);
    /** approve bulk salary */
    this.api.approve_Bulk_Salary(selectedItems, this.userEmpcode).subscribe({
      next: (res: any) => {
        console.log(res);
        // this.openAlertDialog(`${res.message}`, 100, "check");
        this.messageService.add({severity:'info',summary:res?.message});
        this.button = false;
        /** get wage list */
        this.get_Wage_Mst();
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error?.error?.message });
        this.button = false;
      },
    });
  }

  get_Dept_Mst() {
    this.api.getDeptMst(this.plant_Code).subscribe({
      next:(res) => {
        this.deptList = res;
        this.deptList.unshift({ dept_name: "All",dept_slno:'' });
         console.log('department List',this.deptList)
      },
      error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    });
  }

  getContra() {
    this.api.getContractor().subscribe({
      next:(res) => {
        this.Con_list = res;
        this.Con_list = this.Con_list.filter((item: any) => item.Plant_code == this.plant_Code && item.Status === true);
        this.Con_list.unshift({ Cont_company_name: "All", Con_Id: "" });
        console.log('CON LIST:',this.Con_list);
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  /** 
   * get wage list
   * @property {*} wageList has selected prop to handle bulk approve
   */
  get_Wage_Mst() {
    this.api.getWageMst(this.plant_Code, this.userEmpcode).subscribe({
      next:(res: any) => {
        this.WageList = res;
        this.wageListCopy = [...this.WageList];
        console.log(
          "🚀 ~ file: revise-payscale.component.ts:18 ~ RevisePayscaleComponent ~ ̥WageList:",
          this.WageList,
        );
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }

  onIshrapprChange() {
    // console.log(ishrappr)
    this.defaultStatus = this.ishrappr == "true" ? "PENDING" : "ALL";
    // this.selectedStatus = this.defaultStatus;
  }

  reworkpayscale(data: any) {
    this.openConfirmDialogWithReason(
      "Do you want to send for Rework Payscale",
      data,
    );
  }

  openConfirmDialogWithReason(message: string, data: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogReasonComponent, {
      data: {
        icon: "warning",
        message: message,
        confirmText: "Reject",
        cancelText: "Cancel",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.result) {
        console.log(result);
        console.log("Dialog result:", result.result);
        console.log("Dialog reason:", result.reason);
        console.log(data);

        const reject = {
          data: data,
          Reject_reason: result.reason,
          rejected_by: this.userEmpcode,
        };

        console.log(reject);

        // this.api.reject_optr_Leave(reject).subscribe((res:any)=>{
        //   this.openAlertDialog(res,500,'check');
        //   // this.getOptrleave()

        // },(error:any) => {
        //   if (error.status === 400) {
        //     this.openAlertDialog(`${error.error}`,550,'error');
        //   }
        //    else {
        //     this.openAlertDialog('Error in connection',500,'error');

        //   }
        // })
      } else {
        // this.openAlertDialog(`You Cancelled Leave`,'error');

        console.log("You Cancelled Leave");
      }
    });
  }
}
