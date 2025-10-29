import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-excesshr-approve",
  templateUrl: "./excesshr-approve.component.html",
  styleUrls: ["./excesshr-approve.component.css"],
})
export class ExcesshrApproveComponent implements OnInit {
  data: any;
  filterDate: any;
  lines: any;
  selectedLine: any = "All";
  loading:any=false;
  max_hrs:any;
  all:any;
  userDetails:any;
  constructor(private apiService: ApiService, private messageService:MessageService) {}

  ngOnInit() {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getData();
    this.apiService.getlineBydept().subscribe((response: any) => {
      this.lines = response;
      this.lines.push({Line_Name:'All'})
      console.log(response);
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });
    this.apiService.getAllowedOtHours().subscribe((response:any)=>{
      if(response.status=='success'){
        this.max_hrs=response.data.day
      }else{
        // alert(respone.message)
        this.messageService.add({severity:'warn',summary:response.message})
      }
    },(error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })
  }

  getData() {
    this.apiService.getExcessHours().subscribe((response: any) => {
      if (response.status == "failed") {
        // alert(response.message);
        this.messageService.add({severity:'warn',summary:response.message})
      } else {
        console.log(response.data);
        this.data = response.data.map((element: any) => {
          return { ...element, approvedHr: null, reason: "" };
        });
        console.log(this.data );
        
      }
    },(error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  getMaxHours(type: any) {

    if (type === 'W' || type === 'N' || type === 'F') {
   
      return type.expect_othr; // 12 default value
    } else if (type === 'R') {

      return this.max_hrs;
    } else {
    
      return this.max_hrs;
    }
  }

  approve(item: any) {
    this.loading=true
    let data = {
      plant: sessionStorage.getItem("plantcode"),
      emp_id: item.cemp_id,
      date: item.att_date,
      hours: item.approvedHr,
      flag: "I", // default flag COFF || OT flag O
      approved_by: sessionStorage.getItem("user_name"),
      reason: item.reason,
      shift_id:item.shift,
      type:item.type
    };
    console.log(data);
    this.apiService.approveExcessHr(data).subscribe((response: any) => {
      this.getData();
      // alert(response.message);
      this.messageService.add({severity:'warn',summary:response.message})
      this.loading=false
    },(error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }




  exportexcel() {
    this.apiService.getExcessHours_Report().subscribe((response: any) => {
      if (response.status == "failed") {
        alert(response.message);
      } else {
        let sheetsData = response.data;
        let sheetNames = ["Trainee OT Summary", "Trainee OT Details", "Operator OT Summary", "Operator OT Details"];
  
        let wb = XLSX.utils.book_new();
  
        // Define header style
        const headerStyle = {
          font: { bold: true, color: { rgb: "000000" } }, // Black text
          fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
  
        sheetsData.forEach((data: any[], index: number) => {
          if (data.length > 0) {
            // Remove "apln_slno" from data
            let cleanedData = data.map(({ apln_slno, ...rest }) => rest);
  
            // Get headers and format them
            let headers = Object.keys(cleanedData[0]).map(header => header.replace(/_/g, " "));
  
            // Convert cleaned data to worksheet (start from A2, since headers will go in A1)
            let ws = XLSX.utils.json_to_sheet(data);

            // Add formatted headers at the top
            XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
  
            // Apply styles to header row
            headers.forEach((header, colIndex) => {
              const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // Row 0 (A1, B1, etc.)
              if (!ws[cellAddress]) ws[cellAddress] = {}; // Ensure cell exists
              ws[cellAddress].v = header; // Set formatted header text
              ws[cellAddress].s = headerStyle; // Apply styling
            });
  
            // Append worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, sheetNames[index]);
          }
        });
  
        // Write file and trigger download
        XLSX.writeFile(wb, "Excess_Hours_Report.xlsx");
        this.messageService.add({severity:'info',summary:'Data Exported!'})
      }
    });
  }
  

}