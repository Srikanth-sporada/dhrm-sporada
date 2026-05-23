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
   plantCode:any = sessionStorage.getItem('plantcode') || '';
   isAdmin:any = JSON.parse(sessionStorage.getItem('isadmin') || '');
   plantOptions:any = [];
   categoryOptions:any= [];
   workContractOptions:any = [];
   traineeHeadCountSummaryData:any = [
    { group: 'VENDOR-NAPS', female: 134, male: 266 },
    { group: 'VENDOR-IL&FS', female: 0, male: 1 },
    { group: 'OPERATOR', female: 0, male: 487 },
    { group: 'DET', female: 0, male: 1 },
    { group: 'NEEM', female: 23, male: 31 },
    { group: 'NAPS', female: 3, male: 5 },
    { group: 'PT', female: 0, male: 1 },
    { group: 'GAT', female: 0, male: 1 },
    { group: 'Dly.Trg.Scheme', female: 0, male: 1 },
    { group: 'CLA', female: 0, male: 1 },
    { group: 'CAS', female: 0, male: 1 },
    { group: 'ACT APP', female: 0, male: 1 }
  ];

   companyCode:any = JSON.parse(sessionStorage.getItem('companyCode') || '');
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

      /** checking isadmin */
      if(this.isAdmin){
        this.plantCode = '';
      }
      /** form init */
     this.filterForm = formBuilder.group({
      fromDate:[this.initialFromDate],
      toDate:[this.initialToDate],
      plant:[this.plantCode],
      traineeCategory:[],
      workContract:[]
      });
     }

  ngOnInit(): void {
     this.getPlantsByCompanyCode();
    /** get head count summary */
    this.getTraineeHeadCountSummary()
    console.log(this.initialFromDate,this.initialToDate, this.companyCode);
    console.log('isAdmin:',this.isAdmin);
    console.log('plant:',this.plantCode);
  }

  logPageEvent(event:any){
    console.clear();
    console.log('PAGEGINATION EVENT',event)
  }
  /**
     * @memberof TraineePresentTrendComponent
     * @property {*} plantOptions
     */
    getPlantsByCompanyCode(){
      this.apiService.getPlantsByCompanyCode(this.companyCode).subscribe({
        next: (response:any) => {
          console.log('plant Data:',response);
          this.plantOptions = response;
          this.plantOptions.unshift({plant_name:"All",plant_code:''})
        },
        error: (err:any) => {
          console.error('ERROR:',err);
          this.messageService.add({severity:'error',summary:err?.error?.message})
        }
      })
    }
  
    /** get trainee apperentice type
     * @property {*} categoryOptions
     */
    getCategory(){
      console.log('asap');
    }
    /** get trainee contract type 
     * @property {*} workContractOptions
    */
    getworkContract(){
      console.log('asap');
    }
  
    /** 
     * Get trainee head count summary data
     *  Structur: { group: 'VENDOR-NAPS', female: 134, male: 266 , total:120}
     * @property {*} filterForm
     */
  
    getTraineeHeadCountSummary(){
      /** date format */
      const filterFormFromDate = this.filterForm.value.fromDate;
      const filterFormToDate = this.filterForm.value.toDate;
      this.filterForm.controls['fromDate'].setValue(moment(filterFormFromDate).format('YYYY-MM-DD'));
      this.filterForm.controls['toDate'].setValue(moment(filterFormToDate).format('YYYY-MM-DD')); 
      console.log('Filter Form',this.filterForm.value);
    }

    /** get function for total male & female count
     * @var {*} totalFemale
     * @var {*} totalMale
     * @returns {*}
     */
    get totalRow():any {
    const totalFemale = this.traineeHeadCountSummaryData.reduce((sum:any, e:any) => sum + e.female, 0);
    const totalMale = this.traineeHeadCountSummaryData.reduce((sum:any, e:any) => sum + e.male, 0);
    return { group: 'Total', female: totalFemale, male: totalMale };
  }

}
