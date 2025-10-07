import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ApiService } from 'src/app/home/api.service';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-trainee-apln-report',
  templateUrl: './trainee-apln-report.component.html',
  styleUrls: ['./trainee-apln-report.component.css'],
  
})
export class TraineeAplnReportComponent implements OnInit {

  dateForm:FormGroup
  progressValue: number = 0 ;
  excel: any;
  all:any;
  userDetails:any;

  constructor(private fb: UntypedFormBuilder, private dateAdapter: DateAdapter<Date>, private service: ApiService, private messageService:MessageService) {
    this.dateAdapter.setLocale('en-GB');

    this.dateForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      plantcode :[sessionStorage.getItem('plantcode')]
    });
  }

  interval:any


  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
  }

  submit()
  {
    this.progressValue = 0
    this.service.trainee_report(this.dateForm.value)
    .subscribe(
      {
        next: (res:any)=>{
          console.log(res);
          this.excel = res;
          this.progressValue = 100;
          this.exportexcel();
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({severity:'error',summary:error.message})
        }
      }
    )

    const interval = setInterval(() => {
      if (this.progressValue >= 100) {
        clearInterval(interval);
      } else {
        this.progressValue += 1;
      }
    }, 500);
  }

  exportexcel(): void
{

  var ws = XLSX.utils.json_to_sheet(this.excel);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "People");
  XLSX.writeFile(wb,"Trainee-report.xlsx");
  this.messageService.add({severity:'info',summary:'Data Downloaded!'})
}

}
