import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ApiService } from 'src/app/home/api.service';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-test-result-summary',
  templateUrl: './test-result-summary.component.html',
  styleUrls: ['./test-result-summary.component.css']
})

export class TestResultSummaryComponent implements OnInit { 

d:any = this.getCurrentDate()
all:any;
userDetails:any;
testStatus:any = 'in_training';
isreportingAuth:any;
empslno:any = null;
statusList = [{label:'IN-TRAINING',value:'in_training'},{label:'TRAINING COMPLETED',value:'completed'}];
getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

date :any = {
  "start": '2020-01-01',
  "end": this.d,
  "plantcode": sessionStorage.getItem('plantcode'),
}
currentDate:any = new Date()

data: any

form:any

  constructor(private dateAdapter: DateAdapter<Date>, private service : ApiService,public loader:LoaderserviceService, private messageService:MessageService) {
    this.date.start = new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 3, this.currentDate.getDate()), 'yyyy-MM-dd')  
    if(this.date.start >= this.currentDate) 
    {
      this.date.start =  new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 2, 0), 'yyyy-MM-dd')
    }
    this.dateAdapter.setLocale('en-GB');
   }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name;
      this.isreportingAuth = this.all?.Is_ReportingAuth;

      console.log('RA:', this.isreportingAuth)
    // checking if the user is reporting auth
    if(this.isreportingAuth){
      this.empslno = this.all?.empl_slno;
    }
    console.log(this.empslno, this.date)
    }
    this.service.testSummary({...this.date,test_status:this.testStatus,reporting_authority:this.empslno}).
    subscribe({
      next: (response)=>{console.log(response); this.data = response } ,
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }
  
  refresh(){
    window.location.reload();
  }

  save()
  {
    console.log(this.date)
    this.service.testSummary({
      start: moment(this.date.start).format('YYYY-MM-DD'),
      end: moment(this.date.end).format('YYYY-MM-DD'),
      plantcode:sessionStorage.getItem('plantcode'),
      test_status:this.testStatus,
      reporting_authority:this.empslno}).
    subscribe({
      next: (response)=>{console.log(response); this.data = response } ,
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })

    console.log(this.empslno)
  }

  exportexcel()
  {
    const wb = XLSX.utils.book_new();

    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet(this.data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Table');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'trainee-test-result-summary.xlsx');
    this.messageService.add({severity:'info',summary:'Data Convetered!'})
  }

}
