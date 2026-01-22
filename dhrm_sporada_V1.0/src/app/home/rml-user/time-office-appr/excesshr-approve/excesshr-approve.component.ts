import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";
import moment from "moment";
import { environment } from "src/environments/environment.prod";
import { Utility } from "src/app/utils/utils";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
@Component({
  selector: "app-excesshr-approve",
  templateUrl: "./excesshr-approve.component.html",
  styleUrls: ["./excesshr-approve.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ExcesshrApproveComponent implements OnInit {
  data: any = [];
  filterDate: any = "";
  lines: any;
  selectedLine: any = "All";
  userEnteredGenID: any;
  loading: any = false;
  max_hrs: any;
  all: any;
  userDetails: any;
  excessHourData: any;
  selectAll:boolean=  false;
  bulkApproveData:any = [];
  setActualEH:boolean =  environment?.setActualEH;
  successDataCount:number = 0;
  failedDataCount:number = 0;
  plantCode:any = sessionStorage.getItem("plantcode");
  userName:any = sessionStorage.getItem("user_name");
  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    public loader: LoaderserviceService,
    public utlis:Utility,
    private modalService:NgbModal,
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
    }
     /** get allowed OT hours */
    this.getAllowedOtHours();
    /** get lines by dept */
    this.getLineByDepartment();
    /** get EH data */
    this.getData();
   
  }

  /**
   * get Allowed OT hours
   * @property {*} max_hrs allowed ot hours day
   */
  getAllowedOtHours(){
     this.apiService.getAllowedOtHours().subscribe(
      (response: any) => {
        if (response.status == "success") {
          console.log('ALLOWED OT HRS:', response.data);
          this.max_hrs = response.data.day;
        } else {
          this.messageService.add({
            severity: "warn",
            summary: response.message,
          });
        }
      },
      (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    );
  }

  /**
   * get line by department
   * @property {*} lines 
   */
  getLineByDepartment(){
    this.apiService.getlineBydept().subscribe(
      (response: any) => {
        this.lines = response;
        this.lines.unshift({ Line_Name: "All" });
        console.log(response);
      },
      (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    );
  }
  /**
   * get EH data
   * @property {*} data mapped with approverHr & reason
   */
  getData() {
    this.apiService.getExcessHours().subscribe({
      next: (response: any) => {
        if (response.status == "failed") {
          // alert(response.message);
          this.messageService.add({
            severity: "warn",
            summary: response.message,
          });
        } else {
          console.log('EH DATA:',response.data);
          /** map with approvedHr, reason, selected props */
          this.data = response.data.map((element: any) => {
            return { ...element, approvedHr: null, reason: "", selected:false };
          });
          /** excess hour data copy for filters */
          this.excessHourData = this.data;
          console.log('MAPPED EH DATA:',this.data);
        }
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    });
  }

  /**
   * get Max hours for show message
   * @property {*} max_hrs
   * @param type  EH data
   *  */ 
  getMaxHours(type: any) {
    if (type === "W" || type === "N" || type === "F") {
      return type.expect_othr; // 12 default value
    } else if (type === "R") {
      return this.max_hrs;
    } else {
      return this.max_hrs;
    }
  }

  /** 
   * approve EH 
   * @property {boolean} loading
   * @var data approve data
   * @param item trainee EH data
   */
  approve(item: any) {
    this.loading = true;

    let data = {
      plant: this.plantCode,
      emp_id: item.cemp_id,
      date: item.att_date,
      hours: item.approvedHr,
      flag: "I", // default flag COFF || OT flag O
      approved_by: this.userName,
      reason: item.reason,
      shift_id: item.shift,
      type: item.type,
    };

    console.log('APPROVE DATA:',data);
    /** EH approval API */
    this.apiService.approveExcessHr([data]).subscribe(
      (response: any) => {
        if(response?.status == 'completed'){
          this.messageService.add({severity:'info',summary:'Excess Hours Successfully Approved.'})
          /** get EH data refresh */
          this.getData();
          this.loading = false;
        }else{
          this.messageService.add({severity:'error',summary:'Oops! Something wen wrong.'})
        }
      },
      (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error?.error?.message });
      }
    );
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
        this.messageService.add({severity:'warn', summary:response?.message});
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
              header.replace(/_/g, " ")
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
   * filter excess hours by gen id
   * @var filteredEhData
   * @property {*} data actual EH data
   * @property {*} excessHourData copy data
   *  */

  filterExcessHourByGenID() {
    this.userEnteredGenID = this.userEnteredGenID.trim();
    const filteredEhData = this.excessHourData.filter((trainee: any) => trainee.gen_id.includes(this.userEnteredGenID));
    console.log('GEN ID FILTER DATA:',filteredEhData)
    if (filteredEhData.length) {
      this.data = filteredEhData;
    } else {
      this.data = this.excessHourData;
    }
  }

  /** 
   * clear selected filter and selected data
   * set all filter date to default
   */
  clear(){
     this.filterDate = '';
     this.selectedLine = 'All';
     this.userEnteredGenID = '';
     this.bulkApproveData = [];
     this.data.forEach((ehData:any) => {
      ehData.selected = false;
      ehData.reason = '';
      ehData.approvedHr = null;
     });
     this.selectAll = false;
     this.data = this.excessHourData;
  }

  /** 
   * select all based on filter to bulk approve EH
   * here data is filter using ng pipe filtered data in @property {*} data
   */
  handelSelectAll() {
    /** actual hours 
     * here checked expect_othr is > ot per day limit
    */
   console.log('BULK SELECTED:',this.selectAll);
   let filteredEHData:any = [];
  /** format js date object */
   const formattedDate:any = this.filterDate == '' ? '' : moment(this.filterDate).format('YYYY-MM-DD');
   console.log(formattedDate,this.selectedLine,this.filterDate)
    if(this.selectAll){
      /** check if data & line filter applied */
      if(formattedDate && this.selectedLine !== 'All'){
        filteredEHData = this.data.filter((ehData:any) => {
          if(ehData.att_date == formattedDate && ehData.Line_Name == this.selectedLine){
            return ehData;
          }
        })
      }
      /** checking if date filter applied */
      else if(formattedDate){
        filteredEHData = this.data.filter((ehData:any) => {
          if(ehData.att_date == formattedDate){
            return ehData;
          }
        })
      }
      /** checking if line filter applied */
      else if(this.selectedLine !== 'All'){
       filteredEHData = this.data.filter((ehData:any) => {
          if(ehData.Line_Name == this.selectedLine){
            return ehData;
          }
        })
      }else{
        filteredEHData = this.data;
      }
      /** mapping filtered data EH bulk data */
      console.log('FILTERED DATA:',filteredEHData)
      this.bulkApproveData = filteredEHData.map((ehData:any) => {
        let approvedEH:number;
        /** set approvedHr based on user value */
        if(this.setActualEH){
          approvedEH = ehData.expect_othr
        }else{
           approvedEH = ehData.expect_othr > this.max_hrs  ? this.max_hrs : ehData.expect_othr;
        }
      return {
        ...ehData,
        approvedHr:approvedEH, 
        reason:`BULK EH APPROVED:${ehData.biometric_no}`,
        selected:true}
      });
    console.log('BULK DATA:',this.bulkApproveData);
    /** set selected value to @property {*} data */
    this.data =  this.bulkApproveData;
    } else{
      /** clear all data */
      this.clear();
    }
  }

  /** bulk approve EH  */
  bulkApproveEH(){
    console.log('BULK APPROVE EH DATA:',this.bulkApproveData);
    /** mapp selected bulk data for API */
    const mappedData:any = [];
    this.bulkApproveData.forEach((bulkData:any) => {
      const apiDataFormat = {
      plant: this.plantCode,
      emp_id: bulkData.cemp_id,
      date: bulkData.att_date,
      hours: bulkData.approvedHr,
      flag: "I", // default flag COFF || OT flag O
      approved_by: this.userName,
      reason: bulkData.reason,
      shift_id: bulkData.shift,
      type: bulkData.type,
      }
      /** push formatted data */
      mappedData.push(apiDataFormat);
    });
    /** bulk approve API call */
    this.apiService.approveExcessHr(mappedData).subscribe({
       next: (response:any) => {
        if(response?.status == 'completed'){
            this.findBulkApprovedFailedData(response?.results || []);
            this.findBulkApprovedSuccessData(response?.results || []);
            this.openBulkStatusModal(response?.results || [])
        }
       },
       error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message});
       }
    });    
    console.log('API FORMATTED DATA:',mappedData);
  }

  /** 
   * convert number to string
   * @param number
   *  */
  convertToString(number:any){
    if(!number){
      return '0'
    }else{
    return String(number);
    }
  }

  /**
   * handle if user changes filter after select all btn clicked.
   */
  handleUserActionIfSelectedAllSelected(){
    if(this.selectAll){
      this.handelSelectAll();
    }
  }
  /**
   * count success data count based on status
   * @property {*} succesuccessDataCount
   * @param apiResponse
   */
  findBulkApprovedSuccessData(apiResponse:any){
    apiResponse.forEach((data:any) => {
      if(data?.status == 'success'){
        this.successDataCount += 1;
      }
    })
  }
   /**
   * count success data count based on status
   *  @property {*} failedDataCount
   * @param apiResponse
   */
  findBulkApprovedFailedData(apiResponse:any){
    apiResponse.forEach((data:any) => {
      if(data?.status == 'failed'){
        this.failedDataCount += 1;
      }
    })
  }
  /**
   * download failed data as excell sheet
   */
  downloadFailedData(apiResponse:any){
    /** filter failed data */
    const failedData = apiResponse.filter((data:any) => {
      if(data?.status == 'failed'){
        return data;
      }
    });
    /** download failed data */
    this.utlis.jsonToExcellExport(failedData,this.plantCode,'EH_FAILED_DATA')
  }

  /** 
   * open modal
   * @param apiResponse
   */
  openBulkStatusModal(apiResponse:any){
    const confirmModalRef = this.modalService.open(ConfirmationComponent, {centered:true});
    confirmModalRef.componentInstance.confirmFunction = () => this.downloadFailedData(apiResponse);
    confirmModalRef.componentInstance.confirmText = `${this.successDataCount} of ${this.bulkApproveData.length} success and ${this.failedDataCount} of ${this.bulkApproveData.length} failed. Click YES to download failed data.`
    console.log('modal opened...');
    /** set success and failed count to default */
    confirmModalRef.closed.subscribe(() => {
      this.successDataCount = 0;
      this.failedDataCount = 0;
      /** clear data & get excess hour data */
      this.clear();
      this.getData();
    })
  }
}
