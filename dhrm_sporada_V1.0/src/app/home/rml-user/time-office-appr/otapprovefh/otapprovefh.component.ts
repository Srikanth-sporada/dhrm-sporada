import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { MatDialog } from "@angular/material/dialog";
import { CoffDetailsComponent } from "../coff-details/coff-details.component";
import { ExcessHoursDetailsComponent } from "../excess-hours-details/excess-hours-details.component";
import { elements } from "chart.js";
import * as XLSX from "xlsx-js-style";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { environment } from "src/environments/environment.prod";
import { Utility } from "src/app/utils/utils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
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
  selectedDept: any = "";
  loading: any = false;
  successDataCount:any = 0;
  failedDataCount:any = 0;
  bulkOtApproveData:any[] = [];
  userEnteredGenID:any;
  overTimeDataCopy:any = [];
  showNoData:boolean = false;
  noDataImgPath:any = environment.noDataImgPath;
  paginationRowsPerPage:any[] = environment?.paginationRowsPerPage;
  startCount:number = 0; // init page number
  endCount:number = Number(this.paginationRowsPerPage[0])// init end count
  selectAll: any = false;
  all:any;
  userDetails:any;
  constructor(
    private apiService: ApiService, 
    private matdailog: MatDialog, 
    private messageService:MessageService,
    public loader:LoaderserviceService,
    public utils:Utility,
  private modalService:NgbModal,) {}


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

/** convert to number to string */
  toNumber(string:string|number){
    return Number(string);
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

  /** log page event 
   * calcualte @property {*} startCount 
   * @property {*} endCount
   * @param event
   *  */
   logPageEvent(event:any){
    console.clear();
    console.log('PAGINATION',event);
     const page = event.first / event.rows + 1; // current page (1-based)
     const limit = event.rows;
     this.startCount = event.first;
     this.endCount = page * limit;
     console.log('start count',this.startCount);
     console.log('end count:', this.endCount);
     console.log('PAGE:',page);
     console.log('LIMIT:',limit);
    /** reset selected after user navigated page , when selected */
    this.selectAll = false;
    this.data.forEach((otData:any) => {
     otData.selected = false
    });
    /** reset bulkApprove data if page navigated */
    this.bulkOtApproveData = [];
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
    const data = {
      empId:this.all.empl_slno,
      department:this.selectedDept,
      category:this.cat == 'All' ? '' : this.cat,
      plant: `${this.all.plant_code}`
    }
    this.apiService.getFhOt(data).subscribe({
      next: (response: any) => {
      if ((response.status = "success")) {
        console.log(response.data);
        this.data = response.data
        .map((element: any) => {return { ...element, selected: false };})
        .filter((element: any) => {return element.approved_hours > 0});
        console.log('OT DATA:',response.data);
        /** copy data */
        this.overTimeDataCopy = this.data;
      } else if (response.status == "failed") {
        // alert(response.message);
        this.messageService.add({severity:'warn',summary:response.message})
      }
    },
    error: (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.error.message})
    }
    });
  }

  /** 
   * approve OT
   * @var data api request body
   * */
  approve(item: any) {
    this.loading = true;
    /** construct data for API */
    let data = {
      data: [item],
      sup_id: sessionStorage.getItem("user_name"),
    };
    /** approve API */
    this.apiService.approveFhOt(data).subscribe({
      next: (res: any) => {
      if (res.status == "success" || res.status == 'completed') {
        const regex = /!/;
        const severity = regex.test(res.message) ? 'warn' : 'info'
        this.getData();
        this.messageService.add({severity:severity,summary:res.message});
        this.loading = false;
        /** reset filter */
        this.resetFilterValue();
      } else {
        this.messageService.add({severity:'warn',summary:res.message})
        this.getData();
        this.loading = false;
      }
    },
    error: (error) => {
      console.error('SINGLE OT APPROVE ERROR:',error);
      this.messageService.add({severity:'error',summary:error.error.message})
    }
    });
  }

  /** 
   * aprrove selected OT
   * @var filtered_data selected OT data
   * @var data
   */
  approveBulkOtData() {
    this.loading = true
    const filteredData = this.bulkOtApproveData.filter((otData:any) => otData.selected == true)
    let data = {
      data: filteredData,
      sup_id: sessionStorage.getItem("user_name"),
    };
    /** approve OT API */
    this.apiService.approveFhOt(data).subscribe({
      next: (response: any) => {
      if(response.status == 'success' || response.status == 'completed'){
        /** filter data based on result and open popup modal */
         this.findBulkApprovedFailedData(response?.results || []);
         this.findBulkApprovedSuccessData(response?.results || []);
        /** this opens and sets apicall button state false */
        this.openBulkStatusModal(response?.results || []);
      } else{
        this.messageService.add({severity:'error',summary:'Oops! error occured.'})
      }
    },
    error: (error) => {
      console.error('BULK OT APPROVE ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    }
    });
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
     * open modal
     * @param apiResponse
     * @property {boolean} isApiCalled
     */
    openBulkStatusModal(apiResponse:any){
      /** handle ot limit exceed  */
      if(apiResponse[0]?.status === 'failed'){
         this.messageService.add({severity:'warn',summary:'oops! something went wrong'})
      }
      /** set api call false */
      this.loading = false;
      const confirmModalRef = this.modalService.open(ConfirmationComponent, {centered:true});
      confirmModalRef.componentInstance.confirmFunction = () => this.downloadFailedData(apiResponse);
      /** modal text */
      confirmModalRef.componentInstance.confirmText = `${this.successDataCount} of ${this.bulkOtApproveData.length} SUCCESS and ${this.failedDataCount} of ${this.bulkOtApproveData.length} FAILED. Click YES to download failed data.`
      console.log('modal opened...');
      /** set success and failed count to default */
      confirmModalRef.closed.subscribe(() => {
        this.successDataCount = 0;
        this.failedDataCount = 0;
        this.selectAll = false;
        this.loading = false;
        /** reset filter */
        this.resetFilterValue();
        /** get data after modal closed */
        this.getData();
      })
    }

    /**
   * download failed data as excell sheet
   */
  downloadFailedData(apiResponse:any){
    if(this.failedDataCount == 0){
      this.messageService.add({severity:'warn',summary:'There no failed Data to download!'})
     return
    }
    /** filter failed data */
    const failedData = apiResponse.filter((data:any) => {
      if(data?.status == 'failed'){
        return data;
      }
    });
    /** download failed data */
    this.utils.jsonToExcellExport(failedData,this.all.plant_code,'OT_FAILED_DATA')
  }

  /**
   * @param item checked OT data
   * used to check select all check box
   * @property {*} data
   * @var count identity all data is checked
   */
  checkItems(item:any) {
    console.log('SELECTED DATA:',item);
    /** set @property {any[]} bulkOtApproveData selected data */
    this.bulkOtApproveData = this.data.filter((otData:any) => otData.selected == true);
    console.log('BULK APPROVE DATA LIST',this.bulkOtApproveData);
    // let count = 0;
    // for (let element of this.data) {
    //   if (element.selected == true) {
    //     count++;
    //   }
    // }
    // if (count == this.data.length) {
    //   this.selectAll = true;
    // }
    // if (count < this.data.length) {
    //   this.selectAll = false;
    // }
  }

  /**
   * handle select All
   * @property {boolean} selectAll
   */
  handelSelectAll() {
    /** find the curent page record */
    /** slice array based on the rendered table row for bulk select */
   const pagedLimitData = [...this.data].slice(this.startCount, this.endCount);
   console.log('PAGED LIMIT:', pagedLimitData);
    /** select all for the current page rows */
    if(this.selectAll){
      pagedLimitData.forEach((otData:any) => {
        otData.selected = true
      })
    }
    /** un select All for current page rows */
    else{
      pagedLimitData.forEach((otData:any) => {
        otData.selected = false
      });
    };
    this.bulkOtApproveData = this.data.filter((otData:any) => otData.selected == true);
    console.log('BULK APPROVE DATA LIST',this.bulkOtApproveData);
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
    this.userEnteredGenID = null;
  }

  filterChanged() {
    this.data = this.data.map((element: any) => {
      return { ...element, selected: false };
    });
    this.selectAll = false;
    /** get fhr ot data on dropdown change event */
    this.getData();
  }

  /** 
   * export OT data 
   * data GET from API
   */
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
        XLSX.writeFile(wb, `Excess_Hours_Report_${this.all.plant_code}.xlsx`);
        this.messageService.add({severity:'info',summary:'Data Exported!'})
      }
    });
  }

  /** 
   * filter OT approval by gen id
   * @property {*} userEnteredGenID
   * @property {*} data 
   * @property {*} overTimeDataCopy
   */
  filterOverTimeByGenID(){
     this.userEnteredGenID = this.userEnteredGenID.trim();
    let filteredEhData = this.overTimeDataCopy.filter((trainee: any) => trainee.gen_id.includes(this.userEnteredGenID));
    console.log('GEN ID FILTER DATA:',filteredEhData)
    if (filteredEhData.length) {
      this.data = filteredEhData;
      this.showNoData = false;
      
    } else {
      this.data = this.overTimeDataCopy;
      this.showNoData = true;
      filteredEhData = [];
    }
  }

  /** 
   * reset filter values
   * @property {*} userEnteredGenID
   * @property {*} cat
   * @property {*} selectedDept
   *  */
  resetFilterValue(){
    this.userEnteredGenID = null;
    this.selectedDept = "";
    this.cat = 'All'
    this.bulkOtApproveData = [];
  }
}
