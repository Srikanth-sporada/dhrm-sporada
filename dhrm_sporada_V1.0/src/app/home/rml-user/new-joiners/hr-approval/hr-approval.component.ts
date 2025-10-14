import { Component, OnInit } from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, UntypedFormBuilder, FormBuilder, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { DateRangeFilterPipe } from '../../dateFilter.pipe';
import { DatePipe } from '@angular/common';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-hr-approval',
  templateUrl: './hr-approval.component.html',
  styleUrls: ['./hr-approval.component.css']
})
export class HrApprovalComponent implements OnInit {

  var: any = 0
  all:any;
  userDetails:any;
  form: any
  filterinfo: any
  uniqueId :any = {'mobile':''}
  url = environment.path
  from:any
    // status options
  statusOption=[
  // { value: "NEW INCOMPLETE", label: "NEW INCOMPLETE" },
  { value: "pending", label: "PENDING" },
  { value: "submitted", label: "SUBMITTED" },
  // { value: "approved", label: "APPROVED" },
  { value: "Rejected", label: "REJECTED" },
  { value: "appointed", label: "APPOINTED" },
  { value: "relieved", label: "RELIEVED" }
]
  currentDate = new Date()
  to:any = new DatePipe('en-US').transform( new Date(), 'yyyy-MM-dd')
    colname:string =  'create_dt'
    constructor(private fb : UntypedFormBuilder, private http: HttpClient,public loader:LoaderserviceService, private service: ApiService,private messageService:MessageService) {
      this.from = new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 3, this.currentDate.getDate()), 'yyyy-MM-dd')  
      if(this.from >= this.currentDate) 
      {
        this.from =  new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 2, 0), 'yyyy-MM-dd')
      }
      this.form = this.fb.group({
        status:new UntypedFormControl(' '),
        plantcode: [sessionStorage.getItem('plantcode')],
        fromdate: [this.from],
        todate:[this.to]
      });

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


    ngOnInit(): void {
      let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
      this.form.controls['status'].setValue('submitted')
      this.filter()
      console.log(this.from,this.to)
    } 

    doit(event:any){
      console.log(event)
    }
  
  filter()
  {
    console.log(this.form.value)
    this.service.filterForApproval(this.form.value)
    .subscribe({
      next: (response:any) =>{ 
       if(response.length){
         console.log(response); 
        this.filterinfo = response
       }else{
        this.messageService.add({severity:'info',summary:'No Application!'})
       }
      },
      error: (error) => this.messageService.add({severity:'error',summary:error}),
    });
  }
}
