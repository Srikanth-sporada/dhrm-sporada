import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import * as XLSX from "xlsx";
import { MessageService } from "primeng/api";
import { Location } from "@angular/common";

@Component({
  selector: "app-trainee-answer",
  templateUrl: "./trainee-answer.component.html",
  styleUrls: ["./trainee-answer.component.css"],
})
export class TraineeAnswerComponent implements OnInit {
  idno: any;
  module: any;
  data: any;
  slno: any;
  status: any;
  fullname: string | null;
  all: any;
  userDetails: any;

  constructor(
    private active: ActivatedRoute,
    private service: ApiService,
    public loader: LoaderserviceService,
    private messageService: MessageService,
    private location: Location
  ) {
    /** data from route params */
    this.idno = this.active.snapshot.paramMap.get("trainee_idno");
    this.fullname = this.active.snapshot.paramMap.get("fullname");
    this.module = this.active.snapshot.paramMap.get("module_name");
    this.slno = this.active.snapshot.paramMap.get("slno");
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
    /** get trainee answer data */
    this.getTraineeAnswers();
  }

  /** 
   * get trainee answers
   * @property {*} idno
   * @property {*} module
   * @property {*} slno
   */
  getTraineeAnswers(){
    this.service
      .traineeAnswers({ idno: this.idno, module: this.module, slno: this.slno })
      .subscribe({
        next: (response: any) => {
          console.log("Trainee Asnwers", response);
          this.data = response[0];
          this.status = response[1];
          /** checking exam is offline */
          if (this.status.status == "OFFLINE") {
            this.data[0].question = "This is an Offline exam";
          }
        },
        error: (error) => {
          console.error('ERROR:',error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        },
      });
  }

  /** 
   * export trainee answer data
   */
  exportexcel() {
    const wb = XLSX.utils.book_new();
    const x = document.querySelector("#table");
    // Create a new worksheet
    const ws = XLSX.utils.table_to_sheet(x);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "trainee_answer");

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `${this.idno}_${this.fullname}.xlsx`);
    this.messageService.add({ severity: "info", summary: "Data Converted" });
  }

  goback() {
    this.location.back();
  }
}
