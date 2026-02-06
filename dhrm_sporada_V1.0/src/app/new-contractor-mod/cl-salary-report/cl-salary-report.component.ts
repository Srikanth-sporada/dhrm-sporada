import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { ClamAPIService } from "src/app/new-contractor-mod/clam-api.service";
import moment from "moment";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-cl-salary-report",
  templateUrl: "./cl-salary-report.component.html",
  styleUrls: ["./cl-salary-report.component.css"],
})
export class CLSalaryReportComponent implements OnInit {
  from: any = "";
  to: any = "";
  selectedContractor: any = "";
  plant: any;
  min: any;
  max: any;
  fromMax: any;
  plantlist: any[];
  isadmin: any;
  selectedReportType: any;
  employeeType: any = "T";
  monthReport: any[] = ["OTMSAL", "PRSAL"];
  yearReport: any[] = ["Optr_LB", "P2"];
  ContractReport: any[] = ["PRSAL", "CTSAL"];
  Con_list: any;
  plant_Code: any = sessionStorage.getItem("plantcode");
  filterReportTypr: any[];
  userDetails: any;
  all: any;
  reportType: any = [
    {
      name: "One Time Earnings & Deduction Salary Report",
      code: "OTMSAL",
      days: 365,
      plant: "All",
    },
    {
      name: "Previous Payroll Salary Report",
      code: "PRSAL",
      days: 365,
      plant: "All",
    },
    {
      name: "Current  Payroll Salary Report",
      code: "CTSAL",
      days: 365,
      plant: "All",
    },
  ];

  loading: any = false;

  constructor(
    private api: ApiService,
    private clApi: ClamAPIService,
    private messageService: MessageService,
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
    this.from = moment(new Date()).format("YYYY-MM-DD");
    this.to = moment(new Date()).format("YYYY-MM-DD");
    this.fromMax = moment(new Date()).format("YYYY-MM-DD");
    this.plant = "";
    this.selectedReportType = "mr";
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    /** get contractors */
    this.getContra();

    if (this.isadmin == "false") {
      this.plant = plantCode;
    }
     this.api.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
        this.plantlist.unshift({ plant_name: "All", plant_code: "" });
      },
      error: (error) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
    /** get plant code */
    this.getPlant(this.plant);
  }

  /**
   * get plants
   * @param plantCode
   * */
  getPlant(plantCode: any) {
   
  }
  /** get contractors */
  getContra() {
    this.clApi.getContractor().subscribe(
      (res) => {
        this.Con_list = res;
        // console.log(res)
        this.Con_list = this.Con_list.filter(
          (item: any) =>
            item.Plant_code == this.plant_Code && item.Status === true,
        );
      },
      (error) => {
        console.log(error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    );
  }

  getData() {
    this.loading = true;
    let from: string;
    let to: string;
    if (this.monthReport.includes(this.selectedReportType)) {
      const selectedMonth: any = moment(this.from).format("MM");
      const selectedYear: any = moment(this.from).format("yy");
      console.log(selectedMonth, selectedYear);
      const selectedMonthInWords = moment()
        .month(selectedMonth - 1)
        .format("MMMM");

      // Set from date to 26th of previous month
      let prevMonth = selectedMonth - 1;
      let prevMonthYear = selectedYear;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevMonthYear--;
      }
      /**  selected month prev month caculation */
      this.from = `${prevMonthYear}-${prevMonth.toString().padStart(2, "0")}-26`;
      /** Set to date to 25th of selected month */
      this.to = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-25`;
      console.log("Updated date range:", this.from, "to", this.to);
    } else if (this.selectedReportType == "CTSAL") {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      console.log("currentMonth", currentMonth);
      /** Set from date to 26th of previous month */
      let prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      let prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      this.from = `${prevMonthYear}-${(prevMonth + 1).toString().padStart(2, "0")}-26`;
      /** Set to date to 25th of current month */
      this.to = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-25`;
      console.log("Updated date range for CTSAL:", this.from, "to", this.to);
    } else {
      // If selectedReportType is not in monthReport, use the selected dates
      from = this.from;
      to = this.to;
    }

    let data = {
      from: "2026-01-01",
      to: "2026-01-31",
      type: this.selectedReportType,
      plant: this.plant,
      cont: this.selectedContractor,
    };

    console.log(data);
    this.clApi.clSalReports(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.status === "success") {
        if (Array.isArray(resp.data) && resp.data.length === 0) {
          // alert('No data found');
          this.messageService.add({
            severity: "info",
            summary: "No Data Found!",
          });
          this.loading = false;
        } else if (
          Array.isArray(resp.data) &&
          resp.data[0].length === 0 &&
          resp.data[1].length === 0
        ) {
          this.messageService.add({
            severity: "info",
            summary: "No Data Found!",
          });
          // alert('No data found');
          this.loading = false;
        } else {
          // this.export_excel(resp.data);
          this.export_excel_New(resp.data);
          console.log(resp);
          this.from = "";
          this.to = "";
          this.selectedReportType = "";
          this.selectedContractor = "";
          this.plant = sessionStorage.getItem("plantcode");
          this.loading = false;
        }
      } else {
        // alert(resp.message);
        this.messageService.add({ severity: "info", summary: resp.message });
        this.loading = false;
      }
    });
  }

  export_excel_New(data: any[]) {
    const type = this.reportType.find(
      (element: any) => element.code === this.selectedReportType,
    );

    if (type.code === "PRSAL" || type.code === "CTSAL") {
      const sheet1 = data[1];
      const sheet2 = data[0];

      const workbook = XLSX.utils.book_new();
      // Create worksheet for Payroll Summary
      const worksheet2 = XLSX.utils.json_to_sheet([]);

      // Add the labels for Plant, Contractor, Payroll Period
      const plantCode = this.plant || "All";
      const contractorName =
        this.Con_list.find(
          (element: any) => element.Con_Id === this.selectedContractor,
        )?.Cont_company_name || "All";
      const dateRange = `${this.from} - ${this.to}`;

      // Add labels and values to cells A2, A3, A4
      XLSX.utils.sheet_add_json(
        worksheet2,
        [
          { A: "Plant", B: plantCode },
          { A: "Contractor", B: contractorName },
          { A: "Payroll Period", B: dateRange },
        ],
        { header: ["A", "B"], skipHeader: true, origin: "A2" },
      );

      // Style for labels in A2, A3, A4 (bold and light green background)
      const labelStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "C6EFCE" } }, // Light green background
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      ["A2", "A3", "A4", "B2", "B3", "B4"].forEach((cell) => {
        worksheet2[cell].s = labelStyle;
      });

      // Header mapping
      const headerSheet1: { [key: string]: string } = {
        PayScale_Name: "Payscale Name",
        Total_Paid_Days: "Total Paid Days",
        Sum_of_Total_Earnings: "Sum of Total Earnings",
        Sum_of_Deductions: "Sum of Total Deduction",
        Sum_of_Total_Bill_Value: "Sum of Total Bill Value",
        Sum_of_Tax_Value: "Sum of Service Tax Value",
        Sum_of_Paid_To_Contractor: "Sum of Paid to Contractor",
      };

      // Map the sheet1 data with header mappings
      const mappedData = sheet1.map((row: any) => {
        const newRow: any = {};
        Object.keys(row).forEach((key) => {
          newRow[headerSheet1[key] || key] = row[key]; // Use mapped header or fallback to original key
        });
        return newRow;
      });

      // Add table headers and data starting from A6
      XLSX.utils.sheet_add_json(worksheet2, mappedData, {
        header: Object.values(headerSheet1),
        origin: "A6",
      });

      // Style for the table headers (A6)
      const S_headerStyle = {
        font: { bold: true, color: { rgb: "ffffff" } },
        fill: { fgColor: { rgb: "76933C" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      const headers = Object.values(headerSheet1);
      headers.forEach((header, index) => {
        const cellAddress = XLSX.utils.encode_cell({ c: index, r: 5 }); // Headers are on the 6th row (r: 5)
        if (worksheet2[cellAddress]) {
          worksheet2[cellAddress].s = S_headerStyle;
        }
      });

      const totalStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "ffffff" } }, // Highlighted red-orange fill
        alignment: { horizontal: "right", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      const lastRowNumber = sheet1.length + 5;
      headers.forEach((header, index) => {
        const cellAddress = XLSX.utils.encode_cell({
          c: index,
          r: lastRowNumber,
        });
        if (worksheet2[cellAddress]) {
          worksheet2[cellAddress].s = totalStyle;
        }
      });

      const colWidths = [
        { wch: 30 }, // Payscale Name
        { wch: 30 }, //Total_Paid_Days
        { wch: 25 }, // Sum of Total Earnings
        { wch: 25 }, // Sum of Total Deduction
        { wch: 25 }, // Sum of Total Bill Value
        { wch: 25 }, // Sum of Service Tax Value
        { wch: 25 }, // Sum of Paid to Contractor
      ];

      worksheet2["!cols"] = colWidths;

      const commaStyle = {
        numFmt: "#,##0.00",
      };

      const commaColumns = ["B", "C", "D", "E", "F"];
      for (let r = 6; r <= lastRowNumber; r++) {
        commaColumns.forEach((col) => {
          const cellAddress = `${col}${r}`;
          if (worksheet2[cellAddress]) {
            worksheet2[cellAddress].s = {
              ...(worksheet2[cellAddress].s || {}),
              ...commaStyle,
            };
          }
        });
      }

      /// ==================Sheet 2===============================

      const headerMapping: { [key: string]: string } = {
        Plant: "Plant",
        Contractor_Name: "Contractor",
        PayScale_Name: "Pay Scale",
        // apln_slno: "Application Serial No",
        Gen_Id: "Gen ID",
        emp_Name: "Name",
        Category: "Category",
        Department: "Department",
        Line: "Line",
        Work_Type: "Work Type",
        DOJ: "DOJ",
        DOL: "DOL",
        Stipend: "Stipend",
        Basic: "Basic ",
        Da: "DA",
        HRA: "HRA",
        Leave_Salary: "Leave Salary",

        Washing_allow: "Washing Allowance",
        Monthly_Bonus: "Monthly Bonus",
        Sat_and_Mon_Incentive: "Sat-Mon Inc.",
        Monthly_Attn_Incentive: "Attn Inc",
        Spl_allow: "Special Allowance",
        Night_shift_allowance: "NS Allowance",
        Skilled_allow_P3: "Skilled Allowance",
        Amenities_Allow: "Amenities Allowance",
        Other_allowance_1: "Other Allowance 1",
        Other_allowance_2: "Other Allowance 2",
        Other_allowance_3: "Other Allowance 3",
        Other_allowance_4: "Other Allowance 4",
        Arrears: "Arrears",
        Bonus: "Bonus",
        Other_Earnings: "Other Earnings",
        Retention_Incentive: "Retention Incentive",
        Canteen: "Canteen",
        Professional_Tax: "Professional Tax",
        Transport: "Transport",
        WC_Policy: "WC Policy",
        Insurance: "Insurance",
        Other_deduction_1: "Other Deduction 1",
        Other_deduction_2: "Other Deduction 2",
        Other_deduction_3: "Other Deduction 3",
        Other_deduction_4: "Other Deduction 4",
        LWF: "LWF",
        "Shoe/Goggles": "Shoe/Goggles",
        Other_Deductions: "Other Deductions",
        "Uniform/Coat/T-Shirt": "Uniform/Coat/T-Shirt",
        Service_Charge_Fixed: "SC-Fixed",
        Service_charges_Percentage: "SC-%",
        // SC_Base: "SC Base",
        NSDC_Contribution: "NSDC Contribution",
        Uniform_Charges: "Uniform charges ",
        Labour_Welfare_Fund: "LWF",
        Insurance_Premium: "Insurance",
        Learning_Fees: "Learning fees",
        Workmen_Compensation: "Workmen compensation",
        Emp_Comp_Ins: "Emp. Comp Ins",
        Higher_Education_Fee: "Higher Education fee",
        Calender_Days: "CD",
        Working_Days: "WD",
        Emp_Working_day: "EMP_WD",
        Sundays: "SUN",
        Holidays: "HD",
        Present_Days: "Present Days",
        Absent_Days: "LOP",
        Eligible_Sunday: "WO",
        Paid_Days: "PD",
        OT_Hrs_Double: "2-OT",
        OT_Hrs_Trible: "3-OT",
        Night_SHift_Count: "NS",
        Worked_Sat_Mon: "Worked Sat & Mon",
        Canteen_Deduction_Days: "Canteen Days",
        Transport_Deduction_Days: "Transport Days",
        Stipend_Pay: "Er.Stipend",
        Basic_Pay: "Er.Basic",
        DA_Pay: "Er.DA",
        HRA_Pay: "Er.HRA ",
        Double_OT_Pay: "Er.Double OT",
        Triple_OT_Pay: "Er.Trible OT ",
        Leave_Salary_Pay: "Er.Leave Salary",
        Washing_Allowance_Pay: "Er.Washing Allowance",
        Monthly_Bonus_Pay: "Er.Monthly Bonus",
        Sat_and_Mon_Incentive_Pay: "Er.Sat & Mon Inc",
        Monthly_Attn_Incentive_Pay: "Er.Attendance Inc",
        Special_Allowance_Pay: "Er.Special Allowance",
        Night_Shift_Pay: "Er.Night Shift Allowance",
        Skilled_Allowance_Pay: "Er.Skilled Allowance",
        Amenities_Allowance_Pay: "Er.Amenities Allowance",
        Other_Allowance_1_Pay: "Er.Other Allowance 1",
        Other_Allowance_2_Pay: "Er.Other Allowance 2",
        Other_Allowance_3_Pay: "Er.Other Allowance 3",
        Other_Allowance_4_Pay: "Er.Other Allowance 4",
        Arrears_Pay: "Er.Arrears",
        Bonus_Pay: "Er.Bonus",
        Other_Earnings_Pay: "Er.Other Earnings",
        Retention_Incentive_Pay: "Er.Retention Incentive",
        Total_Earnings_Pay: "Total Earnings",
        Canteen_Pay: "Canteen Ded",
        Professional_Tax_Pay: "P.Tax Ded",
        Transport_Pay: "Transport Ded",
        WC_Policy_deduction_Pay: "WC Policy Deduction Ded",
        Insurance_Pay: "Insurance Ded",
        Other_Deduction_1_Pay: "Other Deduction 1 Ded",
        Other_Deduction_2_Pay: "Other Deduction 2 Ded",
        Other_Deduction_3_Pay: "Other Deduction 3 Ded",
        Other_Deduction_4_Pay: "Other Deduction 4 Ded",
        LWF_Pay: "LWF Ded",
        "Shoe/Goggles_Pay": "Shoe/Goggles Ded",
        Other_Deductions_Pay: "Other Deductions Ded",
        "Uniform/Coat/T-Shirt_Pay": "Uniform/Coat/T-Shirt Ded",
        Employee_PF_Pay: "Employee PF Ded(ref)",
        Employee_ESI_Pay: "Employee ESI Ded(ref)",
        Total_Deductions_Pay: "Total Deductions",
        Net_Take_Home_Pay: "Net Take Home",
        NSDC_Contribution_Pay: "C.NSDC Contribution",
        Labour_Welfare_Fund_Pay: "C.Labour Welfare Fund",
        Uniform_Charges_Pay: "C.Uniform Charges",
        Workmen_Compensation_Pay: "C.Workmen Compensation",
        Insurance_Premium_Pay: "C.Insurance Premium",
        Learning_Fees_Pay: "C.Learning Fee",
        Emp_Comp_Ins_Pay: "C.Emp Comp Ins",
        Higher_Education_Fee_Pay: "C.Higher Education Fee",
        Employer_PF_Pay: "C.Employer PF",
        Employer_ESI_Pay: "C.Employer ESI",
        Servive_Charge_Pay: "C.Service Charge",
        Total_Contractor_Pay: "Total Contractor",

        ToTal_Base_Value_Pay: "Total Value For S.Tax",
        Service_Tax_Val_Pay: "Service Tax - GST",
        Paid_To_Contractor: "Paid To Contractor",
      };

      const colorMapping: { [key: string]: string } = {
        Plant: "DCE6f1",
        Contractor_Name: "DCE6f1",
        PayScale_Name: "DCE6f1",
        Gen_Id: "DCE6f1",
        emp_Name: "DCE6f1",
        Category: "DCE6f1",
        Department: "DCE6f1",
        Line: "DCE6f1",
        Work_Type: "DCE6f1",
        DOJ: "DCE6F1",
        DOL: "DCE6F1",

        Stipend: "8DB4E2",
        Basic: "8DB4E2",
        Da: "8DB4E2",
        HRA: "8DB4E2",
        Leave_Salary: "8DB4E2",

        Washing_allow: "8DB4E2",
        Monthly_Bonus: "8DB4E2",
        Sat_and_Mon_Incentive: "8DB4E2",
        Monthly_Attn_Incentive: "8DB4E2",
        Spl_allow: "8DB4E2",
        Night_shift_allowance: "8DB4E2",
        Skilled_allow_P3: "8DB4E2",
        Amenities_Allow: "8DB4E2",
        Other_allowance_1: "8DB4E2",
        Other_allowance_2: "8DB4E2",
        Other_allowance_3: "8DB4E2",
        Other_allowance_4: "8DB4E2",
        Arrears: "8DB4E2",
        Bonus: "8DB4E2",
        Other_Earnings: "8DB4E2",
        Retention_Incentive: "8DB4E2",
        Canteen: "8DB4E2",
        Professional_Tax: "8DB4E2",
        Transport: "8DB4E2",
        WC_Policy: "8DB4E2",
        Insurance: "8DB4E2",
        Other_deduction_1: "8DB4E2",
        Other_deduction_2: "8DB4E2",
        Other_deduction_3: "8DB4E2",
        Other_deduction_4: "8DB4E2",
        LWF: "8DB4E2",
        "Shoe/Goggles": "8DB4E2",
        Other_Deductions: "8DB4E2",
        "Uniform/Coat/T-Shirt": "8DB4E2",
        Service_Charge_Fixed: "8DB4E2",
        Service_charges_Percentage: "8DB4E2",
        NSDC_Contribution: "8DB4E2",
        Uniform_Charges: "8DB4E2",
        Labour_Welfare_Fund: "8DB4E2",
        Insurance_Premium: "8DB4E2",
        Learning_Fees: "8DB4E2",
        Workmen_Compensation: "8DB4E2",
        Emp_Comp_Ins: "8DB4E2",
        Higher_Education_Fee: "8DB4E2",

        Calender_Days: "F79646",
        Working_Days: "F79646",
        Emp_Working_day: "F79646",
        Sundays: "F79646",
        Holidays: "F79646",
        Present_Days: "F79646",
        Paid_Days: "F79646",
        Eligible_Sunday: "F79646",
        Absent_Days: "F79646",
        OT_Hrs_Double: "F79646",
        OT_Hrs_Trible: "F79646",
        Night_SHift_Count: "F79646",
        No_Sat_Mon: "F79646",
        Worked_Sat_Mon: "F79646",
        Canteen_Deduction_Days: "F79646",
        Transport_Deduction_Days: "F79646",
        Stipend_Pay: "92D050",
        Basic_Pay: "92D050",
        DA_Pay: "92D050",
        HRA_Pay: "92D050",
        Double_OT_Pay: "92D050",
        Triple_OT_Pay: "92D050",
        Leave_Salary_Pay: "92D050",
        Washing_Allowance_Pay: "92D050",
        Monthly_Bonus_Pay: "92D050",
        Sat_and_Mon_Incentive_Pay: "92D050",
        Monthly_Attn_Incentive_Pay: "92D050",
        Special_Allowance_Pay: "92D050",
        Night_Shift_Pay: "92D050",
        Skilled_Allowance_Pay: "92D050",
        Amenities_Allowance_Pay: "92D050",
        Other_Allowance_1_Pay: "92D050",
        Other_Allowance_2_Pay: "92D050",
        Other_Allowance_3_Pay: "92D050",
        Other_Allowance_4_Pay: "92D050",
        Arrears_Pay: "92D050",
        Bonus_Pay: "92D050",
        Other_Earnings_Pay: "92D050",
        Retention_Incentive_Pay: "92D050",
        Total_Earnings_Pay: "92D050",

        Canteen_Pay: "FF8181",
        Professional_Tax_Pay: "FF8181",
        Transport_Pay: "FF8181",
        WC_Policy_deduction_Pay: "FF8181",
        Insurance_Pay: "FF8181",
        Other_Deduction_1_Pay: "FF8181",
        Other_Deduction_2_Pay: "FF8181",
        Other_Deduction_3_Pay: "FF8181",
        Other_Deduction_4_Pay: "FF8181",
        LWF_Pay: "FF8181",
        "Shoe/Goggles_Pay": "FF8181",
        Other_Deductions_Pay: "FF8181",
        "Uniform/Coat/T-Shirt_Pay": "FF8181",
        Employee_PF_Pay: "FF8181",
        Employee_ESI_Pay: "FF8181",
        Total_Deductions_Pay: "FF8181",

        NSDC_Contribution_Pay: "E6B8B7",
        Labour_Welfare_Fund_Pay: "E6B8B7",
        Uniform_Charges_Pay: "E6B8B7",
        Workmen_Compensation_Pay: "E6B8B7",
        Insurance_Premium_Pay: "E6B8B7",
        Learning_Fees_Pay: "E6B8B7",
        Emp_Comp_Ins_Pay: "E6B8B7",
        Higher_Education_Fee_Pay: "E6B8B7",
        Employer_PF_Pay: "E6B8B7",
        Employer_ESI_Pay: "E6B8B7",
        Servive_Charge_Pay: "E6B8B7",
        Total_Contractor_Pay: "E6B8B7",

        Net_Take_Home_Pay: "D8E4B7",

        ToTal_Base_Value_Pay: "B1A0C7",
        Service_Tax_Val_Pay: "92CDDC",
        Paid_To_Contractor: "92D050",
      };

      const existingColumns = Object.keys(headerMapping).filter((key) =>
        sheet2[0].hasOwnProperty(key),
      );

      const formattedData = sheet2.map((row: any) => {
        const mappedRow: { [key: string]: any } = {};
        existingColumns.forEach((key) => {
          mappedRow[headerMapping[key]] = row[key] || "0"; // Default to '0' if no value
        });
        return mappedRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData, {
        header: existingColumns.map((key) => headerMapping[key]),
      });

      const headerStyle = {
        font: { bold: true, color: { rgb: "ffffff" } },
        fill: { fgColor: { rgb: "404040" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      existingColumns.forEach((key, index) => {
        const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = headerStyle;
        }
      });

      const numericColumns = [
        "Stipend_Pay",
        "Basic_Pay",
        "DA_Pay",
        "HRA_Pay",
        "Double_OT_Pay",
        "Triple_OT_Pay",
        "Leave_Salary_Pay",
        "Washing_Allowance_Pay",
        "Monthly_Bonus_Pay",
        "Sat_and_Mon_Incentive_Pay",
        "Monthly_Attn_Incentive_Pay",
        "Special_Allowance_Pay",
        "Night_Shift_Pay",
        "Skilled_Allowance_Pay",
        "Amenities_Allowance_Pay",
        "Other_Allowance_1_Pay",
        "Other_Allowance_2_Pay",
        "Other_Allowance_3_Pay",
        "Other_Allowance_4_Pay",
        "Arrears_Pay",
        "Bonus_Pay",
        "Other_Earnings_Pay",
        "Retention_Incentive_Pay",
        "Total_Earnings_Pay",
        "Canteen_Pay",
        "Professional_Tax_Pay",
        "Transport_Pay",
        "WC_Policy_deduction_Pay",
        "Insurance_Pay",
        "Other_Deduction_1_Pay",
        "Other_Deduction_2_Pay",
        "Other_Deduction_3_Pay",
        "Other_Deduction_4_Pay",
        "LWF_Pay",
        "Shoe/Goggles_Pay",
        "Other_Deductions_Pay",
        "Uniform/Coat/T-Shirt_Pay",
        "Employee_PF_Pay",
        "Employee_ESI_Pay",
        "Total_Deductions_Pay",
        "Net_Take_Home_Pay",
        "NSDC_Contribution_Pay",
        "Labour_Welfare_Fund_Pay",
        "Uniform_Charges_Pay",
        "Workmen_Compensation_Pay",
        "Insurance_Premium_Pay",
        "Learning_Fees_Pay",
        "Emp_Comp_Ins_Pay",
        "Higher_Education_Fee_Pay",
        "Employer_PF_Pay",
        "Employer_ESI_Pay",
        "Servive_Charge_Pay",
        "Total_Contractor_Pay",
        "ToTal_Base_Value_Pay",
        "Service_Tax_Val_Pay",
        "Paid_To_Contractor",
      ];

      formattedData.forEach((row: any, rowIndex: any) => {
        existingColumns.forEach((key, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            c: colIndex,
            r: rowIndex + 1,
          });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
              font: { color: { rgb: "000000" } },
              fill: { fgColor: { rgb: colorMapping[key] || "FFFFFF" } },
              alignment: {
                horizontal: numericColumns.includes(key) ? "right" : "left",
                vertical: "center",
              },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
            };
            if (numericColumns.includes(key)) {
              worksheet[cellAddress].z = "#,##0.00"; // Apply comma style
            }
          }
        });
      });

      // Apply center alignment and bold text for specific columns
      const centerBoldColumns = [
        "Calender_Days",
        "Working_Days",
        "Sundays",
        "Holidays",
        "Paid_Days",
        "Absent_Days",
        "Present_Days",
        "Eligible_Sunday",
        "Emp_Working_day",
        "OT_Hrs_Double",
        "OT_Hrs_Trible",
        "Night_SHift_Count",
        "Worked_Sat_Mon",
        "Canteen_Deduction_Days",
        "Transport_Deduction_Days",
      ];

      centerBoldColumns.forEach((column) => {
        const columnIndex = existingColumns.indexOf(column);
        if (columnIndex !== -1) {
          formattedData.forEach((row: any, rowIndex: any) => {
            const cellAddress = XLSX.utils.encode_cell({
              c: columnIndex,
              r: rowIndex + 1,
            });
            if (worksheet[cellAddress]) {
              worksheet[cellAddress].s.font = { bold: true };
              worksheet[cellAddress].s.alignment = {
                horizontal: "center",
                vertical: "center",
              };
            }
          });
        }
      });

      const columnWidths = existingColumns.map((key) => {
        const maxLength = Math.max(
          headerMapping[key].length,
          ...sheet2.map((row: any) =>
            row[key] ? row[key].toString().length : 0,
          ),
        );
        return { wpx: Math.min(maxLength * 10, 500) }; // Limit max width to 500px
      });

      worksheet["!cols"] = columnWidths;

      // Append Payroll Summary sheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet2, "Payroll Summary");
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll BreakUp");

      const selectedMonth = parseInt(this.from.split("-")[1]);
      const selectedYear = parseInt(this.from.split("-")[0]);

      const selectedMonthInWords = moment().month(selectedMonth).format("MMMM");

      // Write the Excel file
      XLSX.writeFile(
        workbook,
        `${contractorName}- ${selectedMonthInWords}-${selectedYear} Payroll Report.xlsx`,
      );
    } else if (type.code === "OTMSAL") {
      const type1 =
        this.reportType.find(
          (element: any) => element.code === this.selectedReportType,
        )?.name || "";
      const contractorName =
        this.Con_list.find(
          (element: any) => element.Con_Id === this.selectedContractor,
        )?.Cont_company_name || "All";

      console.log(type1);

      const wb = XLSX.utils.book_new(); // Create a new workbook
      const ws = XLSX.utils.json_to_sheet(data); // Convert JSON data to sheet
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      // Style the headers (if needed)
      const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "FFFFAA00" } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      // Apply the styles to the headers
      Object.keys(data).forEach((key, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
        if (!ws[cellRef]) {
          ws[cellRef] = { v: key };
        }
        ws[cellRef].s = headerStyle; // Apply header style
      });

      // Add the worksheet to the workbook

      // Export the Excel file
      XLSX.writeFile(wb, `${type1}.xlsx`);
      this.messageService.add({ severity: "info", summary: "Data Exported!" });
    }
  }
  datechnage() {}
}
