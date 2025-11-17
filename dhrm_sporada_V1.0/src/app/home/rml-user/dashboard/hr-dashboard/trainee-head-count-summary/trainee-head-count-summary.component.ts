import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup } from '@angular/forms';
import { Utility } from 'src/app/utils/utils';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/home/api.service';
import moment from 'moment';

@Component({
  selector: 'app-trainee-head-count-summary',
  templateUrl: './trainee-head-count-summary.component.html',
  styleUrls: ['./trainee-head-count-summary.component.css']
})
export class TraineeHeadCountSummaryComponent implements OnInit {

   filterForm:UntypedFormGroup;
   initialFromDate:any = moment().subtract(31,'days').toDate()
   initialToDate:any = new Date();

   chartData = {
    labels: ['VENDOR-NAPS', 'VENDOR-IL&FS', 'OPERATOR', 'DET', 'NEEM', 'NAPS', 'PT', 'GAT', 'Dly.Trg.Scheme', 'CLA', 'CAS', 'ACT APP'],
    datasets: [
      { label: 'Male', backgroundColor: '#42A5F5', data: [266, 1, 487, 1, 31, 5, 1, 1, 1, 1, 1, 1] },
      { label: 'Female', backgroundColor: '#FF6384', data: [134, 0, 0, 0, 23, 3, 0, 0, 0, 0, 0, 0] }
    ]
  };

  chartOptions = {
    plugins: { legend: { position: 'top' } },
    responsive: true
  };


  constructor(
    private formBuilder:UntypedFormBuilder, 
    private messageService:MessageService, 
    private utils:Utility,
    private apiService:ApiService) {
      /** form init */
      this.filterForm = this.formBuilder.group({
        fromDate: [this.initialFromDate],
        toDate:[this.initialToDate],
        plantCode:['']
      })
     }

  ngOnInit(): void {
  }

}
