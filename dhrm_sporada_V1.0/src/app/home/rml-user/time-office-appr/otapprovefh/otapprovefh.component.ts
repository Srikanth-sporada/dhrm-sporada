import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { MatDialog } from "@angular/material/dialog";
import { CoffDetailsComponent } from "../coff-details/coff-details.component";
import { ExcessHoursDetailsComponent } from "../excess-hours-details/excess-hours-details.component";
import { elements } from "chart.js";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";

@Component({
  selector: "app-otapprove",
  templateUrl: "./otapprovefh.component.html",
  styleUrls: ["./otapprovefh.component.css"],
})
export class OtapproveComponent implements OnInit {
  data:any = []
  date: any;
  categories: any[];
  cat: any = "All";
  departmentList: any;
  selectedDept: any = "All";
  loading: any = false;

  constructor(
    private apiService: ApiService, 
    private matdailog: MatDialog, 
    private messageService:MessageService,
    public loader:LoaderserviceService) {

    }

  selectAll: any = false;
  all:any;
  userDetails:any;

  ngOnInit() {
    /** logged in user data */
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    /** get OT data */
    this.getData();
    /** get categories */
    this.getCategories();
    /** get department */
    this.getDepartment();
  }

  /** 
   * get categories
   * @property {*} categories
   */
  getCategories(){
     this.apiService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
        this.categories.unshift({categorynm:"All"})
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
     });
  }
  /** 
   * get department
   * @property {*} departmentList
   */
  getDepartment(){
    this.apiService.getDeptByPlant().subscribe({
      next: (data: any) => {
        this.departmentList = data;
        /* adding all for filter */
        this.departmentList.unshift({dept_slno:'',dept_name:'All'})
      },
      error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
    });
  }
  /**
   * get OT data
   * @property {*} data
   */
  getData() {
    this.apiService.getFhOt().subscribe({
      next: (response: any) => {
      if ((response.status = "success")) {
        console.log(response.data);
        this.data = response.data
          .map((element: any) => {
            return { ...element, selected: false };
          })
          .filter((element: any) => {
            return element.bal >= 0;
          });
        console.log('OT DATA:',response.data);
      } else if (response.status == "failed") {
        // alert(response.message);
        this.messageService.add({severity:'warn',summary:response.message})
      }
    },
    error:(error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    }
    });
  }

  /** 
   * approve OT
   * @var data api request body
   * */
  approve(item: any) {
    this.loading = true;
    console.log("trigger");
    let data = {
      data: [item],
      sup_id: sessionStorage.getItem("user_name"),
    };
    /** approve API */
    this.apiService.approveFhOt(data).subscribe({
      next: (res: any) => {
      if (res.status == "success") {
        this.getData();
        this.messageService.add({severity:'info',summary:res.message});
        this.loading = false;
      } else {
        this.messageService.add({severity:'warn',summary:res.message})
        this.getData();
        this.loading = false;
      }
    },
    error: (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    }
    });
  }

  /** 
   * aprrove selected OT
   * @var filtered_data selected OT data
   * @var data
   */
  submit() {
    this.loading = true;
    /** filter selected OT Data */
    let filtered_data = this.data.filter((element: any) => {
      return element.selected == true;
    });

    if (filtered_data.length == 0) {
      this.loading = false;
      // alert("Please select At least one OT request");
      this.messageService.add({severity:'warn',summary:'Please select At least one OT request'});
      return 
    }

    let data = {
      data: filtered_data,
      sup_id: sessionStorage.getItem("user_name"),
    };
    /** approve OT API */
    this.apiService.approveFhOt(data).subscribe((response: any) => {
      // alert(response.message);
      this.messageService.add({severity:'warn',summary:response.message})
      this.getData();
      this.selectAll = false;
      this.loading = false;
    },(error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  /**
   * @param item checked OT data
   * used to check select all check box
   * @property {*} data
   * @var count identity all data is checked
   */
  checkItems(item:any) {
    console.log('SELECTED DATA:',item);
    let count = 0;
    for (let element of this.data) {
      if (element.selected == true) {
        count++;
      }
    }
    if (count == this.data.length) {
      this.selectAll = true;
    }
    if (count < this.data.length) {
      this.selectAll = false;
    }
  }

  /**
   * handle select All
   * @property {boolean} selectAll
   */
  handelSelectAll() {
    if (this.selectAll) {
      if (this.cat != "" && this.selectedDept == "") {
        console.log(`cat filter`);
        this.data = this.data.map((element: any) => {
          if (element.apprentice_type == this.cat) {
            return { ...element, selected: true };
          } else {
            return { ...element, selected: false };
          }
        });
        console.log(
          this.data.filter((element: any) => {
            return element.selected;
          })
        );
        return;
      }

      if (this.selectedDept != "" && this.cat == "") {
        console.log(`dept filter`);
        this.data = this.data.map((element: any) => {
          if (element.dept_name == this.selectedDept) {
            return { ...element, selected: true };
          } else {
            return { ...element, selected: false };
          }
        });
        console.log(
          this.data.filter((element: any) => {
            return element.selected;
          })
        );
        return;
      }

      if (this.selectedDept != "" && this.cat != "") {
        console.log(`cat dept filter`);
        this.data = this.data.map((element: any) => {
          if (
            element.apprentice_type == this.cat &&
            element.dept_name == this.selectedDept
          ) {
            return { ...element, selected: true };
          } else {
            return { ...element, selected: false };
          }
        });
        console.log(
          this.data.filter((element: any) => {
            return element.selected;
          })
        );
        return;

      }

      this.data = this.data.map((element: any) => {
        return { ...element, selected: true };
      });
      console.log(
        this.data.filter((element: any) => {
          return element.selected;
        })
      );
    } else {
      this.data = this.data.map((element: any) => {
        return { ...element, selected: false };
      });
      console.log(
        this.data.filter((element: any) => {
          return element.selected;
        })
      );
    }
  }

  /** open C-Off details component */
  openCoffDeatisl(data: any) {
    this.matdailog.open(CoffDetailsComponent, {
      data: data,
    });
  }

  /** 
   * open Excess Hours Details
   */
  openExcessHourDetais(data: any) {
    this.matdailog.open(ExcessHoursDetailsComponent, {
      data: data,
    });
  }

  /** 
   * clear all
   * @property {*} date
   * @property {*} cat
   * @property {*} selectedDept
   * @property {*} data
   */
  clear() {
    this.date = "";
    this.cat = "";
    this.selectedDept = "";
    this.data = this.data.map((element: any) => {
      return { ...element, selected: false };
    });
    this.selectAll = false;
  }

  filterChanged() {
    this.data = this.data.map((element: any) => {
      return { ...element, selected: false };
    });
    this.selectAll = false;
  }

// export to excel function
  exportexcel() {
    this.apiService.getExcessHours_Report().subscribe((response: any) => {
      if (response.status == "failed") {
        // alert(response.message);
        this.messageService.add({severity:'error',summary:response?.message})
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
