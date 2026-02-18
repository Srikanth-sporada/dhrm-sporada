import { Component, OnInit } from "@angular/core";
import { ClamAPIService } from "../../clam-api.service";
import { MatDialog } from "@angular/material/dialog";
import { LoaderserviceService } from "../../../loaderservice.service";
import { Router, NavigationExtras } from "@angular/router";
import * as XLSX from "xlsx";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-update-payscale",
  templateUrl: "./update-payscale.component.html",
  styleUrls: ["./update-payscale.component.css"],
})

export class UpdatePayscaleComponent implements OnInit {
  issupervisor: string | null = sessionStorage.getItem("issupervisor");
  ishrappr: string | null = sessionStorage.getItem("ishrappr");
  isadmin: string | null = sessionStorage.getItem("isadmin");
  ishr: string | null = sessionStorage.getItem("ishr");
  plant_Code: any = sessionStorage.getItem("plantcode");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  apnt_list: any = [];
  Con_list: any;
  selectedDoj: any;
  selectedGenId: any;
  selectedContrator: any;
  all: any;
  userDetails: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ClamAPIService,
    public loader: LoaderserviceService,
    private messageService: MessageService,
  ) {}

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
    /** get appointed contract employees */
    this.getAppointedList();
    /** get contractor list */
    this.getContra();
  }

  /** 
   * get contract appointed list
   * @property {*} api
   */
  getAppointedList() {
    this.api.getapntList(this.plant_Code).subscribe({
      next: (res) => {
        this.apnt_list = res;
        console.log('APPOINTED LIST:',res);
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  getContra() {
    this.api.getContractor().subscribe({
      next: (res) => {
        this.Con_list = res;
        /** filter plant & active contractor list */
        this.Con_list = this.Con_list.filter((item: any) => item.Plant_code == this.plant_Code && item.Status === true);
      },
      error:(error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  } 

  // navigateToNextPageWithData(data: any) {
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       customData: data,
  //     },
  //   };

  //   this.router.navigate(['/rhrm/contra/updt_payscale/'], navigationExtras);
  // }

  exportexcel(): void {
    const newKeys: any = {
      plant_code: "Plant",
      apln_slno: "Apln_Slno",
      fullname: "Employee_Name",
      birthdate: "DOB",
      gen_id: "Gen_Id",
      doj: "DOJ",
      dept_name: "Department",
      apln_status: "Application_Status",
    };

    const transformedArray: any = this.apnt_list.map((obj: any) => {
      const transformedObj: any = {};
      Object.keys(newKeys).forEach((key) => {
        const newKey = newKeys[key] || key;
        transformedObj[newKey] = obj[key];
      });
      return transformedObj;
    });

    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary update Employee list");
    XLSX.writeFile(wb, "Non_SAP_Employee.xlsx");
    this.messageService.add({ severity: "info", summary: "Data Converted!" });
  }
}
