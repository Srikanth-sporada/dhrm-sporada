import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx";
import moment from "moment";
import { ClamAPIService } from "../clam-api.service";
import { LoaderserviceService } from "../../loaderservice.service";
import { ToastComponent } from "../toast/toast.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MessageService, MenuItem } from "primeng/api";
import { environment } from "src/environments/environment.prod";
import { Utility } from "src/app/utils/utils";
import { MatMenuTrigger } from "@angular/material/menu";
import { ConfirmationComponent } from "src/app/confirmation/confirmation.component";


@Component({
  selector: "app-bill-processed-date",
  templateUrl: "./bill-processed-date.component.html",
  styleUrls: ["./bill-processed-date.component.css"],
})
export class BillProcessedDateComponent implements OnInit {
  billForm: any;
  showHolidayForm = false;
  selectedMonth1: any;
  selectedPlant: any;
  payrollArea: any = [];
  selecetedPayrollArea: any = [];
  isadmin: string | null = sessionStorage.getItem("isadmin");
  plant_Code: any = sessionStorage.getItem("plantcode");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  showAdd = true;
  plantname: any;
  bill_data: any;
  minStartDate: Date;
  maxStartDate: Date;
  processedBillStartDate: any;
  processedBillEndDate: any;
  minYear: any;
  maxYear: any;
  fileUploadPlantCode:any;
  /** selected row for action */
  selectedRow: any = [];
  /** hide processed bill */
  hideHeader: boolean = environment.hideProcessedBillTabMenu;
  /** checking current month based for year */
  currentYear = moment().format("YYYY");
  all: any;
  userDetails: any;
  // months: string[] = [
  //   'January', 'February', 'March', 'April', 'May', 'June',
  //   'July', 'August', 'September', 'October', 'November', 'December'
  // ];

  monthsWithFirstDates: { month: string; firstDate: string }[] = [
    { month: "January", firstDate: `${this.currentYear}-01-01` },
    { month: "February", firstDate: `${this.currentYear}-02-01` },
    { month: "March", firstDate: `${this.currentYear}-03-01` },
    { month: "April", firstDate: `${this.currentYear}-04-01` },
    { month: "May", firstDate: `${this.currentYear}-05-01` },
    { month: "June", firstDate: `${this.currentYear}-06-01` },
    { month: "July", firstDate: `${this.currentYear}-07-01` },
    { month: "August", firstDate: `${this.currentYear}-08-01` },
    { month: "September", firstDate: `${this.currentYear}-09-01` },
    { month: "October", firstDate: `${this.currentYear}-10-01` },
    { month: "November", firstDate: `${this.currentYear}-11-01` },
    { month: "December", firstDate: `${this.currentYear}-12-01` },
  ];
  selectedMonth: string | undefined;
  selectedDate: string | undefined;
  /** menu item */
  items: MenuItem[] = [
    {
      icon: "pi pi-plus-circle",
      tooltipOptions: {
        tooltipLabel: "Add ProcessedBill",
      },
      command: () => {
        this.showForm();
      },
    },
    {
      icon: "pi pi-download",
      tooltipOptions: {
        tooltipLabel: "Download",
      },
      command: () => {
        this.exportExcel();
        this.messageService.add({
          severity: "info",
          summary: "Data Converted.",
        });
      },
    },
  ];
  paidDayaJsonData: any = [];
  /** mat menu */
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  toggleMenu() {
    if (this.menuTrigger.menuOpen) {
      this.menuTrigger.closeMenu();
    } else {
      this.menuTrigger.openMenu();
    }
  }

  constructor(
    private fb: FormBuilder,
    private api: ClamAPIService,
    private dialog: MatDialog,
    private service: ApiService,
    public loader: LoaderserviceService,
    private messageService: MessageService,
    public utils: Utility,
    private modalService:NgbModal,
  ) {
    // bill form
    this.billForm = this.fb.group({
      plant: [this.plant_Code],
      payrollArea: ["", Validators.required],
      lock_month: ["", { validators: [Validators.required] }],
      process_start_date: ["", { validators: [Validators.required] }],
      process_end_date: ["", { validators: [Validators.required] }],
      lock_date: [""],
      companyTraineeLock: ["", [Validators.required]],
      category: ["T", { validators: [Validators.required] }],
      weekoff_paid: ["", Validators.required],
      // holidayName:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}]
    });
    /** calculate min & max year */
    let currentYear = new Date().getFullYear();
    /** Set min year to 1 year ago */
    this.minYear = new Date();
    this.minYear.setFullYear(currentYear - 1, 0, 1);
    /** Set maxyear to 1 year from now */
    this.maxYear = new Date();
    this.maxYear.setFullYear(currentYear + 1, 11, 31);
    console.log(this.minYear, this.maxYear);
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

    this.plant_Code = sessionStorage.getItem("plantcode");
    this.getplantcode();
    this.get_Bill_data();
    this.getPayrollArea(this.plant_Code);
  }
  /** on month selected area selected caluculate start,end day for selected month */
  updateSelectedDate() {
    const selectedLockMonth = this.billForm.get("lock_month")?.value;
    console.log("SELECTED LOCK MONTH: ", selectedLockMonth);
    console.log("MONTH:", new Date().getMonth());
    if (selectedLockMonth) {
      /** bill process start date & end date as calaulation based on start of the month */
      const selected = moment(selectedLockMonth, "YYYY-MM"); // e.g. '2025-11']
      console.log("SELECTED LOCK MONTH:", selected);
      /** checking if the selected payroll area start day */
      if (this.selecetedPayrollArea.StartDay === 1) {
        /** Full calendar month */
        const startDate = selected.clone().startOf("month");
        const endDate = selected.clone().endOf("month");
        /** calculated processed star & end date */
        this.processedBillStartDate = startDate.format("YYYY-MM-DD");
        this.processedBillEndDate = endDate.format("YYYY-MM-DD");
      } else {
        /* Previous month start and current month end day in payroll area end date */
        const prevMonth = selected.clone().subtract(1, "month");
        const startDate = moment({
          year: prevMonth.year(),
          month: prevMonth.month(),
          day: this.selecetedPayrollArea.StartDay,
        });

        const endDate = moment({
          year: selected.year(),
          month: selected.month(),
          day: this.selecetedPayrollArea.EndDay,
        });

        // Handle overflow (e.g. Feb 30 → Mar 2)
        const validStart = startDate.isValid()
          ? startDate
          : prevMonth.clone().endOf("month");
        const validEnd = endDate.isValid()
          ? endDate
          : selected.clone().endOf("month");

        /** calculated processed star & end date */
        this.processedBillStartDate = validStart.format("YYYY-MM-DD");
        this.processedBillEndDate = validEnd.format("YYYY-MM-DD");
      }

      /**
       * @property {billForm} has procesed bill data
       * @function patchValue update calculated start & end date YYYY-MM-DD format
       */
      this.billForm.patchValue({
        process_start_date: this.processedBillStartDate,
        process_end_date: this.processedBillEndDate,
      });
      console.log("Start Date", this.processedBillStartDate);
      console.log("End Date", this.processedBillEndDate);
      console.log(this.billForm.value);
    }
  }

  /** get plant code api call */
  getplantcode() {
    var company = {
      company_name: sessionStorage.getItem("companyList.companycode"),
    };
    this.service.plantcodelist(company).subscribe({
      next: (response) => {
        this.plantname = response;
        if (this.isadmin == "true") {
          this.plantname = response;
        } else {
          this.plantname = this.plantname.filter(
            (data: any) => data.plant_code === this.plant_Code,
          );
        }

        console.log(this.plantname);
      },
      error: (error) => {
        console.log("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }
  /** get payroll area by plant api call */

  /**
   * @param {*} plantcode
   * @memberof BillProcessedDateComponent
   */
  getPayrollArea(plantcode: any) {
    this.service.getPayrollAreaByPlantcode(plantcode).subscribe({
      next: (response) => {
        this.payrollArea = response;
        console.log(response);
      },
      error: (error) => {
        console.error("ERROR:", error);
        this.messageService.add({
          severity: "error",
          summary: error.error.message,
        });
      },
    });
  }
  // on plant change event
  onPlantChange(plantcode: any) {
    console.log(plantcode);
    this.getPayrollArea(plantcode);
  }
  // on payroll area change
  onPayrollAreaChange(payrollArea: any) {
    console.log(payrollArea);
    this.selecetedPayrollArea = payrollArea;
  }
  showForm() {
    this.showHolidayForm = true;
  }
  hideForm() {
    // this.reset()
    this.showHolidayForm = false;
    this.showAdd = true;
  }
  closeForm() {
    this.reset();
    this.showHolidayForm = false;
    this.showAdd = true;
  }
  reset() {
    this.billForm.reset();
  }

  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
      },
    });
  }

  formatDate(inputDate: Date): String {
    const parsedDate = moment(inputDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedDate = parsedDate.format("YYYY-MM-DD");
    return formattedDate;
  }
  /** get bill data api call */
  get_Bill_data() {
    this.api.get_Bill_date().subscribe(
      (res) => {
        this.bill_data = res;
        console.log(res);
      },
      (error) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    );
  }

  formatDate2(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  }

  // A function to convert a date to a month in words
  formatMonth(date: Date): string {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${monthNames[month]}`;
  }

  onedit(data: any) {
    this.showForm();
    console.log(data);
    this.showAdd = false;
    console.log(this.billForm.value);
    this.billForm.patchValue({
      lock_date: this.formatDate2(new Date(data.locked_date)),
      plant: data.plant_Code.toString(),
      process_end_date: this.formatDate(new Date(data.bill_prossed_enddt)),
      process_start_date: this.formatDate(new Date(data.bill_processed_st)),
      lock_month: this.formatDate(new Date(data.lock_month)),
      category: data.category,
    });
  }

  // delete confirm mat dialogue
  confirmDelete(delData: any) {
    const formData = { ...delData };
    formData.lock_month = this.formatDate(delData.lock_month);
    formData.bill_processed_st = this.formatDate(delData.bill_processed_st);
    formData.bill_prossed_enddt = this.formatDate(delData.bill_prossed_enddt);
    formData.locked_date = this.formatDate(delData.locked_date);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Are you sure you want to delete ?",
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
      },
    });
    console.log("DELETE DATA", formData);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.api.del_Bill_date(formData).subscribe(
          (res: any) => {
            // this.openAlertDialog(`${res}`,'check');
            this.messageService.add({ severity: "info", summary: res });
            this.get_Bill_data();
          },
          (error) => {
            if (error.status === 400) {
              console.error("ERROR:", error);
              // this.openAlertDialog(`${error.error}`,'error');
              this.messageService.add({
                severity: "error",
                summary: error?.error,
              });
            } else {
              // this.openAlertDialog('Error in connection','error');
              this.messageService.add({
                severity: "error",
                summary: "Error In Server",
              });
            }
          },
        );
      }
    });
  }

  Salary_locked(data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Are you sure you want to Lock the Salary?",
        confirmText: "Yes, Lock Salary",
        cancelText: "Cancel",
      },
    });

    /** setting salary lock into TRUE final lock */
    data = { ...data, Salary_Locked: "TRUE" };
    console.log("LOCK DATA", data);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.api.Lock_Salary(data, this.userEmpcode).subscribe(
          (res: any) => {
            // this.openAlertDialog(`${res}`,'check');
            this.messageService.add({ severity: "info", summary: res });
            this.get_Bill_data();
          },
          (error) => {
            if (error.status === 400) {
              console.log(error);
              // this.openAlertDialog(`${error.error}`,'error');
              this.messageService.add({
                severity: "error",
                summary: error?.error,
              });
            } else {
              // this.openAlertDialog('Error in connection','error');
              this.messageService.add({
                severity: "error",
                summary: "Error In Connection",
              });
            }
          },
        );
      }
    });
  }

  /**
   * add processed bill
   * @property {*} billForm
   */
  onSubmit() {
    if (this.billForm.valid) {
      console.log(this.billForm.value);
      const formData = { ...this.billForm.value };
      // check box index value
      formData.category = this.billForm.value.category[0];
      formData.companyTraineeLock = this.billForm.value.companyTraineeLock[0];
      formData.weekoff_paid = this.billForm.value.weekoff_paid[0];
      formData.payrollArea = this.selecetedPayrollArea.PayrollArea;
      formData.process_start_date = this.formatDate(
        this.billForm.value.process_start_date,
      );
      formData.process_end_date = this.formatDate(
        this.billForm.value.process_end_date,
      );
      formData.lock_month = moment(this.billForm.value.lock_month).format(
        "YYYY-MM-DD",
      );
      // formData.lock_date = this.formatDate(this.billForm.value.lock_date);
      /** lock date format */
      formData.lock_date = moment().format("YYYY-MM-DD");
      console.log("BILL LOCK DATA:", formData);
      /** add new processed bill api call */
      this.api.add_Bill_date(formData, this.userEmpcode).subscribe(
        (res: any) => {
          this.hideForm();
          this.messageService.add({ severity: "info", summary: res });
          // this.openAlertDialog(`${res}`,'check');
          this.get_Bill_data();
          this.reset();
        },
        (error) => {
          if (error.status === 400) {
            console.error("ERROR:", error);
            // this.openAlertDialog(`${error.error}`,'error');
            this.messageService.add({
              severity: "error",
              summary: error.error,
            });
            this.showForm();
          } else {
            // this.openAlertDialog('Error in connection','error');
            this.messageService.add({
              severity: "error",
              summary: "Error In Connection",
            });
            this.showForm();
          }
        },
      );
    }
  }

  // expoert to excel data
  exportExcel(): void {
    const transformedArray: any = this.bill_data.map((data: any) => {
      const transformedObj: any = {};
      Object.keys(data).forEach((key) => {
        const newKey = key.replace(/_/g, " ");
        transformedObj[newKey] = data[key];
      });
      return transformedObj;
    });
    console.log(transformedArray);
    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Processed Bills");
    XLSX.writeFile(wb, "processed_bills.xlsx");
  }

  /**
   * handle year select for month start date
   */
  handleMonthStartDate(event: any) {
    this.currentYear = moment(event).format("YYYY");
    console.log("YEAR", this.currentYear);
    this.monthsWithFirstDates = [
      { month: "January", firstDate: `${this.currentYear}-01-01` },
      { month: "February", firstDate: `${this.currentYear}-02-01` },
      { month: "March", firstDate: `${this.currentYear}-03-01` },
      { month: "April", firstDate: `${this.currentYear}-04-01` },
      { month: "May", firstDate: `${this.currentYear}-05-01` },
      { month: "June", firstDate: `${this.currentYear}-06-01` },
      { month: "July", firstDate: `${this.currentYear}-07-01` },
      { month: "August", firstDate: `${this.currentYear}-08-01` },
      { month: "September", firstDate: `${this.currentYear}-09-01` },
      { month: "October", firstDate: `${this.currentYear}-10-01` },
      { month: "November", firstDate: `${this.currentYear}-11-01` },
      { month: "December", firstDate: `${this.currentYear}-12-01` },
    ];
    console.log("MONTH WITH DATE:", this.monthsWithFirstDates);
  }

  /**
   * download bill lock data
   */
  downloadPaidDaysData(payrollMonth: any, plantCode: any, payrollArea: any) {
    try {
      const queryData = {
        payrollMonth: moment(payrollMonth).format("YYYY-MM-DD"),
        plantCode,
        payrollArea,
      };
      console.log("QUERY DATA:", queryData);
      /** get Paid days API call */
      this.api.getPaidDays(queryData).subscribe({
        next: (response: any) => {
          if (response.status) {
            if (response.data.length != 0) {
              /** export JSON to excell */
              this.utils.jsonToExcellExport(
                response.data,
                queryData.plantCode,
                "paid_days",
              );
            }
          } else {
            console.log("REPONSE:", response);
            this.messageService.add({
              severity: "error",
              summary: "Oops! Error Occured.",
            });
          }
        },
        error: (error: any) => {
          console.error("ERROR:", error);
          this.messageService.add({
            severity: "error",
            summary: error?.error?.error,
          });
        },
      });
    } catch (error) {
      console.error("ERROR:", error);
      this.messageService.add({ severity: "error", summary: "hello" });
    }
  }

  /**
   * set selected row for actions
   * @param data
   */
  setSelectedRow(data: any) {
    this.selectedRow = [];
    console.log("after:", this.selectedRow);
    this.selectedRow = data;
    console.log("before:", this.selectedRow);
  }

  /**
   * file upload read the file and convert excel data into json data
   * @param event
   * @param plantCode // user selected row plant code 
   */
  onFileUpload(event: any,plantCode:any) {
    /** remove already selected file */
    console.log("FILE:", event.target.files[0]);
    const file = event.target.files[0];
    this.fileUploadPlantCode = plantCode;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    /** on load event */
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: "binary" });
      console.log("WB:", workbook);
      let sheetname = workbook.SheetNames[0];
      console.log("SN:", sheetname);
      this.paidDayaJsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetname],
        {
          blankrows: false,
        },
      );
      /** upload paid days API */
      this.uploadPaidDays(this.paidDayaJsonData);
    };
    /** on error event */
    fileReader.onerror = (error: any) => {
      this.messageService.add({ severity: "error", summary: error?.message });
    };
    /** loaded end event */
    fileReader.onloadend = ({ loaded, total }) => {
      if (loaded !== total) {
        this.messageService.add({
          severity: "error",
          summary: "Oops! something went wrong.",
        });
      }
    };
    console.log("Paid Days", this.paidDayaJsonData);
  }
  /**
   * upload paid days API
   * @param data
   */
  uploadPaidDays(data: any) {
    this.api.updatePaidDays(data).subscribe({
      next: (response: any) => {
        console.log("response", response);
        if (response?.success) {
          // this.messageService.add({
          //   severity: "info",
          //   summary: "Paid Days Updated Successfully!",
          // });

          /** open dialog modal */
          this.openStatusModal(response,this.paidDayaJsonData?.length);
        }
      },
      error: (error: any) => {
        console.error("ERROR:", error);
        this.messageService.add({
          severity: "error",
          summary: error?.error?.message,
        });
      },
    });
  }

    /** 
   * open status modal
   * @param apiResponse
   * @param totalDataCount
   */
  openStatusModal(apiResponse:any, totalDataCount:any){
    const confirmModalRef = this.modalService.open(ConfirmationComponent, {centered:true});
    confirmModalRef.componentInstance.confirmFunction = () => this.downloadFailedData(apiResponse?.failedRecords);
    /** modal text */
    confirmModalRef.componentInstance.confirmText = `${apiResponse?.insertedCount} of ${totalDataCount} SUCCESS and ${apiResponse?.failedRecords?.length} of ${totalDataCount} FAILED.`
    console.log('modal opened...');
  }

  /** 
   * download failed data
   * @param failedData
   * @property {*} fileUploadPlantCode
   */
  downloadFailedData(failedData:any){
    console.log('FAILED DATA:',failedData);
    /** utilities function to export data */
    this.utils.jsonToExcellExport(failedData,this.fileUploadPlantCode,'paidays_failed_data');
  }
}
