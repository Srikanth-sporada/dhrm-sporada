import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import * as XLSX from 'xlsx'
import * as moment from 'moment'

@Component({
  selector: 'app-dept-att-report',
  templateUrl: './dept-att-report.component.html',
  styleUrls: ['./dept-att-report.component.css']
})
export class DeptAttReportComponent implements OnInit {
  from:any;
  to:any;
  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.from=moment().format("YYYY-MM-DD")
    this.to=moment().format("YYYY-MM-DD")
  }
  


  getData(){
    let data={
      from:this.from,
      to:this.to
    }
    this.apiService.getDeptReport(data).subscribe((response:any)=>{
      if(response.status='success'){
        this.exportexcel(response.data)
      }
    })
  }
  exportexcel(data: any) {
   
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `Atnd-report.xlsx`);
  }
}
