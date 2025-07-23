import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../form.service';
import { DatePipe } from '@angular/common';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import * as XLSX from 'xlsx';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private modalService: NgbModal,private fb: UntypedFormBuilder, private http: HttpClient, private service: FormService, public loader: LoaderserviceService, private active: ActivatedRoute) {
    this.form = this.fb.group({
      status: new UntypedFormControl(' '),
      fromdate: new UntypedFormControl(' '),
      todate: new UntypedFormControl(' '),
      colname: new UntypedFormControl(' '),
      colvalue: new UntypedFormControl(' '),

      plantcode: [sessionStorage.getItem('plantcode')]

    });
  }
  ngOnInit(): void {
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
    this.service.filter(this.form.value)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.filterinfo = response
        },
        error: (error) => console.log(error),
      });

  }

  searchfilter() {
    this.service.searchfilter(this.form.value)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.searchfilterinfo = response;
          this.filterinfo = response
        },
        error: (error) => console.log(error),
      });

  }

  exportexcel() {
    const x = document.querySelector("#table")
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Table');
    XLSX.writeFile(wb, 'table.xlsx');
  }

  delete(item: any) {
    console.log('Item to delete:', item);

    this.service.deleteTrainee(item).subscribe({
      next: (res: any) => {
        console.log('Delete response:', res);
        alert(res.message);
        this.filter(); // Refresh list after deletion
      },
      error: (error) => {
        console.error('Error during deletion:', error);
        alert('Failed to delete trainee.');
      },
    });
  }



openDeleteModal(apln_slno: any) {
  this.itemToDelete = apln_slno;
  this.showDeleteModal = true;
}


closeDeleteModal() {
  this.showDeleteModal = false;
}

confirmDelete() {
  this.service.deleteTrainee(this.itemToDelete).subscribe({
    next: (res: any) => {
      alert(res.message);
      this.filter(); // refresh data
      this.showDeleteModal = false;
    },
    error: (err) => {
      console.error(err);
      alert('Failed to delete trainee.');
      this.showDeleteModal = false;
    }
  });
}


}
