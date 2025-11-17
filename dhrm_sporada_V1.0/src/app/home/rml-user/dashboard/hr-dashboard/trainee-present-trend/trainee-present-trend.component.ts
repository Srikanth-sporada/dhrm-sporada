import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder,UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { Utility } from 'src/app/utils/utils';
/**
 * @export
 * @class TraineePresentTrendComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-trainee-present-trend',
  templateUrl: './trainee-present-trend.component.html',
  styleUrls: ['./trainee-present-trend.component.css']
})
export class TraineePresentTrendComponent implements OnInit {

  filterForm:UntypedFormGroup;
  /** current data - 30 days */
  initialFromDate:any = moment().subtract(31,'days').toDate();
  /** current date */
  initialToDate:any =  new Date();
  plantOptions:any;
  categoryOptions:any;
  workContractOptions:any;
  companyCode:any = JSON.parse(sessionStorage.getItem('companyCode') || '');
  lineChartData:any = [{
  1: 87,
  2: 142,
  3: 65,
  4: 109,
  5: 98,
  6: 120,
  7: 76,
  8: 133,
  9: 91,
  10: 115,
  11: 68,
  12: 150,
  13: 84,
  14: 102,
  15: 73,
  16: 125,
  17: 96,
  18: 138,
  19: 80,
  20: 111,
  21: 69,
  22: 145,
  23: 88,
  24: 100,
  25: 132,
  26: 77,
  27: 119,
  28: 93,
  29: 140,
  30: 82,
  31: 106
}]
  lineChartOptions:any;

  constructor(
    private formBuilder:UntypedFormBuilder,
    private apiService:ApiService,
    private messageService:MessageService,
    private utils:Utility,
  ) { 
    this.filterForm = formBuilder.group({
      fromDate:[this.initialFromDate],
      toDate:[this.initialToDate],
      plant:[''],
      traineeCategory:[],
      workContract:[]
    });
    /** line chart initilization */
    this.initChartConfig();
  }

  ngOnInit(): void {
    this.getPlantsByCompanyCode();
    /** get present trend data */
    this.getTraineePresentTrendData();
    console.log(this.initialFromDate,this.initialToDate, this.companyCode);
    
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
    console.log('asap')
  }
  /** get trainee contract type 
   * @property {*} workContractOptions
  */
  getworkContract(){
    console.log('asap')
  }

  /** 
   * Get trainee present trend data
   * @property {*} filterForm
   */

  getTraineePresentTrendData(){
    /** date format */
    const filterFormFromDate = this.filterForm.value.fromDate;
    const filterFormToDate = this.filterForm.value.toDate;
    this.filterForm.controls['fromDate'].setValue(moment(filterFormFromDate).format('YYYY-MM-DD'));
    this.filterForm.controls['toDate'].setValue(moment(filterFormToDate).format('YYYY-MM-DD')); 
    console.log('Filter Form',this.filterForm.value);
  }
  
  /** 
   * init configuration
   * @property {*}  utils used to extract keys and values for chart data & labels
   * @property {*} lineChartData data from api {day:present_type}
   * 
   */
  initChartConfig(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--gray-700');
        const bgColor = documentStyle.getPropertyValue('--blue-300')
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        this.lineChartData = {
            labels: this.utils.extractKeys(this.lineChartData),
            datasets: [
                {
                    label: 'Present',
                    fill: true,
                    backgroundColor: bgColor,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    pointBackgroundColor: textColor,
                    yAxisID: 'y',
                    tension: 0.4,
                    data: this.utils.extractValues(this.lineChartData),
                },
            ]
        };
        
        this.lineChartOptions= {
            stacked: false,
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                  title:{
                    display:true,
                    text:'Day',
                  },
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                   title:{
                    display:true,
                    text:'Sum Of Present Type'
                  },
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y1: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: surfaceBorder
                    }
                }
            }
        };
  }
}
