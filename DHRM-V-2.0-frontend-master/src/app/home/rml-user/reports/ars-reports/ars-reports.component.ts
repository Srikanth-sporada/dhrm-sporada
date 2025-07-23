import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import * as moment from "moment";
import * as XLSX from "xlsx-js-style";

@Component({
  selector: "app-ars-reports",
  templateUrl: "./ars-reports.component.html",
  styleUrls: ["./ars-reports.component.css"],
})
export class ArsReportsComponent implements OnInit {
  from: any = "";
  to: any = "";
  plant: any;
  min: any;
  max: any;
  fromMax: any;
  plantlist: any[];
  isadmin: any;
  isHrappr: any;
  selectedReportType: any;
  employeeType:any='T';
  monthReport:any[]=['coff']
  monthReport1:any[]=['MAS']
  yearReport:any[]=['Optr_LB','P2']
  sapReport:any[]=['OPtr']
  sapType:any[]=['Payroll']
  filterReportTypr:any[]
  
  reportType: any = [
    { name: "Muster", code: "mr", days: 7 ,plant:'All'},
    { name: "Forgot To Punch", code: "fp", days: 31 ,plant:'All'},
    { name: "Comp-Off/OT Summary", code: "coff", days: 31 ,plant:'All'},
    { name: "OT Hours More Than 75hrs", code: "OT75", days: 365 ,plant:'All'},
    { name: "Payroll - Non SAP", code: "Npayroll", days: 31 ,plant:'All'},
    { name: "Payroll - SAP", code: "Spayroll", days: 31 ,plant:'All'},
    { name: "Approved Excess Hrs", code: "ach", days: 31 ,plant:'All'},
    { name: "Adjusted C-Off", code: "ac", days: 31 ,plant:'All'},
    { name: "Shift Cancel Report", code: "sc", days: 31 ,plant:'All'},
    { name: "PMPD Head Count", code: "phc", days: 31 ,plant:'All'},
    { name: "HR Head Count Report", code: "HRC", days: 31 ,plant:'All'},
    { name: "Skill Summary", code: "sks", days: 31 ,plant:'All'},
    { name: "Miss Punch Report", code: "mp", days: 31 ,plant:'All'},
    { name: "Continuous 11 Days Working", code: "cont", days: 31 ,plant:'All'},
    { name: "On-Duty Report", code: "OD", days: 60 ,plant:'All'},
    { name: "Operator Leave Report", code: "LP", days: 31 ,plant:'All'},
    { name: "Operator Leave Balance Report", code: "Optr_LB", days: 31 ,plant:'All'},
    { name: "Operator Permission Report", code: "PR", days: 31 ,plant:'All'},
    { name: "Operator/CAPS-SAP Report", code: "OPtr", days: 365 ,plant:'All'},
    { name: "P2 incentive Report", code: "P2", days: 365 ,plant:'1200'},
    { name: "Head Count Plan Vs Actual -Direct Manpower", code: "HCP", days: 365 ,plant:'All'},
    { name: "HO-Payroll-Report", code: "HO_5or6_RPT", days: 365 ,plant:'1000'},
    { name: "RACM Attendance Report", code: "RACM", days: 365 ,plant:'All'},
    { name: "Muster Attendance Summary", code: "MAS", days: 365 ,plant:'All'},
    { name: "Middle Permission Report", code: "MPER", days: 365 ,plant:'All'},
    { name: "Van Delay Regularization Report", code: "VDR", days: 365 ,plant:'All'},
    
  ]
   
  loading:any=false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.from=moment(new Date()).format("YYYY-MM-DD");
    this.to =moment(new Date()).format("YYYY-MM-DD");
    this.fromMax = moment(new Date()).format("YYYY-MM-DD");
    this.plant = "";
    this.selectedReportType = "mr";
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    this.isHrappr = sessionStorage.getItem("ishrappr");



  

    
    if (this.isadmin == "false") {
      this.plant = plantCode;
    }

    this.api.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
      },
      error: (error) => console.log(error),
    });
  }

  datechnage() {
    let type = this.reportType.filter((element: any) => {
  
      return element.code == this.selectedReportType;
      
    });
    let isUnrestrictedReport = ['LP','PR','HCP'].includes(type[0].code);
    let isUnresrictedReport = ['OPtr'].includes(type[0].code);
    // console.log(type)
    // console.log(type[0].code)

    if (isUnrestrictedReport) {
      this.max = null;
      this.to = null;
    }else if(isUnresrictedReport){
      let from = new Date(this.from);
      from.setDate(from.getDate() + type[0].days);
      let year = from.getFullYear();
      let month = from.getMonth() + 1;
      let day = from.getDate();
      let max =
        year +
        "-" +
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0");
      // console.log(max);
      let today = new Date().toJSON().split("T")[0];
  
  
      if (max < today) {
        this.max = max;
        this.to = max;
      }
      else {
        this.max = today;
        this.to = today;
      }
  
    
    }
    else{
      let from = new Date(this.from);
      from.setDate(from.getDate() + type[0].days);
      let year = from.getFullYear();
      let month = from.getMonth() + 1;
      let day = from.getDate();
      let max =
        year +
        "-" +
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0");
      // console.log(max);
      let today = new Date().toJSON().split("T")[0];
  
  
      if (max < today) {
        this.max = max;
        this.to = max;
      }
      else {
        this.max = today;
        this.to = today;
      }
      this.to = today;
  
    }
  
   
  }




  getData() {
    this.loading = true;
    let data = {
      from: this.monthReport.includes(this.selectedReportType) ? this.from + '-01' : this.from,
      to: this.to,
      type: this.selectedReportType,
      plant: this.plant,
      cat: this.employeeType
    };
    console.log(data)
    this.api.arsReports(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.status === 'success') {
        if (Array.isArray(resp.data) && resp.data.length === 0) {
          alert('No data found');
          this.loading = false;
        } else {
          this.exportexcel(resp.data);
          // console.log(resp);
          this.loading = false;
        }
      } else {
        alert(resp.message);
        this.loading = false;
      }
    });
  }
  

  // exportexcel(data: any) {
  //   let type = this.reportType.filter((element: any) => {
  //     return element.code == this.selectedReportType;
  //   });
  //   var ws = XLSX.utils.json_to_sheet(data);
  //   var wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Report");
  //   XLSX.writeFile(wb, `${type[0].name}-report.xlsx`);
  // }




  // exportexcel(data: any){
  //   if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])){
  //     var wb = XLSX.utils.book_new();
  //     let type = this.reportType.filter((element: any) => {
  //       return element.code == this.selectedReportType;
  //     });
      
  //     data.forEach((dataArray, index) => {
  //       var ws = XLSX.utils.json_to_sheet(dataArray);
  //       XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
  //     });
  
  //     XLSX.writeFile(wb, `${type[0].name}-report.xlsx`);
  //   }else{
  //     let type = this.reportType.filter((element: any) => {
  //       return element.code == this.selectedReportType;
  //     });
  //     var ws = XLSX.utils.json_to_sheet(data);
  //     var wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, "Report");
  //     XLSX.writeFile(wb, `${type[0].name}-report.xlsx`);
  //   }

  exportexcel(data: any) {
    console.log(data);
    console.log();
    
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      var wb = XLSX.utils.book_new();
      let type = this.reportType.filter((element: any) => element.code == this.selectedReportType);
      console.log(type[0].code);
      if (!type || type.length === 0) {
        console.error('Invalid report type selected');
        return;
      }
  
      let sheets = [];
  
      if (type[0].code === 'HO_5or6_RPT') {
        if(this.from<='2024-08-25'){
          sheets = [
            { sheetName: '6 Days Working Payroll Report', dataArray: data[0] },
            { sheetName: '5 Days Working Payroll Report', dataArray: data[1] },
          ];
        }else{
          sheets = [
            { sheetName: '5 & 6 Days Working Payroll Report', dataArray: data[0] },
           
          ];
        }
    
      }
       else if (type[0].code === 'OPtr') {

        sheets = [
          { sheetName: 'LOP', dataArray: data[0] },
          { sheetName: 'Shift details', dataArray: data[1] },
          { sheetName: 'Permissions', dataArray: data[2] },
          { sheetName: 'Substitutions', dataArray: data[3] },
          { sheetName: 'Leave', dataArray: data[4] || [] }
        ];
      } 
       else if (type[0].code === 'HRC') {

        sheets = [
          { sheetName: 'Head Count Details', dataArray: data[0] },
          { sheetName: 'In-Direct Summary', dataArray: data[1] },

        ];
      } 
      
      
      
      else {
        console.error('Unsupported report type');
        return;
      }
  
      if (sheets.length === 0) {
        console.error('No sheets defined for the selected report type');
        return;
      }
  
      sheets.forEach((sheet, index) => {
        console.log(sheet.dataArray);
        
        if (sheet.dataArray && sheet.dataArray.length) { 
          var ws = XLSX.utils.json_to_sheet(sheet.dataArray);
          const headerRange = XLSX.utils.decode_range(ws['!ref']!);

          for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cellAddress]) continue;
            ws[cellAddress].s = {
              font: { bold: true, color: { rgb: "000000" } }, // Bold Black Text
              fill: { fgColor: { rgb: "FFFF00" } }, // Yellow Background
              alignment: { horizontal: "center", vertical: "center" }, // Center Alignment
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
              }
            };
          }
  
          const columnWidths = Object.keys(sheet.dataArray[0] || {}).map((key) => ({
            width: key.length * 2, // Adjust width based on header length
        }));
        ws["!cols"] = columnWidths;
          // Append the sheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, `${sheet.sheetName}`);
        } else {
          console.error(`Invalid data format for ${sheet.sheetName}.`);
          var ws = XLSX.utils.json_to_sheet(sheet.dataArray);





          XLSX.utils.book_append_sheet(wb, ws, `${sheet.sheetName}`);
        }
      });
  
      XLSX.writeFile(wb, `${type[0].name}-report.xlsx`);
    } else {
      let type = this.reportType.filter((element: any) => element.code == this.selectedReportType);
      var ws = XLSX.utils.json_to_sheet(data);
      var wb = XLSX.utils.book_new();
      const headerRange = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "000000" } }, // Bold Black Text
        fill: { fgColor: { rgb: "FFFF00" } }, // Yellow Background
        alignment: { horizontal: "center", vertical: "center" }, // Center Alignment
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
    
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${type[0]?.name}-report.xlsx`);
    }
  }







}
