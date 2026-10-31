import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  ElementRef,
} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";
import moment, { months } from "moment";
import { environment } from "src/environments/environment.prod";
import { Utility } from "src/app/utils/utils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "src/app/confirmation/confirmation.component";

@Component({
  selector: "app-change-reserved-eh",
  templateUrl: "./change-reserved-eh.component.html",
  styleUrls: ["./change-reserved-eh.component.css"],
})
export class ChangeReservedEhComponent implements OnInit {
  data: any = [];
  filterDate: any = "";
  fromDate: Date = moment().subtract(120, "days").toDate();
  toDate: Date = moment().toDate();
  toMaxDate: Date = moment().toDate();
  lines: any;
  filterFlag: any = null; // default selects all
  selectedLine:any = null;
  bulkSelectReservationFlag: boolean = false;
  userEnteredGenID: any = null;
  loading: any = false;
  max_hrs: any;
  all: any;
  userDetails: any;
  excessHourData: any;
  selectAll: boolean = false;
  reservationFlags: any = [
    {lable:'All',flag:null},
    { lable: "COFF", flag: "RFC" },
    { lable: "OT", flag: "RFO" },
  ];
  bulkApproveData: any = [];
  coffLimits: any = [];
  setActualEH: boolean = environment?.setActualEH;
  startCount: number = 0; // init page number
  paginationRowLimit: number = environment?.paginationRowLimit;
  paginationRowsPerPage: any[] = environment?.paginationRowsPerPage;
  endCount: number = Number(this.paginationRowsPerPage[0]); // init end count
  successDataCount: number = 0;
  failedDataCount: number = 0;
  plantCode: any = sessionStorage.getItem("plantcode");
  userName: any = sessionStorage.getItem("user_name");
  isApiCalled: boolean = false;
  /** primeng data table ref */
  @ViewChildren("rowRef") rows!: QueryList<ElementRef>;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    public loader: LoaderserviceService,
    public utlis: Utility,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
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
      /** set logged in user line */
      this.selectedLine = this.all.line_code;
      console.log("LINE", this.selectedLine);
    }
    /** get lines by dept */
    this.getLineByDepartment();
    /** get EH data */
    this.getData();
    console.log("curent page number", this.startCount);
  }

  logPageEvent(event: any) {
    console.clear();
    console.log("PAGINATION", event);
    const page = event.first / event.rows + 1; // current page (1-based)
    const limit = event.rows;
    this.startCount = event.first;
    this.endCount = page * limit;
    console.log("start count", this.startCount);
    console.log("end count:", this.endCount);
    console.log("PAGE:", page);
    console.log("LIMIT:", limit);
    this.clear();
  }

  /**
   * get line by department
   * @property {*} lines
   */
  getLineByDepartment() {
    this.apiService.getlineBydept().subscribe(
      (response: any) => {
        this.lines = response;
        this.lines.unshift({ Line_Name: "All", Line_code:null });
        console.log(response);
      },
      (error) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    );
  }
  /**
   * get EH data
   * @property {*} data mapped with approverHr & reason
   */
  getData() {
    const data:any = {
      flag:this.filterFlag,
      lineCode:this.selectedLine,
      genId:this.userEnteredGenID,
      plantCode:this.plantCode,
      empSlno:this.userName,
    };

    this.data =[];
    this.excessHourData = [];
    
    this.apiService.getReservedHoursForFlagChange(data).subscribe({
      next: (response: any) => {
       if(response.status){
         console.log("RESERVATION CHANGE DATA:", response.data);
        /** map with approvedHr, reason, selected props */
        const constructedData = response.data[0].map((element: any) => {
          return {
            ...element,
            selected: false,
            changedFlag: element.flag == 'RFC' ? 'RFO' : 'RFC', // if reserved for coff -> RFO , if reserved for OT -> RFC
          };
        });
         //this.data = [...constructedData]
        this.data = this.cleanCircularReferences(constructedData); // cleaning circular references
        /** excess hour data copy for filters */
        this.excessHourData = this.data;
        console.log("MAPPED EH DATA:", this.data);
        /** change detection */
        this.cd.detectChanges();
       } else{
        this.messageService.add({severity:'error',summary:response.message})
       }
      },
      error: (error:any) => {
        console.error("ERROR:", error);
        this.messageService.add({
          severity: "error",
          summary: error?.error.message,
        });
      },
    });
  }

  /**
   * enable/disable bulk approve btn based on the selected state of the record
   * @return {boolean} 
   * @memberof ChangeReservedEhComponent
   */
  isBulkApproveBtnDisabled():boolean{
    if(this.selectAll){
      return false;
    }else{
      return !this.data.some((data:any) => data.selected == true);
    }
  }
  /**
   * approve EH
   * @property {boolean} loading
   * @var data approve data
   * @param item trainee EH data
   */
  approve(data: any) {
    this.loading = true;
    console.log("SINGLE CHANGE  DATA:", data);
    const changedBy:any = this.userName
    /** EH approval API */
    this.apiService.changeReservedHours([data], changedBy).subscribe({
      next: (response: any) => {
        if (response?.status == "completed") {
          this.findBulkApprovedFailedData(response?.results || []);
          this.findBulkApprovedSuccessData(response?.results || []);
          /** this opens and sets apicall button state false */
          this.openBulkStatusModal(response?.results || []);
          this.loading = false;
          this.isApiCalled = false;
        } else {
          this.isApiCalled = false;
          this.messageService.add({
            severity: "error",
            summary: "Oops! Something went wrong.",
          });
          this.loading = false;
        }
      },
      error: (error:any) => {
        console.error("ERROR:", error);
        this.messageService.add({
          severity: "error",
          summary: error?.error?.message,
        });
        this.loading = false;
        this.isApiCalled = false;
      },
    });
  }

  /**
   * Export Excell sheet EH data
   * @var sheetsData
   * @var sheetNames
   * @var wb
   * @var headerStyles
   * @var ws
   */
  exportexcel() {
    this.apiService.getExcessHours_Report().subscribe((response: any) => {
      if (response.status == "failed") {
        // alert(response.message);
        this.messageService.add({
          severity: "warn",
          summary: response?.message,
        });
      } else {
        let sheetsData = response.data;
        let sheetNames = [
          "Trainee OT Summary",
          "Trainee OT Details",
          "Operator OT Summary",
          "Operator OT Details",
        ];

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
            let headers = Object.keys(cleanedData[0]).map((header) =>
              header.replace(/_/g, " "),
            );

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
        this.messageService.add({
          severity: "info",
          summary: "Data Exported!",
        });
      }
    });
  }

  /**
   * clear selected filter and selected data
   * set all filter date to default
   * user deselects bull the autofiled values
   */
  clear() {
    this.data.forEach((data: any) => {data.selected = false});
    this.selectAll = false;
    this.data = this.excessHourData;
  }

  /**
   * select all based on filter to bulk approve EH
   * here data is filter using ng pipe filtered data in @property {*} data
   * @property {boolean} selectAll check box ng modal
   * @param isSelectAll -- handle if @property {boolean} selectAll is selected based on this prop map filtered data
   */
  handelSelectAll(isSelectAll?: boolean) {
  
    console.log("BULK SELECTED:", this.selectAll);
    /** slice array based on the rendered table row for bulk select */
    const pagedLimitData = [...this.data].slice(this.startCount, this.endCount);
    console.log("PAGED LIMIT:", pagedLimitData);
  
    if (this.selectAll) {
      /** change selected true */
      pagedLimitData.map((data: any) => {
          data.selected = true;
          return data;
        });
        console.log('BULK SELECTED DATA:',pagedLimitData)
    } else {
      /** change selected true */
      pagedLimitData.map((data: any) => {
          data.selected = false;
          return data;
        });
        console.log('BULK DE-SELECTED DATA:',pagedLimitData)
    }
  }
  
  /** bulk approve EH  */
  bulkApproveEH() {
    /** set isAPIcalled true */
    this.isApiCalled = true;
    const selectedChangeData = this.data.filter((data:any) => data.selected == true) // filters only selected data for bulk approval
    console.log('BULK SELECTED CHANGE DATA:', selectedChangeData);
    const changedBy:string = this.userName;
    /** bulk approve API call */
    this.apiService.changeReservedHours(selectedChangeData, changedBy).subscribe({
      next: (response: any) => {
        if (response?.status == "completed") {
          this.findBulkApprovedFailedData(response?.results || []);
          this.findBulkApprovedSuccessData(response?.results || []);
          /** this opens and sets apicall button state false */
          this.openBulkStatusModal(response?.results || []);
        }
      },
      error: (error: any) => {
        this.isApiCalled = false;
        console.log("ERROR:", error);
        this.messageService.add({
          severity: "error",
          summary: error?.error?.message,
        });
      },
    });
  }

  /**
   * get count of bulk selected data
   * @param number
   *  */
  getSelectedCount() {
    return this.data.filter((data:any) => data.selected == true).length;
  }

  /**
   * count success data count based on status
   * @property {*} succesuccessDataCount
   * @param apiResponse
   */
  findBulkApprovedSuccessData(apiResponse: any) {
    apiResponse.forEach((data: any) => {
      if (data?.status == "success") {
        this.successDataCount += 1;
      }
    });
  }
  /**
   * count success data count based on status
   *  @property {*} failedDataCount
   * @param apiResponse
   */
  findBulkApprovedFailedData(apiResponse: any) {
    apiResponse.forEach((data: any) => {
      if (data?.status == "failed") {
        this.failedDataCount += 1;
      }
    });
  }
  /**
   * download failed data as excell sheet
   */
  downloadFailedData(apiResponse: any) {
    if (this.failedDataCount == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "There no failed Data to download!",
      });
      return;
    }
    /** filter failed data */
    const failedData = apiResponse.filter((data: any) => {
      if (data?.status == "failed") {
        return data;
      }
    });
    /** download failed data */
    this.utlis.jsonToExcellExport(failedData, this.plantCode, "RESERVED_FAILED_DATA");
  }

  /**
   * open modal
   * @param apiResponse
   * @property {boolean} isApiCalled
   */
  openBulkStatusModal(apiResponse: any) {
    /** handle ot limit exceed  */
    if (apiResponse[0]?.status === "failed") {
      this.messageService.add({
        severity: "warn",
        summary: apiResponse[0]?.message,
      });
    }
    /** set api call false */
    this.isApiCalled = false;
    const confirmModalRef = this.modalService.open(ConfirmationComponent, {
      centered: true,
    });
    confirmModalRef.componentInstance.confirmFunction = () =>
      this.downloadFailedData(apiResponse);
    /** modal text */
    confirmModalRef.componentInstance.confirmText = `${this.successDataCount} of ${this.getSelectedCount()} SUCCESS and ${this.failedDataCount} of ${this.getSelectedCount()} FAILED. Click YES to download failed data.`;
    console.log("modal opened...");
    /** set success and failed count to default */
    confirmModalRef.closed.subscribe(() => {
      this.successDataCount = 0;
      this.failedDataCount = 0;
      /** clear data & get excess hour data */
      this.clear();
      /** get data after modal closed */
      this.getData();
    });
  }

  /** convert to number to string */
  toNumber(string: string | number) {
    return Number(string);
  }

  /** remove circular references */
  cleanCircularReferences(data: any[]): any[] {
    const seen = new WeakSet();
    const serialized = JSON.stringify(data, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return; // Strips out the circular reference property entirely
        }
        seen.add(value);
      }
      return value;
    });
    return JSON.parse(serialized);
  }
}
