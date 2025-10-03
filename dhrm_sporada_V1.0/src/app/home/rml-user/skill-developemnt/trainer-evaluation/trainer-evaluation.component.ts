import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import * as XLSX from "xlsx";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-trainer-evaluation",
  templateUrl: "./trainer-evaluation.component.html",
  styleUrls: ["./trainer-evaluation.component.css"],
})
export class TrainerEvaluationComponent implements OnInit {
  someSubscription: any;
  filterinfo: any = [];

  id: any;
  form: any;
  searchText: any;
  year: {year:Number}[] = [];
  options = [
    { label: "0 to 60 days", value: "0-60" },
    { label: "61 to 120 days", value: "61-120" },
    { label: "121 to 180 days", value: "121-180" },
    { label: "181 to 270 days", value: "181-270" },
  ];
  evaluationOptions = [
  { value: '1', label: 'First Evaluation' },
  { value: '2', label: 'Second Evaluation' },
  { value: '3', label: 'Third Evaluation' },
  { value: '4', label: 'Fourth Evaluation' }
];

statusOptions = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'APPROVED', label: 'COMPLETED' }
];

  all:any;
  userDetails:any;
  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public loader: LoaderserviceService,
    private messageService:MessageService
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
      let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 45;
    for (let i = currentYear; i >= oldestYear; i--) {
      this.year.push({year:i});
    }
    console.log(this.year)
    this.service.evaluationdays(this.form.value).subscribe({
      next: (response) => {
        console.log(response);
        this.filterinfo = response;
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    });
  }

  formatDate(dateString: string): string {
    const formattedDate = dateString.split("T")[0].replace(/\./g, "-");
    return formattedDate
      ? new Date(formattedDate).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "Invalid Date";
  }

  filter() {
    this.service.evaluationdays(this.form.value).subscribe({
      next: (response) => {
        console.log(response);
        this.filterinfo = response;
      },
       error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    });
  }

  save() {
    console.log(this.form.value);
  }

  exportexcel() {
    const x = document.querySelector("#table");
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table");
    XLSX.writeFile(wb, "table.xlsx");
    this.messageService.add({severity:'info',summary:'Data Exported!'})
  }
}
