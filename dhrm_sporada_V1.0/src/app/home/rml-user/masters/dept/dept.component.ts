import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { UntypedFormBuilder, FormGroup } from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import * as XLSX from "xlsx";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { environment } from "src/environments/environment.prod";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";

const material = [MatSidenav, MatTableModule];

@Component({
  selector: "app-department-master",
  templateUrl: "./dept.component.html",
  styleUrls: ["./dept.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DeptComponent implements OnInit {
  closeResult: string;
  form: any;
  plantname: any;
  sample: any = environment.path;
  temp_a: any;
  array: any = [];
  department: any = [];
  Dept_header: any = [];
  departmentData: any = [];
  selectedPlant: any = "";
  isAdmin: any = sessionStorage.getItem("isadmin");
  selectedDepartment: any = "";
  editing_flag: any;
  index: any = -1;
  plantCopy: any = [];
  departmentHeaderCopy: any = [];
  // material modal template ref
  @ViewChild("content", { read: TemplateRef }) addDepartmentTemplateRef:
    | TemplateRef<unknown>
    | undefined;
  // Speed Dial items
  items: MenuItem[] = [
    {
      icon: "pi pi-plus-circle",
      tooltipOptions: {
        tooltipLabel: "Add Department",
      },
      command: () => {
        this.open(this.addDepartmentTemplateRef);
      },
    },
    {
      icon: "pi pi-download",
      tooltipOptions: {
        tooltipLabel: "Download",
      },
      command: () => {
        this.exportexcel();
        this.messageService.add({
          severity: "info",
          summary: "Data Converted.",
        });
      },
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private service: ApiService,
    public loader: LoaderserviceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.form = this.fb.group({
      dept_slno: [""],
      plant_name: [""],
      names: [""],
      dept_name: [""],
      sap_code: [""],
      dept_group: [""],
      dh_Id: [""],
    });
  }

  ngOnInit(): void {
    this.getplantcode();
    this.getDepartment();
    this.getDepartmentHeader();
  }

  /**
   * @memberof DeptComponent
   */
  getplantcode() {
    var company = { company_name: sessionStorage.getItem("companycode") };
    this.service.plantcodelist(company).subscribe({
      next: (response: any) => {
        console.log(response);
        this.plantname = [...response];
        this.plantname.unshift({ plant_name: "All", plant_code: "" });
        this.plantCopy = response;
        // for(var o in this.plantname)
        // this.array.push(this.plantname[o].plant_name)
      },
      error: (error) =>
        this.messageService.add({ severity: "error", summary: error.message }),
    });
  }
  /**
   * @memberof DeptComponent
   */
  getDepartment() {
    this.service.getdepartment().subscribe({
      next: (response) => {
        this.department = response;
        this.departmentData = response;
        this.filterDepartmentByPlant();
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }
  /**
   * @memberof DeptComponent
   */
  getDepartmentHeader() {
    this.service.getdepartment_header().subscribe({
      next: (response: any) => {
        this.Dept_header = [...response];
        this.Dept_header.unshift({ Dh_Id: "", Department_Header: "All" });
        this.departmentHeaderCopy = response;
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }
  /**
   *
   * @param content
   */
  open(content: any) {
    this.form.reset();
    this.editing_flag = false;
    this.form.get("plant_name").enable();
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  // add department function
  save() {
    this.form.controls["dept_slno"].setValue(this.department.length + 1);
    this.service.adddepartment(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "already") {
          this.messageService.add({
            severity: "info",
            summary: "Department Code already exists!",
          });
        } else if (response.message == "inserted") {
          this.messageService.add({
            severity: "info",
            summary: "Department Added Successfully",
          });
          this.getDepartment();
        } else if ((response.message = "failure")) {
          this.messageService.add({
            severity: "error",
            summary: "cannot Add Department!",
          });
        } else {
          const index = this.plantname.findIndex(
            (obj: any) => obj.plant_code === this.form.get("plant_name").value,
          );
          this.form
            .get("plant_name")
            .setValue(this.plantname[index].plant_name);
          console.log(index);
          this.getDepartment();
          this.form.reset();
        }
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }

  opentoedit(content: any) {
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  /** patch form value to edit dept */
  edit(a: any, slno: any) {
    this.temp_a = a;
    console.log(this.department[a]);
    console.log(this.Dept_header);

    console.log("a.DH_id", a.Dh_id);
    console.log("a.Dh_id", typeof a.Dh_id);

    this.editing_flag = true;
    this.form.patchValue({
      dept_slno: slno,
      plant_name: a.plant_code,
      dept_name: a.dept_name,
      dept_group: a.dept_group,
      sap_code: a.sap_code,
      dh_Id: a.Dh_id,
    });
    this.form.get("plant_name").disable();
    console.log(this.form.value);
  }

/** update department API */
  editSave() {
    this.form.get("plant_name").enable();
    console.log(this.form.value);
    this.service.updatedepartment(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "already") {
          this.messageService.add({
            severity: "info",
            summary: "Already Exists!",
          });
        } else if (response.message == "updated") {
          this.messageService.add({
            severity: "info",
            summary: "Department Updated!",
          });
          this.getDepartment();
        } else if (response.message == "failure") {
          this.messageService.add({
            severity: "error",
            summary: "Cannot Update Department!",
          });
        } else {
          this.getDepartment();
        }
      },
    });
  }

  // delete department function
  deleteDepartment(event: Event, a: any, slno: any) {
    console.log(slno);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to Delete?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteDepartmentAPICall(slno, a);
      },
      reject: () => {
        this.messageService.add({ severity: "error", summary: "Rejected" });
      },
    });
  }

  deleteDepartmentAPICall(slno: any, a: any) {
    this.service.deletedepartment({ slno: slno }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "success") this.department.splice(a, 1);
        this.messageService.add({
          severity: "info",
          summary: "Department Deleted",
        });
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }

  // export to excel function
  exportexcel(): void {
    const newKeys: any = {
      dept_group: "Department Group",
      dept_slno: "Slno",
      dept_name: "Department Name",
      sap_code: "Sap Code",
      plant_name: "Plant Name",
      plant_code: "Plant Code",
    };

    const transformedArray: any = this.department.map((obj: any) => {
      const transformedObj: any = {};
      Object.keys(obj).forEach((key) => {
        const newKey = newKeys[key] || key;
        transformedObj[newKey] = obj[key];
      });
      return transformedObj;
    });
    console.log(transformedArray);

    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "department.xlsx");
    this.messageService.add({ severity: "info", summary: "Data Exported!" });
  }

  reset() {
    this.form.reset();
  }

  // filter by department
  filterByDepartment() {
    const filteredDataByDepartment = this.departmentData.filter((dept: any) => {
      if (this.selectedPlant) {
        if (
          dept.Dh_id == this.selectedDepartment &&
          dept.plant_code == this.selectedPlant
        ) {
          return dept;
        } else if (this.selectedPlant == "") {
          if (dept.Dh_id == this.selectedDepartment) {
            return dept;
          }
        }
      }
    });
    if (filteredDataByDepartment.length) {
      this.department = filteredDataByDepartment;
    } else if (this.selectedDepartment === "") {
      this.department = this.departmentData;
    } else {
      this.department = this.departmentData;
      this.messageService.add({
        severity: "info",
        summary: "Department Not Found!",
      });
    }
  }

  // filter department by plant
  filterDepartmentByPlant() {
    const filteredDataByPlant = this.departmentData.filter((dept: any) => {
      if (dept.plant_code == this.selectedPlant) {
        return dept;
      }
    });
    if (filteredDataByPlant.length) {
      this.department = filteredDataByPlant;
    } else if (this.selectedPlant === "") {
      this.department = this.departmentData;
    } else {
      this.department = this.departmentData;
      this.messageService.add({
        severity: "info",
        summary: "Department Not Found!",
      });
    }
  }
}
