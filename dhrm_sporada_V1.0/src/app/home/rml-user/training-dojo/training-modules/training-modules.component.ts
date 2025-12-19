import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  ViewContainerRef,
  TemplateRef,
  NgModule,
  Inject,
  ViewEncapsulation,
} from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import * as XLSX from "xlsx";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { environment } from "src/environments/environment.prod";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
@Component({
  selector: "app-training-modules",
  templateUrl: "./training-modules.component.html",
  styleUrls: ["./training-modules.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TrainingModulesComponent implements OnInit {
  closeResult: string;
  form: any;
  sample: any = environment.path;
  all: any;
  category: any = [];
  status: any = "ONLINE";
  userDetails: any;
  dummy: any = [{}];
  moduleData: any = [];
  editing_flag: any;
  temp_a: any;

  // add company template reference
  @ViewChild("content", { read: TemplateRef }) addCompanyTemplateRef:
    | TemplateRef<unknown>
    | undefined;
  // Speed Dial items
  items: MenuItem[] = [
    {
      icon: "pi pi-plus-circle",
      tooltipOptions: {
        tooltipLabel: "Add Module",
      },
      command: () => {
        this.open(this.addCompanyTemplateRef);
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
    private confirmationService: ConfirmationService
  ) {
    /** filter type */
    this.category = [
       {
        label: "All",
        value: '',
      },
      {
        label: "Online",
        value: "ONLINE",
      },
      {
        label: "Offline",
        value: "OFFLINE",
      },
    ];

    /** offline test form */
    this.form = this.fb.group({
      slno: [""],
      module_name: ["", Validators.required],
      pass_criteria: ["", Validators.required],
      total_marks: ["", Validators.required],
      pass_percent: [""],
      category: ["", Validators.required],
      priorityval: ["", Validators.required],
      plantcode: [""],
    });
  }

  ngOnInit(): void {
    /** logged in user details */
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

    var username = { username: sessionStorage.getItem("plantcode") };
    this.getTrainingModules();
  }

  /** get training modules based on plant & user name */
  getTrainingModules(){
    this.service
      .getModulesQa(this.all?.User_Name, this.all?.plant_code)
      .subscribe({
        next: (response) => {
          this.dummy = response;
          this.moduleData = response;
        },
        error: (error) => {
          console.error('ERROR:',error);
           this.messageService.add({
            severity: "error",
            summary: error.message,
          })
        }
      });
  }

  /** 
   * calcualte pass percentage
   */
  cal() {
    var a = this.form.controls["pass_criteria"].value;
    var b = this.form.controls["total_marks"].value;
    var c = Math.round((a / b) * 100);
    this.form.controls["pass_percent"].setValue(c);
  }

  /** 
   * open add training module
   */
  open(content: any) {
    this.form.reset();
    this.editing_flag = false;
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  /** add training module */
  save() {
    /** set logged in user plant code */
    this.form.controls["plantcode"].setValue(
      sessionStorage.getItem("plantcode")
    );
    /** add module API */
    this.service.addmodule(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "already") {
          this.messageService.add({
            severity: "info",
            summary: "Module with same priority value already exists",
          });
          // alert('Module with same priority value already exists')
        } else {
          this.dummy.push(this.form.value);
          this.form.reset();
          this.messageService.add({
            severity: "info",
            summary: "Training Module Added Successfully.",
          });
        }
      },
      error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message })
      }
    });
  }

  /** update module modal */
  opentoedit(content: any) {
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  /** 
   * update form patch values
   * @param a update module idx
   * @param slno
   *  */
  edit(a: any, slno: any) {
    this.temp_a = a;
    this.editing_flag = true;
    this.form.controls["slno"].setValue(slno);
    this.form.controls["module_name"].setValue(this.dummy[a].module_name);
    this.form.controls["pass_criteria"].setValue(this.dummy[a].pass_criteria);
    this.form.controls["total_marks"].setValue(this.dummy[a].total_marks);
    this.form.controls["pass_percent"].setValue(this.dummy[a].pass_percent);
    this.form.controls["category"].setValue(this.dummy[a].category);
    this.form.controls["priorityval"].setValue(this.dummy[a].priorityval);
  }

  /** 
   * update training modules
   */
  editSave() {
    /** set user plant code */
    this.form.controls["plantcode"].setValue(
      sessionStorage.getItem("plantcode")
    );
    /** update module API */
    this.service.updatemodule(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "already") {
          this.messageService.add({
            severity: "info",
            summary: "Module with same priority value already exists",
          });
          // alert('Module with same priority value already exists')
        } else {
          this.dummy[this.temp_a] = this.form.value;
          this.messageService.add({
            severity: "info",
            summary: "Training Module Updated Successfully.",
          });
        }
      },
      error: (error) => {
        console.error('ERROR:',error);
         this.messageService.add({ severity: "error", summary: error.message })
      }
    });
  }

  // delete training module
  deleteTrainingModule(event: Event, a: any, slno: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to Delete?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteTrainingModuleAPICall(a, slno);
      },
      reject: () => {
        this.messageService.add({ severity: "error", summary: "Rejected" });
      },
    });
  }
  // delete training module api call
  deleteTrainingModuleAPICall(a: any, slno: any) {
    this.service.deletemodule({ slno: slno }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "success") this.dummy.splice(a, 1);
        this.messageService.add({
          severity: "info",
          summary: "Training Module Deleted.",
        });
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    });
  }

  exportexcel(): void {
    let element = document.getElementById("table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Training_Modules.xlsx");
    this.messageService.add({ severity: "info", summary: "Data Exported." });
  }

  /** form rest */
  reset() {
    this.form.reset();
  }

  /** 
   * filter module by category
   * @property {*} dummy
   * @property {*} moduleData // has copy data of module
   */
  filterModulesByCategory() {

    if(this.status){
      const filteredModuleData = this.moduleData.filter(
        (module: any) => module.category == this.status
      );

      if (filteredModuleData.length) {
        this.dummy = filteredModuleData;
      } else {
        this.dummy = this.moduleData;
        this.messageService.add({
          severity: "info",
          summary: "No Modules Found!",
        });
      }
    }else{
      this.dummy = this.moduleData;
    }
   
  }
}
