import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import {LoaderserviceService} from '../../loaderservice.service'
@Component({
  selector: 'app-transfer-posting',
  templateUrl: './transfer-posting.component.html',
  styleUrls: ['./transfer-posting.component.css']
})
export class TransferPostingComponent implements OnInit {

  fromDateControl = new FormControl();
  toDateControl = new FormControl();
  maxDate: Date;
  minDate: Date;
  constructor(private api : ClamAPIService,private dialog: MatDialog
    ,public loader: LoaderserviceService) { 

      this.maxDate = new Date();
      this.minDate = new Date(this.maxDate);
      this.minDate.setDate(this.maxDate.getDate() - 40);
  }

  ngOnInit(): void {
  }


  executeQuery() {
    const fromDate = this.formatDate(this.fromDateControl.value);
    const toDate = this.formatDate(this.toDateControl.value);

    console.log(`Executing query from ${fromDate} to ${toDate}`);

 this.api.transfer_post(fromDate,toDate).subscribe((res: any) =>{
  this.openAlertDialog(`${res.message}`)
  
  console.log(res.message)
  this.toDateControl.reset()
  this.fromDateControl.reset()
 },error =>{
  this.openAlertDialog(`${error}`)
  console.log(error)
})


  }

openAlertDialog(message: string): void {
  this.dialog.open(ToastComponent, {
    data: {
      icon: 'Check',
      message: message
    }
  });
}
 
   formatDate(inputDate: Date): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    return formattedDate;
  }

}
