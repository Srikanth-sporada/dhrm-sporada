import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';
import * as XLSX from'xlsx';
import * as moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import {LoaderserviceService} from '../../loaderservice.service'
import { ToastComponent } from '../toast/toast.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { MessageService,MenuItem } from 'primeng/api';
@Component({
  selector: 'app-bill-processed-date',
  templateUrl: './bill-processed-date.component.html',
  styleUrls: ['./bill-processed-date.component.css']
})
export class BillProcessedDateComponent implements OnInit {
  billForm:any
  showHolidayForm=false
  selectedMonth1: any;
  selectedPlant: any;
  payrollArea:any = [];
  selecetedPayrollArea:any = [];
  isadmin:string |null= sessionStorage.getItem('isadmin')
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  showAdd=true ;
  plantname:any
  bill_data:any
  minStartDate:Date
  maxStartDate:Date
  processedBillStartDate:Date;
  processedBillEndDate:Date;
  currentYear = new Date().getFullYear();
  // months: string[] = [
  //   'January', 'February', 'March', 'April', 'May', 'June',
  //   'July', 'August', 'September', 'October', 'November', 'December'
  // ];

  monthsWithFirstDates: {month:string,firstDate:string}[]=[
    {month:'January' ,firstDate:`${this.currentYear}-01-01`},
    {month:'February' ,firstDate:`${this.currentYear}-02-01`},
    {month:'March' ,firstDate:`${this.currentYear}-03-01`},
    {month:'April' ,firstDate:`${this.currentYear}-04-01`},
    {month:'May' ,firstDate:`${this.currentYear}-05-01`},
    {month:'June' ,firstDate:`${this.currentYear}-06-01`},
    {month:'July' ,firstDate:`${this.currentYear}-07-01`},
    {month:'August' ,firstDate:`${this.currentYear}-08-01`},
    {month:'September' ,firstDate:`${this.currentYear}-09-01`},
    {month:'October' ,firstDate:`${this.currentYear}-10-01`},
    {month:'November' ,firstDate:`${this.currentYear}-11-01`},
    {month:'December' ,firstDate:`${this.currentYear}-12-01`},
  ]
  selectedMonth: string | undefined;
  selectedDate: string | undefined;
   // Speed Dial items
    items: MenuItem[] = [
              {
                  icon: 'pi pi-plus-circle',
                  tooltipOptions:{
                    tooltipLabel: 'Add ProcessedBill',
                  },
                  command: () => {
                      this.showForm()
                  }
              },
              {
                icon: 'pi pi-download',
                tooltipOptions:{
                  tooltipLabel: 'Download',
                },
                command: () => {
                  this.exportExcel();
                  this.messageService.add({ severity: 'info', summary: 'Data Converted.' });
                }
              }
    ];
  constructor(private fb: FormBuilder,private api : ClamAPIService,private modalService: NgbModal,private dialog: MatDialog,private service : ApiService,public loader: LoaderserviceService,private messageService:MessageService) { 
  // bill form
    this.billForm = this.fb.group({
      plant:[this.plant_Code],
      payrollArea:['',Validators.required],
      lock_month:['',{validators : [Validators.required]}],
      process_start_date:['',{validators : [Validators.required]}],
      process_end_date:['',{validators : [Validators.required]}],
      lock_date:[''],
      category:['',{validators : [Validators.required]}],
      // holidayName:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}]
    })
  }

ngOnInit(): void {
  this.plant_Code = sessionStorage.getItem('plantcode');
    this.getplantcode()
    this.get_Bill_data();
    this.getPayrollArea(this.plant_Code)
}
//  on month selected area selected caluculate start,end day for selected month
updateSelectedDate() {
    const selectedLockMonth = this.billForm.get('lock_month')?.value;
    console.log('SELECTED LOCK MONTH: ' + selectedLockMonth)
    if (selectedLockMonth){
      const lockMonth = new Date(selectedLockMonth);
      /**
       * @function new startDate and end date calculation
       */
      // const startOfSelectedMonth = moment(selectedLockMonth);
      // console.log('START OF MONTH ' + startOfSelectedMonth)
      // const sDate = startOfSelectedMonth.clone().subtract(this.selecetedPayrollArea.StartDay,'days').format('YYYY-MM-DD');
      // const eDate = startOfSelectedMonth.clone().add(this.selecetedPayrollArea.EndDay,'days').format('YYYY-MM-DD');
      // console.log({startOfSelectedMonth,sDate,eDate},'NEW PA DATES');

      console.log("lock month:",lockMonth);
      /**
       * 1. here for start month js object gives 0 - 11 for getmonth()
       */
      let billStartMonth = lockMonth.getMonth();
      let billEndMonth = lockMonth.getMonth() + 1;
      let currentYear = new Date().getFullYear();
      /**
       * 1.checking december month if december month changing month number 13 to 1 janunary
       */
      if(billEndMonth == 13 || billStartMonth == 0){
        if(billEndMonth == 13){
         billEndMonth = 1; //setting to january month
         currentYear = currentYear + 1;
        }
        /**
         * checking if startMonth is 0 setting to 12 for december month and current year - 1
         *  */ 
        if(billStartMonth == 0){
         billStartMonth = 12;
         currentYear = currentYear - 1;
        } 
      }
    /**
     * 1. construct bill process start date and end date;
     * 2. currentYear - billStartMonth - payrollStartDay
     */
      let billProcessStartDate = `${currentYear}-${billStartMonth}-${this.selecetedPayrollArea.StartDay}`;
      let billProcessEndDate = `${currentYear}-${billEndMonth}-${this.selecetedPayrollArea.EndDay}`

      console.log('Start Month', billStartMonth, 'End Month ' , billEndMonth , 'Current Year' , currentYear,{billProcessStartDate,billProcessEndDate})
      /**
       * @var selectedLockMonth JS date object
       * @property {processedBillStartDate} @type {Date}
       * @property {processedBillEndDate} @type {Date}
       * @property {selectedPayrollArea} @type {Object} has payroll area data
       * @var lockMonth @type {Date}
       */
       // calculated processed bill start date
      this.processedBillStartDate = new Date(new Date(selectedLockMonth)
      .setDate(lockMonth.getDate() + this.selecetedPayrollArea.StartDay - 1));

       // calculated processed bill end date
       this.processedBillEndDate = new Date(new Date(selectedLockMonth)
      .setDate(this.processedBillStartDate.getDate() + this.selecetedPayrollArea.EndDay));

      /**
       * @property {billForm} has procesed bill data
       * @function patchValue update calculated start & end date YYYY-MM-DD format
       */
      this.billForm.patchValue({
        process_start_date: moment(this.processedBillStartDate).format('YYYY-MM-DD'),
        process_end_date: moment(this.processedBillEndDate).format('YYYY-MM-DD'),
      });
      console.log('Start Date' ,moment(this.processedBillStartDate).format('DD-MM-YYYY'))
      console.log('End Date' ,moment(this.processedBillEndDate).format('DD-MM-YYYY'));
      console.log(this.billForm.value)
    }
}

// get plant code
  getplantcode(){
    var company = {'company_name': sessionStorage.getItem('companyList.companycode')}
    this.service.plantcodelist(company)
    .subscribe({
      next: (response) =>{
        this.plantname = response;
        if(this.isadmin == 'true'){
          this.plantname = response;
        }else{
          this.plantname = this.plantname.filter( (data:any) => data.plant_code === this.plant_Code)
        }
      
       console.log(this.plantname)
       },
      error: (error) => this.messageService.add({severity:'error',summary:error.message}),
    });
  }
  // get payroll area
  getPayrollArea(plantcode:any){
    this.service.getPayrollAreaByPlantcode(plantcode).subscribe({
      next: (response) => {
        this.payrollArea = response;
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.error.message})
      }
    })
  }
  // on plant change event
  onPlantChange(plantcode:any){
    console.log(plantcode);
    this.getPayrollArea(plantcode);
  }
  // on payroll area change
  onPayrollAreaChange(payrollArea:any){
    console.log(payrollArea);
    this.selecetedPayrollArea = payrollArea;
  }
  showForm(){
    this.showHolidayForm=true
  }
  hideForm(){
    // this.reset()
    this.showHolidayForm = false
    this.showAdd=true;
  }
  closeForm(){
    this.reset()
    this.showHolidayForm = false
    this.showAdd=true;
  }
  reset(){
    this.billForm.reset()
  }
  
  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
        confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
        
      }
    });
}
  
formatDate(inputDate: Date): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    return formattedDate;
}

get_Bill_data(){
    this.api.get_Bill_date().subscribe(res =>{
      this.bill_data = res
      console.log(res);
    },(error)=>{
      this.messageService.add({severity:'error',summary:error.message})
    })
}

formatDate2(date: Date): string {
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are 0-indexed
      const year = date.getFullYear();
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
    
// A function to convert a date to a month in words
formatMonth(date: Date): string {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${monthNames[month]}`;
}

onedit(data:any){
    this.showForm()
    console.log(data)
    this.showAdd=false;
    console.log(this.billForm.value)
    this.billForm.patchValue({
      lock_date: this.formatDate2(new Date(data.locked_date)),
      plant: data.plant_Code.toString(),
      process_end_date: this.formatDate(new Date(data.bill_prossed_enddt)),
      process_start_date: this.formatDate(new Date(data.bill_processed_st)),
      lock_month: this.formatDate(new Date(data.lock_month)),
      category: data.category,
  
    })
}

// delete confirm mat dialogue
confirmDelete(delData:any) {
    const formData = { ...delData };
    formData.lock_month = this.formatDate(delData.lock_month)
    formData.bill_processed_st = this.formatDate(delData.bill_processed_st)
    formData.bill_prossed_enddt = this.formatDate(delData.bill_prossed_enddt)
    formData.locked_date = this.formatDate(delData.locked_date)
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this record?',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
        this.api.del_Bill_date(formData).subscribe(res =>{
      this.openAlertDialog(`${res}`,'check')
      this.get_Bill_data()
        },(error) => {
          if (error.status === 400) {
            console.log(error)
            this.openAlertDialog(`${error.error}`,'error');
            
          }
           else {
            this.openAlertDialog('Error in connection','error');
           
          }
      })
      }
    });
}

Salary_locked(data:any){
console.log(data);
const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  data: {
    message: 'Are you sure you want to Lock the Salary?',
    confirmText: 'Yes, Lock Salary',
    cancelText: 'Cancel',
  },
});

dialogRef.afterClosed().subscribe((result) => {
  if (result) {
    console.log(result)
    this.api.Lock_Salary(data,this.userEmpcode).subscribe(res =>{
  this.openAlertDialog(`${res}`,'check')
  this.get_Bill_data()
    },(error) => {
      if (error.status === 400) {
        console.log(error)
        this.openAlertDialog(`${error.error}`,'error');
        
      }
       else {
        this.openAlertDialog('Error in connection','error');
       
      }
  })
  }
});
}


//   Salary_Unlocked(data:any){

// this.api.Lock_Salary(data,this.userEmpcode).subscribe(res =>{
//   this.openAlertDialog(`${res}`,'check')
//   this.get_Bill_data()
//   this.hideForm()
//   this.reset()
//   },(error) => {
//     if (error.status === 400) {
//       console.log(error)
//       this.openAlertDialog(`${error.error}`,'error');
//       this.showForm()
//     }
//      else {
//       this.openAlertDialog('Error in connection','error');
//       this.showForm()
//     }
// })

//   }
// }




// add new processed bill

onSubmit(){
  if(this.billForm.valid){
    console.log(this.billForm.value);
    const formData = { ...this.billForm.value };
    // check box index value
    formData.category = this.billForm.value.category[0];
    formData.payrollArea = this.selecetedPayrollArea.PayrollArea;
    console.log(formData);
    // formData.process_start_date = this.formatDate(this.billForm.value.process_start_date)
    // formData.process_end_date = this.formatDate(this.billForm.value.process_end_date)
    // formData.lock_date = this.formatDate(this.billForm.value.lock_date)
    // this.api.add_Bill_date(formData,this.userEmpcode).subscribe(res =>{
    //   this.hideForm()
    //   this.openAlertDialog(`${res}`,'check')
    //   this.get_Bill_data()
    //   this.reset()
    //   },(error) => {
    //     if (error.status === 400) {
    //       console.log(error)
    //       this.openAlertDialog(`${error.error}`,'error');
    //       this.showForm()
    //     }
    //      else {
    //       this.openAlertDialog('Error in connection','error');
    //       this.showForm()
    //     }
    // })
}
}

// expoert to excel data
exportExcel() : void{

  const transformedArray:any = this.bill_data.map((data: any) =>{
    const transformedObj:any = {};
    Object.keys(data).forEach(key => {
      const newKey = key.replace(/_/g, ' '); 
      transformedObj[newKey] = data[key];
     
    });
    return transformedObj;
   
  
  })
  console.log(transformedArray);
  var ws = XLSX.utils.json_to_sheet(transformedArray);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Factory Holiday Master");
  XLSX.writeFile(wb,"Mst_Factory_Holiday.xlsx");

}
}
