import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {CoffotpopupComponent} from './coffpopup/coffpopup.component'
import * as XLSX from   'xlsx'
import { CoffDetailsComponent } from "../coff-details/coff-details.component";
import { ExcessHoursDetailsComponent } from '../excess-hours-details/excess-hours-details.component';
import { MessageService,ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-ot-compoff',
  templateUrl: './ot-compoff.component.html',
  styleUrls: ['./ot-compoff.component.css']
})
export class OtCompoffComponent implements OnInit {

  data: any;
  lines: any;
  /** sesstion storage login details get getting line code */
  selectedLine:any;
  downlodData:any;
  all:any;
  userDetails:any;
  constructor(
    private apiService: ApiService,
    private matdailog:MatDialog,
    private messageService:MessageService,
  ) {}
  
  ngOnInit() {
    /** logged in user information */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getData();
    this.getLineByDept();
  }

  /**
   * get line by department
   */
  getLineByDept(){
      this.apiService.getlineBydept().subscribe((response: any) => {
      this.lines = response;
      this.lines.push({Line_Name:'All'});
      this.lines.reverse();
      /** line code need Line name */
      // this.selectedLine = this.all.line_code.toString();
      // console.log(this.selectedLine);
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  getData() {
    this.apiService.getApprovedExcessHours().subscribe((response: any) => {
      if (response.status == "failed") {
        alert(response.message);
        this.messageService.add({severity:'info',summary:response.message})
      } else {
        console.log(response.data);
        this.downlodData = response.data
        this.data = response.data.map((element: any) => {
          return { ...element, approvedHr: null, reason: "" };
        }).filter((element:any)=>{
          return element.bal !=0
        });

        console.log(this.data);
      }
    },(error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  // apply comp off dialog modal
  openDailog(details:any){
    this.matdailog.open(CoffotpopupComponent,{
      data:details
    }).afterClosed().subscribe((data:any)=>{
      this.getData();
    })
  }

  exportexcel() {
   
    var ws = XLSX.utils.json_to_sheet(this.downlodData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "comp-off");
    XLSX.writeFile(wb, `comp_off_report.xlsx`);
    this.messageService.add({severity:'info',summary:'Data Converted.'})
  }
  
  // open cmp off details
  openCoffDeatils(data:any){
    this.matdailog.open(CoffDetailsComponent,{
      data:data
    });
  }

  // dialog modal for excess hour details
  openExcessHourDetais(data:any){
    this.matdailog.open(ExcessHoursDetailsComponent,{
      data:data
    })
  }
}
