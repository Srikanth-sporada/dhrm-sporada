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

  isadmin:string |null= sessionStorage.getItem('isadmin')
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
showAdd=true ;
  plantname:any
  bill_data:any
  minStartDate: Date;
maxStartDate: Date;
  // months: string[] = [
  //   'January', 'February', 'March', 'April', 'May', 'June',
  //   'July', 'August', 'September', 'October', 'November', 'December'
  // ];

  monthsWithFirstDates: {month:string,firstDate:string}[]=[

    {month:'January' ,firstDate:'2025-01-01'},
    {month:'February' ,firstDate:'2025-02-01'},
    {month:'March' ,firstDate:'2025-03-01'},
    {month:'April' ,firstDate:'2025-04-01'},
    {month:'May' ,firstDate:'2025-05-01'},
    {month:'June' ,firstDate:'2025-06-01'},
    {month:'July' ,firstDate:'2025-07-01'},
    {month:'August' ,firstDate:'2025-08-01'},
    {month:'September' ,firstDate:'2025-09-01'},
    {month:'October' ,firstDate:'2025-10-01'},
    {month:'November' ,firstDate:'2025-11-01'},
    {month:'December' ,firstDate:'2025-12-01'},
  
  ]
  selectedMonth: string | undefined;
  selectedDate: string | undefined;
  
  constructor(private fb: FormBuilder,private api : ClamAPIService,
    private modalService: NgbModal,
    private dialog: MatDialog,private service : ApiService,public loader: LoaderserviceService) { 
    this.billForm = this.fb.group({
     
      plant:[this.plant_Code],
      lock_month:['',{validators : [Validators.required],updateOn: 'blur'}],
      process_start_date:['',{validators : [Validators.required],updateOn: 'blur'}],
      process_end_date:['',{validators : [Validators.required],updateOn: 'blur'}],
      lock_date:[''],
      category:['',{validators : [Validators.required],updateOn: 'blur'}],
      // holidayName:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}]
    })
  }

  ngOnInit(): void {
    this.getplantcode()
    this.get_Bill_data()
  }



  updateSelectedDate() {
    const selectedLockMonth = this.billForm.get('lock_month')?.value;
    if (selectedLockMonth){
      const lockMonth = new Date(selectedLockMonth);
      this.minStartDate.setDate(lockMonth.getDate()-30)
      this.maxStartDate.setDate(lockMonth.getDate()+30)
    }

  }
  

  
  
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
      error: (error) => console.log(error),
    });
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
      this.bill_data=res
      console.log(res)
    },(error)=>{
      console.log(error)
    })
    }


    formatDate2(date: Date): string {
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are 0-indexed
      const year = date.getFullYear();
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    
    // A function to convert a date to a month in words
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

onSubmit(){
  if(this.billForm.value){
    // console.log(this.billForm.value);

    const formData = { ...this.billForm.value };
    formData.process_start_date = this.formatDate(this.billForm.value.process_start_date)
    formData.process_end_date = this.formatDate(this.billForm.value.process_end_date)
    formData.lock_date = this.formatDate(this.billForm.value.lock_date)
    this.api.add_Bill_date(formData,this.userEmpcode).subscribe(res =>{
      this.hideForm()
      this.openAlertDialog(`${res}`,'check')
      this.get_Bill_data()
      
      this.reset()
      },(error) => {
        if (error.status === 400) {
          console.log(error)
          this.openAlertDialog(`${error.error}`,'error');
          this.showForm()
        }
         else {
          this.openAlertDialog('Error in connection','error');
          this.showForm()
        }
    })
  


}
}

// (click)="confirmDelete()"

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
