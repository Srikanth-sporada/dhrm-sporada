import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import {LoaderserviceService} from '../../loaderservice.service'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transfer-posting',
  templateUrl: './transfer-posting.component.html',
  styleUrls: ['./transfer-posting.component.css']
})

export class TransferPostingComponent implements OnInit {
  fromDateControl = new FormControl('',Validators.required);
  toDateControl = new FormControl('', Validators.required);
  maxDate: Date;
  minDate: Date;
  all:any;
  userDetails:any;
  constructor(
    private api : ClamAPIService,
    private dialog: MatDialog,
    public loader: LoaderserviceService, 
    private messageService:MessageService,) { }

  ngOnInit(): void {
    /** logged in user details */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    /** min & max Date */
     this.maxDate = new Date();
      this.minDate = new Date(this.maxDate);
      this.minDate.setDate(this.maxDate.getDate() - 40); // today - 40
  }
  /** transfer posting API call */
  executeQuery() {
    const fromDate = this.formatDate(this.fromDateControl.value);
    const toDate = this.formatDate(this.toDateControl.value);
    console.log(`Executing query from ${fromDate} to ${toDate}`);

    this.api.transfer_post(fromDate,toDate).subscribe((res: any) =>{
      // this.openAlertDialog(`${res.message}`);
      console.log(res.message)
      this.toDateControl.reset();
      this.fromDateControl.reset();
      this.messageService.add({severity:'info',summary:res.message});
    }, (error:any) => {
      // this.openAlertDialog(`${error}`);
      this.messageService.add({severity:'error',summary:error});
      console.log('ERROR:',error);
    })
  }

  /** open Material UI dialog modal */
openAlertDialog(message: string): void {
  this.dialog.open(ToastComponent, {
    data: {
      icon: 'Check',
      message: message
    }
  });
}
 
  /** 
   * format JS Date object to YYYY-MM-DD
   *  */
   formatDate(inputDate:any): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    return formattedDate;
  }

  /** validate from and to date
   * @var fromDate 
   * @var toDate
   * @property {*} fromDateControl
   * @property {*} toDateControl
   */
  validateFromDate(){
     const fromDate:any = this.fromDateControl.value;
     const toDate:any = this.toDateControl.value;
     if(fromDate > toDate){
      this.messageService.add({severity:'warn',summary:'From Date should be same or less than To Date!'});
      /** fromDate control set error to disable btn */
      this.fromDateControl.setErrors({valid:false});
     }else{
      this.fromDateControl.setErrors({valid:true})
     }
  }
}
