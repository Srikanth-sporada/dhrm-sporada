import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import moment from "moment";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";


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
  // new
  Is_CFIN: any;
  Is_CHR: any;
  isHrappr: any;
  selectedReportType: any;
  employeeType:any='T';
  monthReport:any[]=['coff']
  monthReport1:any[]=['MAS']
  yearReport:any[]=['Optr_LB','P2']
  sapReport:any[]=['OPtr']
  sapType:any[]=['Payroll']
  filterReportTypr:any[]
  // reportType: any = [
  //   { name: "Muster", code: "mr", days: 7 ,plant:'All'},
  //   { name: "Forgot To Punch", code: "fp", days: 31 ,plant:'All'},
  //   { name: "Comp-Off/OT Summary", code: "coff", days: 31 ,plant:'All'},
  //   { name: "OT Hours More Than 75hrs", code: "OT75", days: 365 ,plant:'All'},
  //   { name: "Payroll - Non SAP", code: "Npayroll", days: 31 ,plant:'All'},
  //   { name: "Payroll - SAP", code: "Spayroll", days: 31 ,plant:'All'},
  //   { name: "Approved Excess Hrs", code: "ach", days: 31 ,plant:'All'},
  //   { name: "Adjusted C-Off", code: "ac", days: 31 ,plant:'All'},
  //   { name: "Shift Cancel Report", code: "sc", days: 31 ,plant:'All'},
  //   { name: "PMPD Head Count", code: "phc", days: 31 ,plant:'All'},
  //   { name: "HR Head Count Report", code: "HRC", days: 31 ,plant:'All'},
  //   { name: "Skill Summary", code: "sks", days: 31 ,plant:'All'},
  //   { name: "Miss Punch Report", code: "mp", days: 31 ,plant:'All'},
  //   { name: "Continuous 11 Days Working", code: "cont", days: 31 ,plant:'All'},
  //   { name: "On-Duty Report", code: "OD", days: 60 ,plant:'All'},
  //   { name: "Operator Leave Report", code: "LP", days: 31 ,plant:'All'},
  //   { name: "Operator Leave Balance Report", code: "Optr_LB", days: 31 ,plant:'All'},
  //   { name: "Operator Permission Report", code: "PR", days: 31 ,plant:'All'},
  //   { name: "Operator/CAPS-SAP Report", code: "OPtr", days: 365 ,plant:'All'},
  //   { name: "P2 incentive Report", code: "P2", days: 365 ,plant:'1200'},
  //   { name: "Head Count Plan Vs Actual -Direct Manpower", code: "HCP", days: 365 ,plant:'All'},
  //   { name: "HO-Payroll-Report", code: "HO_5or6_RPT", days: 365 ,plant:'1000'},
  //   { name: "RACM Attendance Report", code: "RACM", days: 365 ,plant:'All'},
  //   { name: "Muster Attendance Summary", code: "MAS", days: 365 ,plant:'All'},
  //   { name: "Middle Permission Report", code: "MPER", days: 365 ,plant:'All'},
  //   { name: "Van Delay Regularization Report", code: "VDR", days: 365 ,plant:'All'},
    
  // ]
 reportType: any = [
  { index: 1, name: "Muster", code: "mr", days: 7 , plant:'All'},
  { index: 2, name: "Forgot To Punch", code: "fp", days: 31 , plant:'All'},
  { index: 3, name: "Comp-Off/OT Summary", code: "coff", days: 31 , plant:'All'},
  { index: 4, name: "OT Hours More Than 75hrs", code: "OT75", days: 365 , plant:'All'},
  { index: 5, name: "Payroll - Non SAP", code: "Npayroll", days: 31 , plant:'All'},
  { index: 6, name: "Payroll - SAP", code: "Spayroll", days: 31 , plant:'All'},
  { index: 7, name: "Approved Excess Hrs", code: "ach", days: 31 , plant:'All'},
  { index: 8, name: "Adjusted C-Off", code: "ac", days: 31 , plant:'All'},
  { index: 9, name: "Shift Cancel Report", code: "sc", days: 31 , plant:'All'},
  { index: 10, name: "PMPD Head Count", code: "phc", days: 31 , plant:'All'},
  { index: 11, name: "HR Head Count Report", code: "HRC", days: 31 , plant:'All'},
  { index: 12, name: "Skill Summary", code: "sks", days: 31 , plant:'All'},
  { index: 13, name: "Miss Punch Report", code: "mp", days: 31 , plant:'All'},
  { index: 14, name: "Continuous 11 Days Working", code: "cont", days: 31 , plant:'All'},
  { index: 15, name: "On-Duty Report", code: "OD", days: 60 , plant:'All'},
  { index: 16, name: "Operator Leave Report", code: "LP", days: 31 , plant:'All'},
  { index: 17, name: "Operator Leave Balance Report", code: "Optr_LB", days: 31 , plant:'All'},
  { index: 18, name: "Operator Permission Report", code: "PR", days: 31 , plant:'All'},
  { index: 19, name: "Operator/CAPS-SAP Report", code: "OPtr", days: 365 , plant:'All'},
  { index: 20, name: "P2 incentive Report", code: "P2", days: 365 , plant:'1200'},
  { index: 21, name: "Head Count Plan Vs Actual -Direct Manpower", code: "HCP", days: 365 , plant:'All'},
  { index: 22, name: "HO-Payroll-Report", code: "HO_5or6_RPT", days: 365 , plant:'1000'},
  { index: 23, name: "RACM Attendance Report", code: "RACM", days: 365 , plant:'All'},
  { index: 24, name: "Muster Attendance Summary", code: "MAS", days: 365 , plant:'All'},
  { index: 25, name: "Middle Permission Report", code: "MPER", days: 365 , plant:'All'},
  { index: 26, name: "Van Delay Regularization Report", code: "VDR", days: 365 , plant:'All'},
  { index: 27,name: "Punch Reprocess", code: "punchprocess", days: 2, plant: 'All' }, // new
];
  employeeTypes = [
  { label: 'Trainee', value: 'T' },
  { label: 'Operator', value: 'O' }
];

employeeTypeOptions = [
  { label: 'SAP', value: 'S' },
  { label: 'NON SAP', value: 'N' }
];

   all:any;
   userDetails:any;
  loading:any=false;

  constructor(
    private api: ApiService, 
    private messageService:MessageService
  ) {}

  ngOnInit() {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.from= new Date();
    this.to = new Date();
    this.fromMax = new Date();
    this.plant = sessionStorage.getItem('plantcode');
    this.selectedReportType = "mr";
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin") === "true";
    this.Is_CFIN = sessionStorage.getItem("Is_CFIN") === "true"; // new
    this.isHrappr = sessionStorage.getItem("ishrappr") === "true";
    this.Is_CHR = sessionStorage.getItem("Is_CHR") === "true"; // new
    
    if (this.isadmin == "false") {
      this.plant = plantCode;
    }

    this.api.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.response})
      },
    });
  }

  datechange() {
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
      from.setDate(from.getDate() + type[0].days); // set from date based on the report days
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
        this.max = new Date(max);
        this.to = new Date(max);
      }
      else {
        this.max = new Date(today);
        this.to = new Date(max);
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
        this.max = new Date(max);
        this.to = new Date(max);
      }
      else {
        this.max = new Date(today);
        this.to = new Date(today);
      }
      this.to = new Date(today);
  
    }
  
   
  }

  getData() {
    this.loading = true;
    console.log('from date:',this.from)
    /** report format */
    let data = {
      from: this.monthReport.includes(this.selectedReportType) ? moment(this.from).format('YYYY-MM-DD') : moment(this.from).format('YYYY-MM-DD'),
      to: moment(this.to).format('YYYY-MM-DD'),
      type: this.selectedReportType,
      plant: this.plant,
      cat: this.employeeType
    };
    console.log('ARS REPORT GET PARAMS:',data)
    this.api.arsReports(data).subscribe({
      next: (resp: any) => {
      console.log(resp);
      if (resp.status === 'success') {
        /** checking response is array & has length & non empty 2D array */
        if (Array.isArray(resp.data) && resp.data.length === 0) {
          // alert('No data found');
          /** non empty array check */
          console.log('IS NON EMPTY ARRAY',resp?.data.some((innerArray:any) => innerArray.length == 0))

          this.messageService.add({severity:'info',summary:'No Data Found!'})
          this.loading = false;
        } else {
	// new
          if (this.selectedReportType === 'OT75') {
            this.exportexcel(resp)
          } else {
            this.exportexcel(resp.data);
          }
          console.log('IS NON EMPTY ARRAY',resp?.data.some((innerArray:any) => innerArray.length == 0))
          // console.log(resp);
          this.loading = false;
        }
      } else {
        // alert(resp.message);
        this.messageService.add({severity:'warn',summary:resp.message})
        this.loading = false;
      }
    },  
    error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.response})
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

  exportexcel(data:any) {
    console.log('EXCEL DATA:',data);
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      var wb = XLSX.utils.book_new();
      let type = this.reportType.filter((element: any) => element.code == this.selectedReportType);
      console.log(type[0].code);
      if (!type || type.length === 0) {
        console.error('Invalid report type selected');
        this.messageService.add({severity:'warn',summary:'Invalid report type selected'})
        return;
      }
  
      let sheets:any[] = [];
  
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
       // new
      const financeColumns = [
        'Work Type', 'FIN GROUP',
        '1000', '1150', '1200', '1250', '1300', '1500', '8005', '8010', 'Total'
      ];

        sheets = [
	      // { sheetName: 'Head Count Details', dataArray: data[0] },
        //{ sheetName: 'In-Direct Summary', dataArray: data[1] },
	      // new
        { sheetName: 'HC Details', dataArray: data[0] },
        { sheetName: 'Plant Working Days', dataArray: data[1] },
        { sheetName: 'HC Summary', dataArray: data[2] },
        { sheetName: 'HC Others', dataArray: data[3] },
        { sheetName: 'In-Direct HC Plan Vs Actual', dataArray: data[4] },
        { sheetName: 'RCC Format', dataArray: data[5] },
        {
          sheetName: 'Finance Format',
          dataArray: data[6].map((row:any) =>
            Object.fromEntries(financeColumns.map(col => [col, row[col]]))
          ),
          header: financeColumns   // 👈 Add this line
        }
      ];
      }
      // new
    // ✅ Special handling for OT75 throws type error
    else if (type[0].code === 'OT75') {
      sheets = [
        { sheetName: 'Paid OT More Than 75 Hrs', dataArray: data },
        { sheetName: 'Worked OT More Than 75 Hrs', dataArray: data }
      ];
    } 
    else {
      // fallback for single sheet reports
      var ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${type[0]?.name}-report.xlsx`);
      return;
    }
  
    if (sheets.length === 0) {
        console.error('No sheets defined for the selected report type');
        this.messageService.add({severity:'warn',summary:'No sheets defined for the selected report type'});
        return;
      }

      sheets.forEach((sheet:any, index:any) => {
        console.log(sheet.dataArray);
        
        if (sheet.dataArray && sheet.dataArray.length) { 
          // var ws = XLSX.utils.json_to_sheet(sheet.dataArray);
	  
	  // new
          // 👇 Use sheet.header when available to control order
        var ws = XLSX.utils.json_to_sheet(sheet.dataArray, {
          header: sheet.header || Object.keys(sheet.dataArray[0])
        });
          const headerRange = XLSX.utils.decode_range(ws['!ref']!);

          for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cellAddress]) continue;
            ws[cellAddress].s = {
              font: { bold: true, color: { rgb: "000000" } }, // Bold Black Text
              fill: { fgColor: { rgb: "2563eb" } }, // blue Background
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
          this.messageService.add({severity:'warn',summary:`Invalid data format for ${sheet.sheetName}.`})
          var ws = XLSX.utils.json_to_sheet(sheet.dataArray);
          XLSX.utils.book_append_sheet(wb, ws, `${sheet.sheetName}`);
        }
      });
  
      XLSX.writeFile(wb, `${type[0].name}-report.xlsx`);
      this.messageService.add({severity:'info',summary:'Data Downloaded!'})
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
        fill: { fgColor: { rgb: "2563eb" } }, // blue Background
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
      this.messageService.add({severity:'info',summary:'Data Downloaded!'})

    }
  }

   /**
     * reverse MAS report attednace data for excel sheet
     * @var priorityKeys keys to reverse response
     * @var reordered reverser attedance object using priorityKeys
     */

    reorderObjectKeys(obj:any) {
      const priorityKeys = [
        "cemp_id",
        "fullname",
        "gen_id",
        "dept_name",
        "Line_Name",
        "apprentice_type"
      ];

      const reordered:any = {};
      // First add priority keys in order
      for (const key of priorityKeys) {
        if (key in obj) {
          reordered[key] = obj[key];
        }
      }
      // Then add the rest of the keys
      for (const key of Object.keys(obj)) {
        if (!priorityKeys.includes(key)) {
          reordered[key] = obj[key];
        }
      }

      return reordered;
    }

    /**
     * re order MAS data[] reversed
     */
   reorderArray(arr:any) {
    return arr.map(this.reorderObjectKeys);
  }
}
