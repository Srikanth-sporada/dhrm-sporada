import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { ClamAPIService } from "src/app/new-contractor-mod/clam-api.service";
import { ToastComponent } from "src/app/new-contractor-mod/toast/toast.component";
import { MatDialog } from "@angular/material/dialog";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";

@Component({
  selector: "app-skill-matrix-report",
  templateUrl: "./skill-matrix-report.component.html",
  styleUrls: ["./skill-matrix-report.component.css"],
})
export class SkillMatrixReportComponent implements OnInit {
  plant_Code: any = sessionStorage.getItem("plantcode");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  button1: boolean = false;
  departments: any;
  form: any;
  plant: any;
  ALL = "Select Department";
  all: any;
  userDetails: any;
  constructor(
    private fb: UntypedFormBuilder,
    private api: ClamAPIService,
    private dialog: MatDialog,
    private service: ApiService,
    private messageService: MessageService,
    public loader:LoaderserviceService,
  ) {
    this.form = this.fb.group({
      department: [this.ALL, Validators.required],
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
    this.plant = sessionStorage.getItem("plantcode");
    /** get department for report */
    this.getDepartment();
  }

  /** get department API */
  getDepartment(){
     if (this.plant) {
      this.service.getDeptForReport(this.plant).subscribe({
        next: (res: any) => {
          this.departments = res.data;
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        },
      });
    }
  }

  /**
   * open toast modal
   * @param message 
   * @param icon 
   */
  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
      },
    });
  }

  /** 
   * download report
   * @property {*} ALL
   */
  download() {
    const selectedDept = this.form.get("department")?.value;

    if (selectedDept === this.ALL) {
      // alert('Please select a department');
      this.messageService.add({
        severity: "warn",
        summary: "Please Select Department!",
      });
      return;
    }

    /** check if department is selected */
    if (selectedDept) {
      this.service.getMatrixReport(selectedDept, this.plant).subscribe({
        next: (res: any) => {
          console.log("REPORT DATA:", res);
          if (!res.data) {
            // this.openAlertDialog('No Data Found !', 'warning');
            this.messageService.add({
              severity: "info",
              summary: "Data Not Found!",
            });
            /** set to default  */
            this.form.reset({
              department: this.ALL,
            });
          } else {
            /** data export fn */
            this.exportToExcel(res.data, res.summary, res.Dept[0].dept_name);
            this.form.reset({
              department: this.ALL,
            });
          }
        },
        error: (error) => {
          console.error('ERROR:',error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        },
      });
    }
    else{
      this.messageService.add({severity:'warn',summary:'Select Department!'})
    }
    console.log("Selected department ID:", selectedDept);
  }

  /** 
   * export data to excel
   * @param data
   * @param summary
   * @param dep
   */
  exportToExcel(data: any[], summary: any[], dep: string) {
    const headerText = "Skill Matrix Report";
    const summaryHeader = "Skill Matrix Summary";

    // Create worksheets
    const dataWs: XLSX.WorkSheet | any = XLSX.utils.json_to_sheet(data);
    const summaryWs: XLSX.WorkSheet | any = XLSX.utils.json_to_sheet(summary);

    // Define ranges
    const dataRange = XLSX.utils.decode_range(dataWs["!ref"]);
    const summaryRange = XLSX.utils.decode_range(summaryWs["!ref"]);

    // Adjust rows for summary sheet
    const rowsToAdd = 2;
    for (let R = summaryRange.e.r; R >= 0; --R) {
      for (let C = summaryRange.s.c; C <= summaryRange.e.c; ++C) {
        const from = XLSX.utils.encode_cell({ r: R, c: C });
        const to = XLSX.utils.encode_cell({ r: R + rowsToAdd, c: C });
        if (summaryWs[from]) {
          summaryWs[to] = summaryWs[from];
          delete summaryWs[from];
        }
      }
    }

    // Header Row
    summaryWs["A1"] = {
      t: "s",
      v: summaryHeader,
      s: {
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "00094B" } },
      },
    };

    // Merge header cells
    summaryWs["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: summaryRange.e.c },
      },
    ];

    // Department Row
    summaryWs["A2"] = {
      t: "s",
      v: "Dept : " + dep,
      s: {
        alignment: { horizontal: "left", vertical: "center" },
        font: { bold: true, sz: 12, color: { rgb: "black" } },
        fill: { fgColor: { rgb: "02ccfe" } },
      },
    };

    // Merge department cells
    summaryWs["!merges"].push({
      s: { r: 1, c: 0 },
      e: { r: 1, c: summaryRange.e.c },
    });

    // Header Row Styling
    for (let C = 0; C <= summaryRange.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: 2, c: C });
      const cell = summaryWs[addr];
      if (cell) {
        cell.s = {
          font: { color: { rgb: "FFFFFF" }, bold: true },
          fill: { fgColor: { rgb: "494848" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // Data Cells Styling
    for (let R = 3; R <= summaryRange.e.r + 2; ++R) {
      for (let C = 0; C <= summaryRange.e.c; ++C) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = summaryWs[addr];
        if (cell) {
          cell.s = {
            ...(cell.s || {}),
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }
    }

    // Update worksheet range
    summaryWs["!ref"] =
      `A1:${XLSX.utils.encode_cell({ r: summaryRange.e.r + 3, c: summaryRange.e.c })}`;

    // ---------------------- DATA SHEET ----------------------

    const ws: XLSX.WorkSheet = {};

    // Title Row
    ws["A1"] = {
      t: "s",
      v: headerText,
      s: {
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "00094B" } },
      },
    };

    // Merge title cells
    ws["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: dataRange.e.c },
      },
    ];

    // Skill Level Colors
    const levelColors: { [key: string]: string } = {
      L1: "ffcf00", // Yellow
      L2: "02ccfe", // Blue
      L3: "08ff08", // Green
      L4: "008000", // Dark Green
    };

    // Copy data with styling
    for (let R = dataRange.s.r; R <= dataRange.e.r; ++R) {
      for (let C = dataRange.s.c; C <= dataRange.e.c; ++C) {
        const from = XLSX.utils.encode_cell({ r: R, c: C });
        const to = XLSX.utils.encode_cell({ r: R + 1, c: C });

        const cellValue = dataWs[from]?.v;
        const cellColor = levelColors[cellValue];

        ws[to] = {
          ...dataWs[from],
          s: {
            ...(dataWs[from]?.s || {}),
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
            fill: cellColor ? { fgColor: { rgb: cellColor } } : undefined,
          },
        };
      }
    }

    // Header Row Styling (Row 2)
    for (let C = dataRange.s.c; C <= dataRange.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: 1, c: C });
      const cell = ws[addr];
      if (cell) {
        cell.s = {
          font: { color: { rgb: "FFFFFF" }, bold: true },
          fill: { fgColor: { rgb: "494848" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // Cell alignment from column G (6) and row 3+
    for (let R = 2; R <= dataRange.e.r + 1; ++R) {
      for (let C = 6; C <= dataRange.e.c; ++C) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[addr];
        if (cell) {
          cell.s = {
            ...(cell.s || {}),
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }
    }

    ws["!ref"] =
      `A1:${XLSX.utils.encode_cell({ r: dataRange.e.r + 1, c: dataRange.e.c })}`;

    // ---------------------- WORKBOOK ----------------------
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
    XLSX.utils.book_append_sheet(wb, ws, "Skill Matrix Report");
    XLSX.writeFile(wb, "Skill_Matrix_Report.xlsx");

    this.messageService.add({
      severity: "info",
      summary: "Report Downloaded!",
    });
  }

  clear() {
    this.form.reset({
      department: this.ALL,
    });
  }
}
