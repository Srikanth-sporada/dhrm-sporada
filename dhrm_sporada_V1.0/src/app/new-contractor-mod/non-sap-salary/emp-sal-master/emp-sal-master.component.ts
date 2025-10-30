import { Component, OnInit } from '@angular/core';
import moment from "moment";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import {ApiService} from 'src/app/home/api.service'
import { ClamAPIService } from '../../clam-api.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-emp-sal-master',
  templateUrl: './emp-sal-master.component.html',
  styleUrls: ['./emp-sal-master.component.css']
})
export class EmpSalMasterComponent implements OnInit {
  plant: any
  plantCode: any;
  isadmin: any;
  emp_Sal_List :any[]
  plantlist: any[];
  loading:any=false;
  userDetails:any;
  all:any;

  constructor(private api: ApiService ,private clApi: ClamAPIService,private messageService:MessageService){ }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    if (this.isadmin == "false") {
      this.plant = this.plantCode;
    }
   this.plant =this.plantCode
    this.api.getplantcode(this.plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
        this.plantlist.push({plant_name:'All',plant_code:''})
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      },
    });
  }

  getData() {
    this.loading = true;
    // alert(this.plant)
    this.clApi.getEmp_Sal_Master(this.plant).subscribe((res:any)=>{
   
   if(res.status === 'Failure' && res.data.length == 0){
    // alert('No data found');
    this.loading = false;
    this.messageService.add({severity:'info',summary:'No Data Found!'})
   }
   else if(res.status === 'Success' && res.data.length == 0 ){
    // alert('No data found');
    this.loading = false;
    this.messageService.add({severity:'info',summary:'No data found'})
   }
   else if(res.status === 'Success' && res.data.length > 0 ){
    this.exportExcel(res.data);
    // console.log(res);
    this.loading = false;
   }
   
    }, (error) => this.messageService.add({severity:'error',summary:error.message}))
  
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

  Object.keys(groupedData).forEach(conId => {
    const records = groupedData[conId];
    
    // Safely get the company name
    const companyName = records[0]?.Cont_company_name?.trim()?.substring(0, 30) || 'Unknown Company';
    console.log(companyName);

      // Exclude the specified keys
      const excludedKeys = ["Effective_Date1",'Cont_company_name,','Cont company name','apln_slno', "Con_Id", "Effective_Date", "Tot_Deduction", "Gross_Earnings", "Status", "PayScale_ID",'SC_Base'];
      const transformedArray = records.map((record: any) => {
        const transformedObj: any = {};
        Object.keys(record).forEach(key => {
          if (!excludedKeys.includes(key)) {
            const newKey = key.replace(/_/g, ' '); // Replace underscores with spaces
            transformedObj[newKey] = record[key] === 'NULL'  ? '' : record[key]; // Replace null values with empty strings
          }
        });
        return transformedObj;
      });

      // Create a worksheet and append it to the workbook
      const ws = XLSX.utils.json_to_sheet(transformedArray);

      // Apply styling to the header row
      const headerRange = XLSX.utils.decode_range(ws['!ref']!);
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          fill: { fgColor: { rgb: "FFFF00" } }, // Yellow color
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }

      // Add the worksheet to the workbook with the sheet name as Cont_company_name
      XLSX.utils.book_append_sheet(wb, ws, companyName);
    });

    XLSX.writeFile(wb, "Employee Payscale Master.xlsx");
    this.messageService.add({severity:'info',summary:'Data Exported!'})
  
}

// exportExcel(data: any[]): void {
//   const groupedData = data.reduce((acc: any, obj: any) => {
//     const conId = obj.Con_Id;
//     if (!acc[conId]) {
//       acc[conId] = [];
//     }
//     acc[conId].push(obj);
//     return acc;
//   }, {});

//   const wb = XLSX.utils.book_new();

//   Object.keys(groupedData).forEach(conId => {
//     const records = groupedData[conId];
//     const companyName = records[0].Cont_company_name.trim();

//     // Define headers
//     const headers = [
//       "FirstName",
//       "LastName",
//       "Email"
//     ];

//     // Set column widths
//     const colWidths = [
//       { wch: 30 },
//       { wch: 30 },
//       { wch: 50 }
//     ];

//     // Get the data
//     const userData = records;

//     // Early return if no data
//     if (!userData || !userData[0]) {
//       return null;
//     }

//     // Set header row height
//     const headerRowHeight = [{ hpt: 80 }];

//     // Dynamically set row height based on size of data
//     const dataRowHeight = Array.from({ length: userData[0].length }, () => ({ hpt: 30 }));

//     // Combine header row height and data row height
//     const rowHeight = [...headerRowHeight, ...dataRowHeight];

//     // Create a new worksheet
//     const worksheet = XLSX.utils.json_to_sheet([]);

//     // Assign widths to columns
//     worksheet['!cols'] = colWidths;

//     // Assign height to rows
//     worksheet['!rows'] = rowHeight;

//     // Enable auto-filter for columns
//     worksheet['!autofilter'] = { ref: `${companyName}!A1:C1` };

//     // Add the headers to the worksheet
//     XLSX.utils.sheet_add_aoa(worksheet, [headers]);

//     // Add data to sheet
//     XLSX.utils.sheet_add_json(worksheet, userData, {
//       skipHeader: true,
//       origin: -1
//     });

//     // Get size of sheet
//     const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "");
//     const rowCount = range.e.r;
//     const columnCount = range.e.c;

//     // Add formatting by looping through data in sheet
//     for (let row = 0; row <= rowCount; row++) {
//       for (let col = 0; col <= columnCount; col++) {
//         const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
    
//         // Check if the cell exists before accessing its properties
//         if (worksheet[cellRef]) {
//           worksheet[cellRef].s = {
//             alignment: {
//               horizontal: "left",
//               wrapText: true,
//             },
//           };
    
//           // Vertical header - 1st column only
//           if (row === 0 && col === 0) {
//             worksheet[cellRef].s = {
//               ...worksheet[cellRef].s,
//               alignment: {
//                 horizontal: "center",
//                 vertical: "center",
//                 wrapText: false,
//                 textRotation: 180,
//               },
//             };
//           }
    
//           // Format headers bold
//           if (row === 0) {
//             worksheet[cellRef].s = {
//               ...worksheet[cellRef].s,
//               font: { bold: true },
//             };
//           }
//         } else {
//           console.warn(`Cell ${cellRef} does not exist`);
//         }
//       }
//     }

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(wb, worksheet, companyName);

//   });

//   // Write the workbook to a file
//   XLSX.writeFile(wb, "Mst_payscale.xlsx");
// }

}
