import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import * as XLSX from "xlsx";
import moment from "moment";
import { ClamAPIService } from "../../../../new-contractor-mod/clam-api.service";
import { ToastComponent } from "../../../../new-contractor-mod/toast/toast.component";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "primeng/api";
import { ApiService } from "src/app/home/api.service";

@Component({
  selector: "app-canteen-reports",
  templateUrl: "./canteen-reports.component.html",
  styleUrls: ["./canteen-reports.component.css"],
})
export class CanteenReportsComponent implements OnInit {
  cntForm: FormGroup;
  cntlist: any;
  isadmin: string | null = sessionStorage.getItem("isadmin");
  plant_Code: any = sessionStorage.getItem("plantcode");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  button1: boolean = false;
  all:any;
  userDetails:any;
  plantList:any = [];
 reportTypeOptions = [
  { label: 'Summary Report', value: 'Summary' },
  { label: 'Detailed Report', value: 'Detailed' }
];

  constructor(
    private fb: UntypedFormBuilder,
    private api: ClamAPIService,
    private dialog: MatDialog,
    private apiService:ApiService,
    private messageService:MessageService
  ) {
    this.cntForm = this.fb.group({
      plant: [this.plant_Code],
      FromDate: "",
      ToDate: "",
      rpt_type: "",
    });
  }

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
   
    this.apiService.getplant().subscribe({
      next: (response) => {
        this.plantList = response;
        this.plantList.unshift({plant_name:'All',plant_code:''})
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
    
  }
  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
      },
    });
  }

  download() {
    console.log(this.cntForm.value);
    this.button1 = true;
    // formatting date value
    this.cntForm.controls['FromDate'].setValue(moment(this.cntForm.value.FromDate).format('YYYY-MM-DD'));
    this.cntForm.controls['ToDate'].setValue(moment(this.cntForm.value.ToDate).format('YYYY-MM-DD'));

    this.api.getCanteenRpt(this.cntForm.value).subscribe(
      (res) => {
        // console.log(res)
        this.cntlist = res;

        // console.log(this.cntlist.length)
        if (this.cntlist.length == 0) {
          // this.openAlertDialog("Data not Found", "error");
          this.messageService.add({severity:'info',summary:'Data Not Found!'})
        } else {
          this.exportExcel(this.cntlist);
          this.cntForm.reset();
          this.button1 = false;
          // console.log(this.cntlist)
        }
      },
      (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message});
        this.button1 = false;
      }
    );
  }

  exportExcel(data: any): void {
    //
    // console.log(data.data)
    // console.log(data.rpt_type)

    let fileName;
    let sheetName;

    if (data.rpt_type === "Summary") {
      fileName = "Canteen Summary Report";
      sheetName = "Summary";
    } else if (data.rpt_type === "Detailed") {
      fileName = "Canteen Detailed Report";
      sheetName = "Detailed";
    }

    const transformedArray: any = data.data.map((data: any) => {
      const transformedObj: any = {};
      Object.keys(data).forEach((key) => {
        const newKey = key.replace(/_/g, " ");
        transformedObj[newKey] = data[key];
      });
      return transformedObj;
    });
    // console.log(transformedArray);
    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    this.messageService.add({severity:'info',summary:'Data Downloaded!'})
  }
}
