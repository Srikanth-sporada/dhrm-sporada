import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import * as XLSX from "xlsx";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-super-visor-answer",
  templateUrl: "./super-visor-answer.component.html",
  styleUrls: ["./super-visor-answer.component.css"],
})
export class SuperVisorAnswerComponent implements OnInit {
  someSubscription: any;
  filterinfo: any = [];
  id: any;
  form: any;
  searchText: any;
  plant: any;
  dept: any;
  all: any;
  userDetails: any;

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public loader: LoaderserviceService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      status: ["1"],
      plantcode: [sessionStorage.getItem("plantcode")],
      id: ["1"],
      filter: ["PENDING"],
      year: [new Date().getFullYear()],
    });
  }

  ngOnInit(): void {
    /** loged in user data */
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

    this.plant = sessionStorage.getItem("plantcode");
    this.dept = sessionStorage.getItem("dept_slno");

    console.log("plant & Dept", this.plant, this.dept);
    /** get supervisor status */
    this.getSupervisorStatus();
  }


  /** get supervisor status API */
  getSupervisorStatus(){
     this.service.getSupervisorStatus(this.plant, this.dept).subscribe({
      next: (response) => {
        console.log("supervisor Data", response);
        this.filterinfo = response;
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }

  exportexcel() {
    const x = document.querySelector("#table");
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table");
    XLSX.writeFile(wb, "Supervisor Abservation.xlsx");
    this.messageService.add({ severity: "info", summary: "Data Downloaded!" });
  }
}
