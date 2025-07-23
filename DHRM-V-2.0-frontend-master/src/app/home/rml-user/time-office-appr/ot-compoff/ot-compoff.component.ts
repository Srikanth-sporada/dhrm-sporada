import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {CoffotpopupComponent} from './coffpopup/coffpopup.component'
import * as XLSX from   'xlsx'
import { CoffDetailsComponent } from "../coff-details/coff-details.component";
import { ExcessHoursDetailsComponent } from '../excess-hours-details/excess-hours-details.component';

@Component({
  selector: 'app-ot-compoff',
  templateUrl: './ot-compoff.component.html',
  styleUrls: ['./ot-compoff.component.css']
})
export class OtCompoffComponent implements OnInit {

  data: any;
  lines: any;
  selectedLine: any = "";
  downlodData:any;
  constructor(private apiService: ApiService,private matdailog:MatDialog) {}

  ngOnInit() {
    this.getData();
    this.apiService.getlineBydept().subscribe((response: any) => {
      this.lines = response;
    
    });
  }

  getData() {
    this.apiService.getApprovedExcessHours().subscribe((response: any) => {
      if (response.status == "failed") {
        alert(response.message);
      } else {
        console.log(response.data);
        this.downlodData = response.data
        this.data = response.data.map((element: any) => {
          return { ...element, approvedHr: null, reason: "" };
        }).filter((element:any)=>{
          return element.bal !=0
        });;

        console.log(this.data);
      }
    });
  }

  openDailog(details:any){
    this.matdailog.open(CoffotpopupComponent,{
      data:details
    }).afterClosed().subscribe((data:any)=>{
      this.getData()
    })
  }
  exportexcel() {
   
    var ws = XLSX.utils.json_to_sheet(this.downlodData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `OT report.xlsx`);
  }
   
  openCoffDeatils(data:any){
    this.matdailog.open(CoffDetailsComponent,{
      data:data
    })
  }

  openExcessHourDetais(data:any){
    this.matdailog.open(ExcessHoursDetailsComponent,{
      data:data
    })
  }
}
