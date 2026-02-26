import { Component, OnInit } from "@angular/core";
import moment from "moment";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import { ApiService } from "src/app/home/api.service";
import { ClamAPIService } from "../../clam-api.service";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";
@Component({
  selector: "app-emp-sal-master",
  templateUrl: "./emp-sal-master.component.html",
  styleUrls: ["./emp-sal-master.component.css"],
})
export class EmpSalMasterComponent implements OnInit {
  plant: any;
  plantCode: any;
  isadmin: any;
  emp_Sal_List: any[];
  plantlist: any[];
  loading: any = false;
  userDetails: any;
  all: any;

  constructor(
    private api: ApiService,
    private clApi: ClamAPIService,
    private messageService: MessageService,
    protected loader:LoaderserviceService,
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
    this.plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    if (this.isadmin == "false") {
      this.plant = this.plantCode;
    }
    this.plant = this.plantCode;
    this.getPlants();
  }

  /** get plant code */
  getPlants(){
     this.api.getplantcode(this.plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
        this.plantlist.unshift({ plant_name: "All", plant_code: "" });
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error?.error?.message });
      },
    });
  }
  /** 
   * get data 
   */
  getData() {
    this.loading = true;
    this.clApi.getEmp_Sal_Master(this.plant).subscribe({
      next:(res: any) => {
        if (res.status === "Failure" && res.data.length == 0) {
          this.loading = false;
          this.messageService.add({
            severity: "info",
            summary: "No Data Found!",
          });
        } else if (res.status === "Success" && res.data.length == 0) {
          this.loading = false;
          this.messageService.add({
            severity: "info",
            summary: "No data found",
          });
        } else if (res.status === "Success" && res.data.length > 0) {
          this.exportExcel(res.data);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error?.error?.message || error?.message })
      }
    });
  }

  exportExcel(data: any[]): void {
    console.log(data);

    const groupedData = data.reduce((acc: any, obj: any) => {
      const conId = obj.Con_Id;
      if (!acc[conId]) {
        acc[conId] = [];
      }
      acc[conId].push(obj);
      return acc;
    }, {});

    const wb = XLSX.utils.book_new();

    Object.keys(groupedData).forEach((conId) => {
      const records = groupedData[conId];

      // Safely get the company name
      const companyName =
        records[0]?.Cont_company_name?.trim()?.substring(0, 30) ||
        "Unknown Company";
      console.log(companyName);

      // Exclude the specified keys
      const excludedKeys = [
        "Effective_Date1",
        "Cont_company_name,",
        "Cont company name",
        "apln_slno",
        "Con_Id",
        "Effective_Date",
        "Tot_Deduction",
        "Gross_Earnings",
        "Status",
        "PayScale_ID",
        "SC_Base",
      ];
      const transformedArray = records.map((record: any) => {
        const transformedObj: any = {};
        Object.keys(record).forEach((key) => {
          if (!excludedKeys.includes(key)) {
            const newKey = key.replace(/_/g, " "); // Replace underscores with spaces
            transformedObj[newKey] = record[key] === "NULL" ? "" : record[key]; // Replace null values with empty strings
          }
        });
        return transformedObj;
      });

      // Create a worksheet and append it to the workbook
      const ws = XLSX.utils.json_to_sheet(transformedArray);

      // Apply styling to the header row
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

      // Add the worksheet to the workbook with the sheet name as Cont_company_name
      XLSX.utils.book_append_sheet(wb, ws, companyName);
    });

    XLSX.writeFile(wb, "Employee Payscale Master.xlsx");
    this.messageService.add({ severity: "info", summary: "Data Downloaded." });
  }
}
