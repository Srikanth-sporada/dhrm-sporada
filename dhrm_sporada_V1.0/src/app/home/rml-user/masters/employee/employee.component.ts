import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { LoaderserviceService } from "src/app/loaderservice.service";
import * as XLSX from "xlsx";
import { FormService } from "../../new-joiners/form.service";
import { Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { environment } from "src/environments/environment.prod";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
import { Utility } from "src/app/utils/utils";

const material = [MatSidenav, MatTableModule];

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeComponent implements OnInit {
  closeResult: string;
  form: any;
  plantname: any;
  plantCopy: any = [];
  array: any = [];
  all_details: any;
  desig: any;
  dept: any;
  line: any;
  desig_: any = [];
  dept_: any = [];
  line_: any = [];
  sample: any = environment.path;
  employee: any = [];
  employeeData: any = [];
  selectedPlant: any = "";
  editing_flag: any;
  temp_a: any;
  // material modal template ref
  @ViewChild("content", { read: TemplateRef }) addEmployeeTemplateRef:
    | TemplateRef<unknown>
    | undefined;
  // Speed Dial items
  items: MenuItem[] = [
    {
      icon: "pi pi-plus-circle",
      tooltipOptions: {
        tooltipLabel: "Add Employee",
      },
      command: () => {
        this.open(this.addEmployeeTemplateRef);
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
    private formservice: FormService,
    private service: ApiService,
    public loader: LoaderserviceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public utils:Utility,
  ) {
    this.form = this.fb.group({
      gen_id: ["", Validators.required],
      Emp_Name: ["", Validators.required],
      plant_name: ["", Validators.required],
      dept_name: ["", Validators.required],
      desig_name: ["", Validators.required],
      Line_Name: ["", Validators.required],
      Mail_Id: ["", Validators.required],
      Mobile_No: ["", Validators.required],
      User_Name: ["", Validators.required],
      Password: ["", Validators.required],
      Is_HR: [""],
      is_admin: [""],
      Is_HRAppr: [""],
      Is_Trainer: [""],
      Is_Supervisor: [""],
      Is_ReportingAuth: [""],
      Is_TOU: [""],
      access_master: [""],
      plant_code: [""],
      Department: [""],
      Designation: [""],
      line_code: [""],
      is_fin: [""],
      is_cmed: [""],
      ot_appr: [""],
      is_plant_head: [""],
      payroll_plant: [""],
      is_chr: [""],
      is_cfin: [""], // #NEW FROM RML
    });
  }

  exportexcel(): void {
    // const newKeys:any = {
    //   bank_code: 'Bank Code',
    //   bank_name: 'Bank Name',
    //   del_status: 'Del Status',
    // };

    // Map the array and transform each object
    const transformedArray: any = this.employee.map((obj: any) => {
      const transformedObj: any = {};
      Object.keys(obj).forEach((key) => {
        const newKey = key.replace(/_/g, " "); // replace hyphens with spaces
        transformedObj[newKey] = obj[key];
      });
      return transformedObj;
    });
    console.log(transformedArray);

    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.writeFile(wb, "employee.xlsx");
  }

  // angular lifecycle
  ngOnInit(): void {
    this.getplantcode();
    this.getEmployeeData();
  }

  /** get employee data */
  getEmployeeData() {
    try {
      this.service.getemployee().subscribe({
        next: (response: any) => {
          if (response?.message == "failure") {
            this.messageService.add({
              severity: "warn",
              summary: "Error in server",
            });
          } else {
            this.employee = response;
            this.employeeData = response;
            /** filer function */
            this.filterEmployeeByPlant();
          }
        },
        error: (error) => {
          this.utils.handleApiErrors(error,'GET EMPLOYEE DATA API ERROR:','error',error?.message)
        }
      });
    } catch (error: any) {
      console.error("ERROR", error);
    }
  }
  /** get plant data */
  getplantcode() {
    var company = { company_name: sessionStorage.getItem("companycode") };
    this.service.plantcodelist(company).subscribe({
      next: (response: any) => {
        console.log(response);
        this.plantname = [...response];
        this.plantname.unshift({ plant_name: "All", plant_code: "" });
        this.plantCopy = response;
      },
      error: (error) => {
        this.utils.handleApiErrors(error,'GET PLANT CODE API ERROR:','error',error?.message)
      }
    });
  }

  // get plant designation
  getall(event: any) {
    this.dept_ = [];
    this.line_ = [];
    this.desig = [];
    console.log(event.value);
    this.form.get("dept_name").setValue("");
    this.form.get("Line_Name").setValue("");
    this.form.get("desig_name").setValue("");
    var plantcode = { plantcode: event.value };
    this.service.line_dept_design(plantcode).subscribe({
      next: (response) => {
        console.log(response);
        this.all_details = response;
        this.desig = this.all_details[0];
        this.dept = this.all_details[1];
      },
      error: (error) => {
        this.utils.handleApiErrors(error,'GET DESIGNATION  API ERROR:','error',error?.message)
      }
    });
  }

  open(content: any) {
    this.form.reset();
    this.form.controls["plant_name"].enable();
    this.form.controls["gen_id"].enable();
    this.form.controls["Is_HR"].setValue(false);
    this.form.controls["Is_HRAppr"].setValue(false);
    this.form.controls["Is_Trainer"].setValue(false);
    this.form.controls["Is_Supervisor"].setValue(false);
    this.form.controls["Is_ReportingAuth"].setValue(false);
    this.form.controls["is_admin"].setValue(false);
    this.form.controls["Is_TOU"].setValue(false);
    this.form.controls["access_master"].setValue(false);
    this.form.controls["is_fin"].setValue(false);
    this.form.controls["is_cmed"].setValue(false);
    this.form.controls["ot_appr"].setValue(false);
    this.form.controls["is_plant_head"].setValue(false);
    this.form.controls["is_chr"].setValue(false);
    this.form.controls['is_cfin'].setValue(false); // #NEW FROM RML

    this.editing_flag = false;
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  opentoedit(content: any) {
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  edit(a: any) {
    this.temp_a = a;
    var plantcode = { plantcode: this.employee[a].plant_code };
    this.service.line_dept_design(plantcode).subscribe({
      next: (response) => {
        console.log(response);
        this.all_details = response;
        this.desig = this.all_details[0];
        this.dept = this.all_details[1];
        this.service
          .getLineName({ dept_slno: this.employee[a].Department })
          .subscribe({
            next: (response: any) => {
              console.log("line", response);
              this.line = response[0];
            },
            error: (error) => {
              this.utils.handleApiErrors(error,'EDIT EMPLOYEE GET LINE ERROR:','error',error?.message)
            }
          });
      },
      error: (error) => {
        this.utils.handleApiErrors(error,'EMPLOYEE EDIT DESIG API ERROR:','error',error?.message)
      }
    });

    this.editing_flag = true;
    this.form.controls["Emp_Name"].setValue(this.employee[a].Emp_Name);
    this.form.controls["gen_id"].setValue(this.employee[a].gen_id);
    this.form.controls["plant_name"].setValue(this.employee[a].plant_code);
    // this.form.controls['plant_name'].disable()
    this.form.controls["gen_id"].disable();

    this.form.controls["dept_name"].setValue(
      Number(this.employee[a].Department),
    );
    this.form.controls["desig_name"].setValue(
      Number(this.employee[a].Designation),
    );
    this.form.controls["Line_Name"].setValue(
      Number(this.employee[a].line_code),
    );

    this.form.controls["Mail_Id"].setValue(this.employee[a].Mail_Id);
    this.form.controls["Mobile_No"].setValue(this.employee[a].Mobile_No);
    this.form.controls["User_Name"].setValue(this.employee[a].User_Name);
    this.form.controls["Password"].setValue(this.employee[a].Password);
    this.form.controls["payroll_plant"].setValue(
      this.employee[a].Payroll_Plant,
    );

    this.form.controls["Is_HR"].setValue(this.employee[a].Is_HR);
    this.form.controls["Is_HRAppr"].setValue(this.employee[a].Is_HRAppr);
    this.form.controls["Is_Trainer"].setValue(this.employee[a].Is_Trainer);
    this.form.controls["Is_Supervisor"].setValue(
      this.employee[a].Is_Supervisor,
    );
    this.form.controls["Is_ReportingAuth"].setValue(
      this.employee[a].Is_ReportingAuth,
    );
    this.form.controls["is_admin"].setValue(this.employee[a].is_admin);
    this.form.controls["Is_TOU"].setValue(this.employee[a].Is_TOU);
    this.form.controls["access_master"].setValue(
      this.employee[a].access_master,
    );
    this.form.controls["is_fin"].setValue(this.employee[a].is_fin);
    this.form.controls["is_cmed"].setValue(this.employee[a].is_cmed);
    this.form.controls["ot_appr"].setValue(this.employee[a].ot_appr);
    this.form.controls["is_plant_head"].setValue(
      this.employee[a].is_plant_head,
    );
    this.form.controls["is_chr"].setValue(this.employee[a].Is_CHR);
  }
  // add new employee
  save() {
    console.log(this.form.value);
    this.service.addemployee(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "already") {
          this.messageService.add({
            severity: "info",
            summary: "Username Already Exists!",
          });
        } else if (response.message == "failure") {
          this.messageService.add({
            severity: "error",
            summary: "Cannot Add Employee!",
          });
        } else {
          const index = this.plantname.findIndex(
            (obj: any) => obj.plant_code === this.form.get("plant_name").value,
          );
          this.form
            .get("plant_code")
            .setValue(this.form.get("plant_name").value);
          this.form
            .get("plant_name")
            .setValue(this.plantname[index].plant_name);

          const index2 = this.dept.findIndex(
            (obj: any) => obj.dept_slno === this.form.get("dept_name").value,
          );
          this.form
            .get("Department")
            .setValue(this.form.get("dept_name").value);
          this.form
            .get("Designation")
            .setValue(this.form.get("desig_name").value);
          this.form.get("line_code").setValue(this.form.get("Line_Name").value);
          this.form.get("dept_name").setValue(this.dept[index2].dept_name);
          /** refresh */
          this.getEmployeeData();
          this.form.reset();
          this.messageService.add({
            severity: "info",
            summary: "Employee Added.",
          });
        }
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }
  // update employee
  editSave() {
    this.form.controls["plant_name"].enable();
    this.form.controls["gen_id"].enable();
    console.log(this.form.value);
    this.service.updateemployee(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message != "failure") {
          const index = this.plantname.findIndex(
            (obj: any) => obj.plant_code === this.form.get("plant_name").value,
          );
          this.form
            .get("plant_code")
            .setValue(this.form.get("plant_name").value);
          this.form
            .get("plant_name")
            .setValue(this.plantname[index].plant_name);

          const index2 = this.dept.findIndex(
            (obj: any) => obj.dept_slno === this.form.get("dept_name").value,
          );
          this.form
            .get("Department")
            .setValue(this.form.get("dept_name").value);
          this.form
            .get("Designation")
            .setValue(this.form.get("desig_name").value);
          this.form.get("line_code").setValue(this.form.get("Line_Name").value);
          this.form.get("dept_name").setValue(this.dept[index2].dept_name);
          this.messageService.add({
            severity: "info",
            summary: "Employee Updated.",
          });
          /** refresh */
          this.getEmployeeData();
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Cannot Update Employee!",
          });
        }
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }
  // delete employee
  deleteEmployee(event: Event, a: any, slno: any) {
    console.log(slno);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to Delete?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteEmployeeAPICall(a, slno);
      },
      reject: () => {
        this.messageService.add({ severity: "error", summary: "Rejected" });
      },
    });
  }
  // delete employee api call
  deleteEmployeeAPICall(a: any, slno: any) {
    this.service.deleteemployee({ empl_slno: slno }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "success") this.employee.splice(a, 1);
        this.messageService.add({
          severity: "info",
          summary: "Employee Deleted!",
        });
      },
    });
  }
  // get department line
  getLineName(event: any) {
    console.log(event.value);
    this.service.getLineName({ dept_slno: event.value }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.line = response[0];
        // this.line = this.line_.map((a:any)=>a.line_name)
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }

  reset() {
    this.form.reset();
  }

  // filter meployee by plant
  filterEmployeeByPlant() {
    if (this.selectedPlant == "") {
      this.employee = this.employeeData;
    } else {
      const filteredEmployeeDataByPlant = this.employeeData.filter(
        (employee: any) => {
          if (employee.plant_code == this.selectedPlant) {
            return employee;
          }
        },
      );

      if (filteredEmployeeDataByPlant.length) {
        this.employee = filteredEmployeeDataByPlant;
      } else {
        this.employee = this.employeeData;
        this.messageService.add({
          severity: "info",
          summary: `Employee Not Found For Plant: ${this.selectedPlant}`,
        });
      }
    }
  }
  // search employee
  searchEmployee(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    const foundEmployee = this.employeeData.filter((employee: any) => {
      if (employee.gen_id.includes(searchTerm)) {
        return employee;
      } else if (employee.Emp_Name.toLowerCase().includes(searchTerm)) {
        return employee;
      } else if (employee.Mobile_No == searchTerm) {
        return employee;
      }
    });
    if (foundEmployee.length) {
      this.employee = foundEmployee;
    } else {
      this.employee = this.employeeData;
    }
  }
}
