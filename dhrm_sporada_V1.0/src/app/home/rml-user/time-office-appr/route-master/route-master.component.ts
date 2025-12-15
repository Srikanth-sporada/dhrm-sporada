import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Renderer2,
} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { environment } from "src/environments/environment.prod";
import { ToastComponent } from "src/app/new-contractor-mod/toast/toast.component";
import { ClamAPIService } from "src/app/new-contractor-mod/clam-api.service";
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from "xlsx-js-style";
import { MessageService, ConfirmationService } from "primeng/api";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderserviceService } from "src/app/loaderservice.service";

@Component({
  selector: "app-route-master",
  templateUrl: "./route-master.component.html",
  styleUrls: ["./route-master.component.css"],
})
export class RouteMasterComponent implements OnInit {
  routelist: any[] = [];
  route: any;
  slno: any;
  viewForm = false;
  addForm = false;
  excel_data: any[] = [];
  all: any;
  userDetails: any;
  /** add route template ref */
  @ViewChild("addRoute", { read: TemplateRef }) addRouteTemplateRef:
    | TemplateRef<unknown>
    | undefined;
  /** edit route template ref */
  @ViewChild("editRoute", { read: TemplateRef }) editRouteTemplateRef:
    | TemplateRef<unknown>
    | undefined;

  isadmin: any = sessionStorage.getItem("isadmin") == "true" ? true : false;
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  plant: any = sessionStorage.getItem("plantcode");

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private OpApi: ClamAPIService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public loader:LoaderserviceService,
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
    /** get routes */
    this.getroute();
  }

  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
      },
    });
  }

  getroute() {
    this.OpApi.getRoute(this.plant).subscribe({
      next: (response: any) => {
        console.log("ROUTE DATA:", response);
        this.excel_data = response;
        /** filter only active route */
        this.routelist = response.filter(
          (item: any) => item.Status == "Active"
        );
      },
      error: (error: any) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error?.message });
      },
    });
  }

  add_On() {
    this.addForm = true;
    /** opening modal */
    console.log("opening add modal");
    this.modalService.open(this.addRouteTemplateRef, { centered: true });
  }

  view_On(data: any) {
    console.log(data);
    this.slno = data.Route_Id;
    this.viewForm = true;
    this.route = data.Route_Name;
    /** opening modal */
    console.log("opening edit modal");
    this.modalService.open(this.editRouteTemplateRef, { centered: true });
  }

  close() {
    this.addForm = false;
    this.viewForm = false;
    this.route = null;
  }

  submt_Route() {
    this.OpApi.add_new_route(
      this.plant,
      this.route,
      this.userEmpcode
    ).subscribe({
      next: (res: any) => {
        this.getroute();
        this.close();
        this.route = null;
        // this.openAlertDialog('New Route Added','Check')
        this.messageService.add({
          severity: "info",
          summary: "New Route Added Successfully.",
        });
      },
      error: (error: any) => {
        console.error("ERROR:", error);
        // this.openAlertDialog(error.error,'error')
        this.messageService.add({ severity: "error", summary: error?.error });
      },
    });
  }
  Edit_route() {
    this.OpApi.edit_route(this.plant, this.route, this.slno).subscribe({
      next: (res: any) => {
        this.getroute();
        this.close();
        this.route = null;
        // this.openAlertDialog('Route updated','Check')
        this.messageService.add({
          severity: "info",
          summary: "Route Updated Successfully.",
        });
      },
      error: (error: any) => {
        console.error("ERROR:", error);
        // this.openAlertDialog(error.error,'error')
        this.messageService.add({ severity: "error", summary: error?.error });
      },
    });
  }

  delete(event: Event, data: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure want to delete?",
      icon: "pi pi-exclamation-circle",
      acceptLabel: "Confirm",
      rejectLabel: "Cancel",
      accept: () => {
        this.deleteAPICall(data);
      },
      reject: () => {
        this.messageService.add({
          severity: "error",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  }

  deleteAPICall(data: any) {
    console.log(data);
    this.OpApi.delete_route(data.Route_Id).subscribe({
      next: (res: any) => {
        // this.openAlertDialog('Route Made In Active','Check')
        this.messageService.add({
          severity: "info",
          summary: "Route Made In-Active!",
        });
        this.getroute();
        this.route = null;
      },
      error: (error: any) => {
        console.error("ERROR:", error);
        // this.openAlertDialog(error.error,'error')
        this.messageService.add({ severity: "error", summary: error?.error });
      },
    });
  }

  exportExcel(): void {
    const transformedArray: any = this.excel_data.map((obj: any) => {
      const { Created_By, Created_On, ...filteredObj } = obj; // Exclude fields
      const transformedObj: any = {};

      Object.keys(filteredObj).forEach((key) => {
        const newKey = key.replace(/_/g, " "); // Replace underscores with spaces
        transformedObj[newKey] = filteredObj[key];
      });

      return transformedObj;
    });

    var ws = XLSX.utils.json_to_sheet(transformedArray);

    // Apply yellow background and border styles to headers
    const headerRange = XLSX.utils.decode_range(ws["!ref"]!);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        fill: { fgColor: { rgb: "FFFF00" } }, // Yellow color
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Route Master list");
    XLSX.writeFile(wb, "Route_master.xlsx");
  }
}
