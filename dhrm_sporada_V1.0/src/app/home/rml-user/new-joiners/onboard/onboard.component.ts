import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css'],
  
})
export class OnboardComponent implements OnInit {
  select:any = ['APPOINTED', 'TRAINING COMPLETED']
  all:any;
  userDetails:any;
  statusOption = [
    {value:'APPOINTED',label:'APPOINTED'},
    {value:'IN TRAINING',label:'IN TRAINING'},
    {value:'TRAINING COMPLETED',label:'TRAINING COMPLETED'},
  ]
  someSubscription:any
  filterinfo:any = [
  ]
  id:any
  form:any
  searchText:any
  page:any = 1
  pageSize:any = 50
  data:any
  collectionSize:any = 0
  currentDate:any = new Date();
  from:any

// If the resulting date is after the current date or is the same day as the current date, subtract one day to get the last day of the previous month
  to:any = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')

  constructor(private fb : UntypedFormBuilder, private http: HttpClient, private service: ApiService, private active: ActivatedRoute, private router: Router, private modalService : NgbModal,public loader:LoaderserviceService,private messageService:MessageService) {
    this.from = new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 3, this.currentDate.getDate()), 'yyyy-MM-dd')  
    if(this.from >= this.currentDate) 
    {
      this.from =  new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 2, 0), 'yyyy-MM-dd')
    }
    this.form = this.fb.group({
      plantcode: [sessionStorage.getItem('plantcode')],
      select : ['APPOINTED'],
      fromdate:[this.from],
      todate:[this.to]
    });

   }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.filter()

  }

  call(event:any)
  {
   this.from = event
   console.log(this.from)
  }

  call2(event:any)
  {
   this.to = event
   console.log(this.to);
   
  }

  getPremiumData()
  {
    this.data =  this.filterinfo.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  filter()
  {
    this.service.onboard(this.form.value).subscribe({
      next:(response:any) => {
        if(response.length){
          console.log(response)
          this.filterinfo = response;
        }else{
          this.messageService.add({severity:'info',summary:'No Application!'});
          this.filterinfo = response;
        }
      }
    })
  }

  exportexcel()
  {
    var ws = XLSX.utils.json_to_sheet(this.filterinfo)
    var wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'people')
    XLSX.writeFile(wb, 'onboard.xlsx')
    this.messageService.add({severity:'info',summary:'Data Exported!'})
  }


}