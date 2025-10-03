import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import * as XLSX from 'xlsx'
import * as moment from 'moment'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dept-att-report',
  templateUrl: './dept-att-report.component.html',
  styleUrls: ['./dept-att-report.component.css']
})
export class DeptAttReportComponent implements OnInit {
  from:any;
  to:any;
  all:any;
  userDetails:any;
  constructor(public apiService:ApiService, private messageService:MessageService) { }

  ngOnInit() {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.from=moment().format("YYYY-MM-DD")
    this.to=moment().format("YYYY-MM-DD")
  }
  


  getData(){
    let data={
      from: moment(this.from).format('YYYY-MM-DD'),
      to: moment(this.to).format('YYYY-MM-DD')
    }
    this.apiService.getDeptReport(data).subscribe((response:any)=>{
      if(response.status='success'){
        this.exportexcel(response.data)
      }else{
        this.messageService.add({severity:'warn',summary:'Something went wrong!'})
      }
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })
  }
  exportexcel(data: any) {
   
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `Atnd-report.xlsx`);
    this.messageService.add({severity:'info',summary:'Downloaded!'})
  }
}
