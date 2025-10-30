import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../form.service';
import { DatePipe } from '@angular/common';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import * as XLSX from 'xlsx';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-trainee-application-status',
  templateUrl: './trainee-application-status.component.html',
  styleUrls: ['./trainee-application-status.component.css']
})
export class TraineeApplicationStatusComponent implements OnInit {

  form: any
  filterinfo: any
  colname: any
  colvalue: any
  searchfilterinfo: any;
  currentDate: Date;
  Date: any = 'Date';
  itemToDelete: any;
  showDeleteModal = false;
  all:any;
  userDetails:any;
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
// search type options
searchTypeOptions =[
  { value: "fullname", label: "NAME" },
  { value: "fathername", label: "FATHER NAME" },
  { value: "mobile_no1", label: "MOBILE NUMBER" },
  { value: "aadhar_no", label: "AADHAR NUMBER" }
];
  constructor(private modalService: NgbModal,private fb: UntypedFormBuilder, private http: HttpClient, private service: FormService, public loader: LoaderserviceService, private active: ActivatedRoute,private messageService:MessageService) {
    this.form = this.fb.group({
      status: new UntypedFormControl(''),
      fromdate: new UntypedFormControl(''),
      todate: new UntypedFormControl(''),
      colname: new UntypedFormControl(''),
      colvalue: new UntypedFormControl(''),
      plantcode: [sessionStorage.getItem('plantcode')]
    });
  }
  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.currentDate = new Date()
    this.form.controls['status'].setValue('pending')
    this.form.controls['fromdate'].setValue('2015-01-01')
    this.form.controls['fromdate'].setValue(new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 3, this.currentDate.getDate()), 'yyyy-MM-dd'))
    if (this.form.controls['fromdate'].value >= this.currentDate) {
      this.form.controls['fromdate'].setValue(new DatePipe('en-US').transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 2, 0), 'yyyy-MM-dd'))
    }
    var date = new Date()
    var to_date = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')
    this.form.controls['todate'].setValue(to_date)
    this.filter()
  }

  filter() {
    this.form.controls['fromdate'].setValue(moment(this.form.value.fromdate).format('YYYY-MM-DD'));
    this.form.controls['todate'].setValue(moment(this.form.value.todate).format('YYYY-MM-DD'))
    this.service.filter(this.form.value)
      .subscribe({
        next: (response:any) => {
          if(response.length){
            console.log(response);
           this.filterinfo = response
          }else{
            this.messageService.add({severity:'info',summary:'No Application!'});
          }
        },
        error: (error) =>this.messageService.add({severity:'error',summary:error.message}),
      });

  }

  searchfilter() {
    this.form.controls['fromdate'].setValue(moment(this.form.value.fromdate).format('YYYY-MM-DD'));
    this.form.controls['todate'].setValue(moment(this.form.value.todate).format('YYYY-MM-DD'))
    this.service.searchfilter(this.form.value)
      .subscribe({
        next: (response:any) => {
         if(response.length){
           console.log(response);
          this.searchfilterinfo = response;
          this.filterinfo = response
         }else{
          this.messageService.add({severity:'info',summary:'No Application!'})
         }
        },
        error: (error) => this.messageService.add({severity:'error',summary:error.message}),
      });

  }

  // export to excel function
  exportexcel() {
    const x = document.querySelector("#table")
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Table');
    XLSX.writeFile(wb, 'table.xlsx');
    this.messageService.add({severity:'info',summary:'Data Exported!'})
  }

  // delete trainee application
delete(item: any) {
    console.log('Item to delete:', item);

    this.service.deleteTrainee(item).subscribe({
      next: (res: any) => {
        console.log('Delete response:', res);
        this.messageService.add({severity:'info',summary:res.message})
        this.filter(); // Refresh list after deletion
      },
      error: (error) => {
        console.error('Error during deletion:', error);
        this.messageService.add({severity:'error',summary:'Failed To Delete Trainee.'})
        // alert('Failed to delete trainee.');
      },
    });
  }

openDeleteModal(apln_slno: any) {
  this.itemToDelete = apln_slno;
  this.showDeleteModal = true;
  console.log('modal opened.')
}

closeDeleteModal() {
  this.showDeleteModal = false;
  console.log('modal closed.')
}

// confirm before delete function
confirmDelete() {
  this.service.deleteTrainee(this.itemToDelete).subscribe({
    next: (res: any) => {
      this.messageService.add({severity:'info',summary:res.message})
      // alert(res.message);
      this.filter(); // refresh data
      this.showDeleteModal = false;
    },
    error: (err) => {
      console.error(err);
      this.messageService.add({severity:'error',summary:'Failed To Delete Trainee!.'})
      alert('Failed to delete trainee.');
      this.showDeleteModal = false;
    }
  });
}

// trainee application filter function
filterTraineeApplication(){
  console.log(this.form.value)
  if(this.form.value.colname && this.form.value.colvalue){
    this.searchfilter()
  }else{
    this.filter()
  }
}
}
