import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { UntypedFormBuilder } from "@angular/forms";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-rejoin-approval',
  templateUrl: './rejoin-approval.component.html',
  styleUrls: ['./rejoin-approval.component.css']
})
export class RejoinApprovalComponent implements OnInit {
  plant: any;
  genid: any;
  form: any;
  created: any;
  tableData: any = [];
  selectAll: boolean = false;
  comment: string = '';
  showModal = false;
  decision: string = '';
  ishr: any;
  is_Chr: any;
  all:any;
  userDetails:any;

  constructor(
    public loader: LoaderserviceService,
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private messageService:MessageService
  ) {
    this.form = this.fb.group({
      plantcode: [sessionStorage.getItem('plantcode')],
      genid: ['']
    })
  }

  ngOnInit(): void {
    /** logged in user data */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.plant = sessionStorage.getItem('plantcode');
    this.created = sessionStorage.getItem('emp_id');
    this.ishr = sessionStorage.getItem('ishrappr') === 'true';
    this.is_Chr = sessionStorage.getItem('Is_CHR') === 'true';
    /* get rejoin requests */
    this.initialLoad();
  }

  /** 
   * get rejoin requests based on HR
  */
  initialLoad() {
    console.log('hr', this.ishr, 'chr', this.is_Chr)
    if (this.ishr) {
      console.log('hr table running');
      /** get PHR requests */
      this.service.GetPhrTable(this.plant).subscribe({
        next: (res: any) => {
          // for(let i=0; i <= 10; i++){
          //   this.tableData.push(res.data[0])
          // }
          console.log('PHR:',res.data)
          this.tableData = res.data;
        },
        error:(error:any) => {
          console.error('ERROR:',error);
          this.messageService.add({severity:'error',summary:error?.message})
        }
      })
    } else if (this.is_Chr) {
      console.log('chr table running');
      /** get CHR Requests */
      this.service.GetChrTable(this.plant).subscribe({
        next: (res: any) => {
          console.log('CHR:',res.data)
          this.tableData = res.data;
        },
        error:(error:any) => {
          console.error('ERROR:',error);
          this.messageService.add({severity:'error',summary:error?.message})
        }
      })
    }
  }

  toggleAllSelection() {
    this.tableData.forEach((item:any) => {
      item.selected = this.selectAll;
    });
  }

  onRowCheckboxChange() {
    this.selectAll = this.tableData.every((item:any) => item.selected);
  }

  /** PHR approve API */
  approve() {
    const selectedRows = this.tableData.filter((item:any)=> item.selected);

    if (!this.comment || this.comment.trim() === '') {
      // alert('Comment is mandatory before submitting.');
      this.messageService.add({severity:'warn',summary:'Comment is mandatory before submitting'})
      return;
    }

    if (!this.decision) {
      // alert('Please select Approve or Reject.');
      this.messageService.add({severity:'warn',summary:'Please select Approve or Reject'})
      return;
    }

    const payload = {
      data: selectedRows,
      createdAt: this.created,
      comment: this.comment.trim(),
      status: this.decision,
      plant: selectedRows[0].Plant_Code
    };

    console.log('payload', payload);

    this.service.UpdatePHRApproval(payload).subscribe({
      next: (res: any) => {
        console.log('Update PHR Response', res);
        // alert(res.message);
        this.messageService.add({severity:'info',summary:res.message})
        this.initialLoad();
        this.clear();
        this.showModal = false;
      },
      error: (err) => {
        console.error('Request Error', err);
        // alert(err?.error?.message);
        this.messageService.add({severity:'error',summary:err?.error?.message})
        this.initialLoad();
        this.clear();
        this.showModal = false;
      }
    })

  }

  Chrapprove() {
    const selectedRows = this.tableData.filter( (item:any) => item.selected);

    if (!this.comment || this.comment.trim() === '') {
      this.messageService.add({severity:'warn',summary:'Comment is mandatory before submitting'})
      return;
    }

    if (!this.decision) {
      this.messageService.add({severity:'warn',summary:'Please select Approve or Reject'})
      return;
    }

    const payload = {
      data: selectedRows,
      createdAt: this.created,
      comment: this.comment.trim(),
      status: this.decision,
    };

    console.log('payload', payload);

    this.service.UpdateCHRApproval(payload).subscribe({
      next: (res: any) => {
        console.log('Update PHR Response', res);
         this.messageService.add({severity:'info',summary:res.message})
        this.initialLoad();
        this.clear();
        this.showModal = false;
      },
      error: (err) => {
        console.error('Request Error', err);
         this.messageService.add({severity:'error',summary:err?.error?.message})
        this.initialLoad();
        this.clear();
        this.showModal = false;
      }
    })

  }

  /** show approve modal */
  submit() {
    const selectedRows = this.tableData.filter( (item:any) => item.selected);
    if (selectedRows.length === 0) {
      // alert('Please select at least one row to submit.');
      this.messageService.add({severity:'warn',summary:'Please select at least one row to submit'})
      return;
    }
    this.showModal = true;
  }

  clear() {
    this.form.patchValue({ genid: '' });
    this.selectAll = false;
    this.tableData.forEach( (item:any) => item.selected = false);
    this.comment = '';
    this.decision = '';
  }

  closeModal() {
    this.showModal = false;
    this.clear();
  }


}
