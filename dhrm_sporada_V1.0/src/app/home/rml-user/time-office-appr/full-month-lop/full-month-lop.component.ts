import { Component, OnInit } from '@angular/core';
import {animate,style,transition,trigger} from '@angular/animations';
import { ApiService } from 'src/app/home/api.service';
import { Validators,UntypedFormBuilder} from '@angular/forms';
import { MessageService } from 'primeng/api';
import moment from 'moment'
import { LoaderserviceService } from 'src/app/loaderservice.service';

@Component({
  selector: 'app-full-month-lop',
  templateUrl: './full-month-lop.component.html',
  styleUrls: ['./full-month-lop.component.css'],
  animations: [
        trigger('slowAnimate', [
            transition(':enter', [style({ opacity: '0' }), animate(500)]),
            transition(':leave', [style({ opacity: '1' }), animate(500, style({ opacity: '0' }))]),
        ])
    ]
})

export class FullMonthLopComponent implements OnInit {

  employeeId:any = sessionStorage.getItem('emp_id');
  fullMonthLopForm:any;
  traineeData:any = [];
  plantCode:any = sessionStorage.getItem('plantcode');
  lastProcessedBillDate:any;
  traineeLopMonthData:any = [];

  constructor(
    private service:ApiService, 
    private fb : UntypedFormBuilder, 
    private messageService:MessageService,
    public loader:LoaderserviceService) {
  /**
   * Apply Full Month LOP form
   * by default applied by value is set for form default value
   * @type {*}
   * @memberof FullMonthLopComponent
   * @property {*} employeeId applied by default value
   */
    this.fullMonthLopForm = this.fb.group({
      gen_id:['', [Validators.required,Validators.pattern(/\S+/)]],
      payroll_area: [''],
      plantcode:[''],
      lop_month:['',Validators.required],
      reason:['',[Validators.required,Validators.pattern(/\S+/)]],
      applied_by:[this.employeeId],
    })
   }

  ngOnInit(): void {
   this.getFullMonthLopDataForEmployee();
  }

  /**
   * get data by gen id
   * @property {*} traineeData has trainee data
   * @property {*} fullMonthLopForm.gen_id 
   * @var data api call data
   */
  searchTraineeByGenId(){
    /** search data */
    const data = {
      genId:this.fullMonthLopForm.value.gen_id,
      plantCode:this.plantCode
    }
    console.log('Data:',data);
    this.service.getTraineeDataForFML(data).subscribe({
      next: (response:any) => {
        if(response.length){
          this.traineeData = response;
          /** get last processed bill date */
          this.getLastBillProcessedDate(response[0]?.plant_code, this.fullMonthLopForm.value.gen_id);
          console.log(response);
        }else{
          this.messageService.add({severity:'warn',summary:'Gen ID not found!'})
        }
      },
      error: (error) => {
        console.error('ERROR:',error)
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }

  /**
   * @property {*} lastProcessedBillDate js date object for calander minDate prop
   * @var {*} lastProcessedBillDate formatted bill date
   * @param {*} plantCode
   * @param {*} gen_id
   */
  getLastBillProcessedDate(plantCode:any, gen_id:any){
    this.service.getLastProcesedBill(plantCode,'T', gen_id).subscribe({
      next: (response:any) => {
        this.lastProcessedBillDate = new Date(response?.date);
        const formattedLockDate = moment(response?.date).format('YYYY-MM-DD')
        console.log('FORMATTED LOCK DATE', formattedLockDate);
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error?.error?.message});
        console.error('ERROR:',error)
      }
    })
  }

  /**
   * apply full month lop
   * @var {*} formattedLopMonth yy-mm-dd
   * @property {*} fullMonthLopForm
   * @property {*} service
   */
  applyFullMonthLOP(){
    /** formatted lop_month */
    const formattedLopMonth = moment(this.fullMonthLopForm.value.lop_month).format('YYYY-MM-DD');
    /** lop form update */
    this.fullMonthLopForm.controls['payroll_area'].setValue(this.traineeData[0]?.payrollArea);
    this.fullMonthLopForm.controls['plantcode'].setValue(this.traineeData[0]?.plant_code);
    this.fullMonthLopForm.controls['lop_month'].setValue(formattedLopMonth);
    console.log('LOP FORM',this.fullMonthLopForm.value);
    
    this.service.applyfullMonthLOP(this.fullMonthLopForm.value).subscribe({
      next:(response:any) => {
        console.log(response);
        this.messageService.add({severity:'info',summary:response?.message});
        /** refresh data */
        this.getFullMonthLopDataForEmployee();
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary:error?.error?.message});
        console.error('ERROR',error);
      }
    });
  }

  /**
   * get LOP data for employee
   * @property {*} traineeLopMonthData
   */
  getFullMonthLopDataForEmployee(){
    this.service.getLOPDataByEmployeeID(this.employeeId).subscribe({
      next: (response:any) => {
        if(response.length){
          this.traineeLopMonthData = response;
          console.log(response);
        }else{
          this.messageService.add({severity:'warn',summary:'No Data Found'});
        }
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error?.error?.message});
        console.error('ERROR',error);
      }
    })
  }
}
