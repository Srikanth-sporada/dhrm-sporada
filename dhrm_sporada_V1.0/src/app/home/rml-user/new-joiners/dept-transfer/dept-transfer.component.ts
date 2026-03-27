import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { DatePipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-dept-transfer",
  templateUrl: "./dept-transfer.component.html",
  styleUrls: ["./dept-transfer.component.css"],
})
export class DeptTransferComponent implements OnInit {
  someSubscription: any;
  filterinfo: any = [];
  id: any;
  form: any;
  page: any = 1;
  pageSize: any = 50;
  paginateData: any;
  collectionSize: any = 0;
  from: any;
  currentDate = new Date();
  to: any = new DatePipe("en-US").transform(new Date(), "yyyy-MM-dd");
  searchText: any;
  department: any;
  dept: any;
  all: any;
  userDetails: any;
  apprenticeType:any;
   /** contractor list
   * used to seperate contract trainee & company trainee
   */
  contractorsList:any = [
    'CL',
    'CL_PIECE_RATE',
    'VENDOR_NAPS',
    'VENDOR_LEAP',
    'VENDOR_BVOC',
    'VENDOR_DVOC',
    'VENDOR_NATS',
    'VENDOR_LEARN_EARN',
    'VENDOR_NEEM']
  constructor(
    private fb: UntypedFormBuilder,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public loader: LoaderserviceService,
    private messageService: MessageService
  ) {
    this.from = new DatePipe("en-US").transform(
      new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 3,
        this.currentDate.getDate()
      ),
      "yyyy-MM-dd"
    );
    if (this.from >= this.currentDate) {
      this.from = new DatePipe("en-US").transform(
        new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() - 2,
          0
        ),
        "yyyy-MM-dd"
      );
    }
    this.form = this.fb.group({
      plantcode: [sessionStorage.getItem("plantcode")],
    });
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
    /** get department */
    this.getDepartmentByPlantCode();
    /** get trainee data */
    this.getTraineeData();
  }

  /** get department by plant code */
  getDepartmentByPlantCode(){
    this.service
      .dept_line_report({ plantcode: sessionStorage.getItem("plantcode") })
      .subscribe({
        next: (response: any) => {
          console.log('RESPONSE:',response);
          /** response[1] contains dept data [0]emp [2] line */
          this.department = response[1];
        },
        error: (error:any) => {
          console.error("ERROR:",error);
          this.messageService.add({ severity: "error", summary: error.message })
        }
      });
  }

  /** 
   * get trainee data for dept transfer
   * @property {*} form
   * @property {*} filterinfo
   * @property {*}
   *  */
  getTraineeData(){
    this.service.depttransfer(this.form.value).subscribe({
      next: (response:any) => {
        console.log(response);
        this.filterinfo = response;
        this.collectionSize = this.filterinfo.length;
        
        this.getPremiumData();
      },
      error: (err) => {
        console.error('ERROR:',err);
         this.messageService.add({ severity: "error", summary: err.message })
      }
    });
  }

  filter() {
    this.service.onboard(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        this.filterinfo = response;
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }

  call(event: any) {
    this.from = event.target.value;
    console.log(this.from);
    this.collectionSize = this.paginateData;
  }
  
  call2(event: any) {
    this.to = event.target.value;
    console.log(this.to);
    this.collectionSize = this.paginateData;
  }

  save() {
    console.log(this.form.value);
  }

  getPremiumData() {
    this.paginateData = this.filterinfo.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    console.log(this.collectionSize);
  }
}
