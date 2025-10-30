import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from  '../../../environments/environment.prod'
import { ClamAPIService } from '../clam-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastComponent } from '../toast/toast.component';
// import {DelPopupComponent} from '../del-popup/del-popup.component'
import * as XLSX from 'xlsx';
import moment from 'moment';
import {RequestDetailsDialogComponent } from '../request-details-dialog/request-details-dialog.component'
import { MessageService } from 'primeng/api';
import { error } from 'console';
interface RequestData {
  Request_Id: number;
  Emp_Name: string;
  Uploaded_On: Date;
  Status:string;
  // Add other properties as needed
}

@Component({
  selector: 'app-one-time-salary',
  templateUrl: './one-time-salary.component.html',
  styleUrls: ['./one-time-salary.component.css']
})
export class OneTimeSalaryComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  url = environment.path + "/";
  uploadedFile: any;
  parsedData: any[];
  nonVerifiedData: any[];
  verifiedData: any[];
viewtable=false
  currentMonth: number;
  currentYear: number;
  currentTime:any
  groupedData: Record<string, any[]> = {};
  requests: any[] = [];
  ishr: any 
  ishrappr :any
  isadmin :any
  bill_processed_st:any 
  bill_prossed_enddt:any 
  invalidEntries: any[] = [];  
  Ear_Valid: any[] = [];
  Ded_Valid: any[] = [];
  Ear_InValid: any[] = [];
  Ded_InValid: any[] = [];
  getSal:any[]=[]
  loading:any=false
  consolidatedData: any[] = [];
  requestDetails: any
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  userDetails:any;
  all:any;
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  constructor( private api:ClamAPIService,private dialog: MatDialog,private messageService:MessageService) { 
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth(); 
    this.currentYear = currentDate.getFullYear();
  }

  getFormattedDate(): string {
    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
  }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    const item = sessionStorage.getItem("all");
    this.ishr = sessionStorage.getItem('ishr')
    this.ishrappr = sessionStorage.getItem('ishrappr')
    this.isadmin = sessionStorage.getItem('isadmin')
    this.getPayroll()
    this.getSalData()
  }

  getPayroll(){
    this.api.getpayrollDates(this.plant_Code).subscribe((res:any) =>{
      console.log(res);
      
      this.bill_processed_st =res[0].bill_processed_st
      this.bill_prossed_enddt=res[0].bill_prossed_enddt
  // console.log(this.apnt_list)
    },error=>{
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })
  }
  // get salary data
  getSalData(): void {
    console.log('hai');
    
    this.api.getOneTimeSal(this.plant_Code).subscribe((res: any) => {
      // console.log(res);
      this.groupedData = this.groupByRequestId(res);
      // console.log(this.groupedData);
      this.calculateTotals(this.groupedData);
    }, error => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  groupByRequestId(data: any[]): Record<string, any[]> {
    return data.reduce((acc, item) => {
      const requestId = item.Request_Id.toString();
      if (!acc[requestId]) {
        acc[requestId] = [];
      }
      acc[requestId].push(item);
      return acc;
    }, {} as Record<string, any[]>);
  }
  
  // calculateTotals(data: any) {
  //   const totals: { [key: string]: { earnings: number, deductions: number } } = {};
  //   console.log(data);
    

  //   Object.values(data).forEach((requests:any) => {
  //     requests.forEach((request:any) => {
  //       if (!totals[request.Request_Id]) {
  //         totals[request.Request_Id] = {
  //           earnings: 0,
  //           deductions: 0
  //         };
  //       }
  //       if (request.Type === 'Earning') {
  //         totals[request.Request_Id].earnings += request.Amount;
  //       } else {
  //         totals[request.Request_Id].deductions += request.Amount;
  //       }
  //     });
  //   });

  //   Object.keys(totals).forEach(key => {
  //     const requestId = parseInt(key);
  //     const totalEarnings = totals[key].earnings.toFixed(2);
  //     const totalDeductions = totals[key].deductions.toFixed(2);

  //     // Find the requester details for this Request_Id
  //     const requesterDetails = this.findRequester(requestId, data);


  //     this.consolidatedData.push({
  //       Request_Id: requestId,
  //       min_from:'',
  //       max_from:'',
  //       Requested_By: requesterDetails ? requesterDetails.Emp_Name : 'Unknown',
  //       Requested_On: requesterDetails ? requesterDetails.Uploaded_On : 'Unknown',
  //       TotalEarning: totalEarnings,
  //       TotalDeduction: totalDeductions,
  //       Status: requesterDetails ? requesterDetails.Status : 'Unknown',
  //       View: 'View Details',
  //       Approve: 'Approve',
  //       Reject: 'Reject'
  //     });
  //   });
  // }


  calculateTotals(data: any) {
    const totals: { [key: string]: { earnings: number, deductions: number, minDate: string, maxDate: string } } = {};
    const dates: { [key: string]: string[] } = {};
  
    // First pass: Calculate totals and collect dates
    Object.values(data).forEach((requests: any) => {
      requests.forEach((request: any) => {
        if (!totals[request.Request_Id]) {
          totals[request.Request_Id] = {
            earnings: 0,
            deductions: 0,
            minDate: request.Date,
            maxDate: request.Date
          };
          dates[request.Request_Id] = [];
        }
        if (request.Type === 'Earning') {
          totals[request.Request_Id].earnings += request.Amount;
        } else {
          totals[request.Request_Id].deductions += request.Amount;
        }
        dates[request.Request_Id].push(request.Date);
      });
    });
  
    // Second pass: Find min and max dates
    Object.keys(totals).forEach(key => {
      const dateArray = dates[key];
      const parsedDates = dateArray.map(date => parseDate(date));
      const minDate = new Date(Math.min(...parsedDates.map(date => date.getTime())));
      const maxDate = new Date(Math.max(...parsedDates.map(date => date.getTime())));
      totals[key].minDate = formatDate(minDate);
      totals[key].maxDate = formatDate(maxDate);
    });
  
    // Third pass: Create consolidated data
    Object.keys(totals).forEach(key => {
      const requestId = parseInt(key);
      const totalEarnings = totals[key].earnings.toFixed(2);
      const totalDeductions = totals[key].deductions.toFixed(2);
  
      // Find the requester details for this Request_Id
      const requesterDetails = this.findRequester(requestId, data);
  
      this.consolidatedData.push({
        Request_Id: requestId,
        min_from: totals[key].minDate,
        max_from: totals[key].maxDate,
        Requested_By: requesterDetails ? requesterDetails.Emp_Name : 'Unknown',
        Requested_On: requesterDetails ? requesterDetails.Uploaded_On : 'Unknown',
        TotalEarning: totalEarnings,
        TotalDeduction: totalDeductions,
        Status: requesterDetails ? requesterDetails.Status : 'Unknown',
        View: 'View Details',
        Approve: 'Approve',
        Reject: 'Reject'
      });
    });
  }
  
  findRequester(requestId: number, data: Record<string, RequestData[]>): RequestData | null {
    // Find the first occurrence of the given Request_Id in the data
    const requester = Object.values(data).find((requests: RequestData[]) => 
      requests.find((request: RequestData) => request.Request_Id === requestId)
    );
    return requester ? requester[0] : null;
  
  }
  openAlertDialog(message: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: 'wrong',
        message: message
      }
    });
  }
  //  excel file upload
  handleFileInput(event:any): void {
    console.log(event)
    const inputElement = event.currentFiles[0];
    if (inputElement) {
      this.uploadedFile = inputElement;
      // this.parseExcelData();
      this.verifyData(this.uploadedFile)
    }
  }
  // dialog
  handleView(item: any): void {
    const dialogRef = this.dialog.open(RequestDetailsDialogComponent, {
      width: '70%',
    
      data: {
        requestId: item.Request_Id,
        details: this.groupedData[item.Request_Id]
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleApprove(data:any){
    console.log(data);

    const dataToSend = {
      Approved_Data: data,
      details: this.groupedData[data.Request_Id],
      plant_code: this.plant_Code,
      user:this.userEmpcode
    };
const resp = this.api.approveOneTimeSal(dataToSend).subscribe((res:any)=>{
  console.log(res);
  this.openAlertDialog(`${res.message}`)
  this.clearAll()
  // this.getSalData()
},(error) =>
  {
console.log(error);
this.messageService.add({severity:'error',summary:error.message})

this.openAlertDialog(`${error.error.message}`)

} );
  }
  handleReject(data:any){
    console.log(data);

    const dataToSend = {
      Rejected_Data: data,
      details: this.groupedData[data.Request_Id],
      plant_code: this.plant_Code,
      user:this.userEmpcode
    };
const resp = this.api.rejectOneTimeSal(dataToSend).subscribe((res:any)=>{
  console.log(res);
  this.openAlertDialog(`${res.message}`)
  this.clearAll()
  // this.getSalData()
},(error) =>
  {
console.log(error);
this.messageService.add({severity:'error',summary:error.message})

} )

  }
  
  parseExcelData(): void {
    this.verifiedData = [];
    this.nonVerifiedData = [];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      this.parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.viewtable =true
      this.verifyData(this.parsedData);
      
    };
    fileReader.readAsArrayBuffer(this.uploadedFile);
    
  }

  formatDateWithHr(inputDate: Date): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
    return formattedDate;
  }
  
  // verify uploaded excel data
  verifyData(parsedData:any) {
  try {
    this.loading=true
    const formData = new FormData();
    formData.append('file',parsedData)
    const response =  this.api.VerifyOTD_and_OTE(this.plant_Code,formData).subscribe( (res:any) =>{
      if(!res.success){
        this.messageService.add({severity:'warn',summary:res.error})
      }else{
        console.log(res);
      this.viewtable=true
      this.loading=false
      const earInvalid = res.Ear_Invalid || []
      const dedInvalid = res.Ded_Invalid || []
    
       this.Ded_InValid = res.Ded_Invalid || [];
       this.Ear_InValid = res.Ear_Invalid || [];
    
       this.Ded_Valid = res.Ded_Valid || [];
       this.Ear_Valid = res.Ear_Valid || [];

      console.log('res.Ded_Valid || []',res.Ded_Valid || []);
      console.log('res.Ear_Valid || []',res.Ear_Valid || []);
      console.log(' res.Ear_Invalid || [];', res.Ear_Invalid || []);
      console.log(' res.Ded_Invalid || []', res.Ded_Invalid || []);
      console.log();
      console.log();


      this.invalidEntries = [...earInvalid, ...dedInvalid].map(item => {
        let reason = '';
        if (item.current_payroll !== 'Valid') {
          reason += `${item.current_payroll} `;
        }
        
        if (item.Apln !== 'Valid') {
          reason += `${item.Apln} `;
        }
        
        if (item.SameLine !== 'Valid') {
          reason += `${item.SameLine} `;
        }
        if (item.DuplicationStatus !== 'Valid') {
          reason += `${item.DuplicationStatus} `;
        }
        
        return {
          Date: item.Date,
          apln_slno:item.apln_slno,
          Name:item.fullname,
          Gen_id: item.gen_id,
          Type: item.Earning_Description ? 'EARNINGS' : 'DEDUCTION',
          Description: item.Earning_Description || item.Deduction_Description,
          Amount: item.Earning_Amount || item.Deduction_Amount,
          Reason: reason.trim()


        }
      });

      console.log(this.invalidEntries);
      this.getSalData()
      this.fileInput.nativeElement.value = '';
      this.uploadedFile =null
    
      }
    },(error) => this.messageService.add({severity:'error',summary:error.message}))
  } catch (error) {
    this.openAlertDialog(`Error While Verifying Excel Upload data`)
    this.viewtable=false
    this.loading=false
  }
  }
  // clear all calaulation data.
  clearAll(){
    // this.fileInput.nativeElement.value = '';
    this.uploadedFile =null
    this.invalidEntries=[]
    this.Ded_InValid = [];
    this.Ear_InValid = [];
    this.Ded_Valid = [];
    this.Ear_Valid = [];
    this.consolidatedData = [];
    this.viewtable=false
    this.loading=false
    this.getSalData()
  }

  exportexcel(){
    const EarningsKey:any = {
      Date: 'Date',
      gen_id:'Gen_ID',
      Earning_Description: 'Earning Description',
      Earning_Amount: 'Earning Amount',
    };
    const transformedArrayEarning: any = this.Ear_InValid.map((obj: any) => {
      const transformedObj: any = {};
      Object.keys(EarningsKey).forEach(key => {
        const newKey = EarningsKey[key] || key;
          transformedObj[newKey] = obj[key];
        
      });
      return transformedObj;
    });

    const DeductoinKey:any = {
      Date: 'Date',
      gen_id:'Gen_ID',
      Deduction_Description: 'Dedcution Description',
      Deduction_Amount: 'Dedcution Amount',
    };

    const transformedArrayDeduction: any = this.Ded_InValid.map((obj: any) => {
      const transformedObj: any = {};
      Object.keys(DeductoinKey).forEach(key => {
        const newKey = DeductoinKey[key] || key;
          transformedObj[newKey] = obj[key];
        
      });
      return transformedObj;
    });

    var wb = XLSX.utils.book_new();
    var sheet1 = XLSX.utils.json_to_sheet(transformedArrayEarning);
    var sheet2 = XLSX.utils.json_to_sheet(transformedArrayDeduction);

    XLSX.utils.book_append_sheet(wb, sheet1, 'Earnings');
    XLSX.utils.book_append_sheet(wb, sheet2, 'Deductions');

    XLSX.writeFile(wb, 'Wrong One time Salary Data.xlsx');


    
  }


  SubmitVerifiedData(){

    const dataToSend = {
      Earning: this.Ear_Valid,
      Deduction: this.Ded_Valid,
      plant_code: this.plant_Code,
      user:this.userEmpcode
    };

    this.api.oneTimeSalary(dataToSend).subscribe((res:any) => {
      console.log(res);
      this.clearAll()
    this.openAlertDialog(`${res}`)
    },(error) =>
      {
console.log(error);

    } );
  }
}

function parseDate(dateString: string): Date {
  // Assuming the date format is DD-MM-YYYY
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}