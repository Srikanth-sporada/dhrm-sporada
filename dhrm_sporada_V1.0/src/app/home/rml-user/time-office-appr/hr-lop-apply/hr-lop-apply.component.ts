import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import {animate,style,transition,trigger} from '@angular/animations';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { ApiService } from 'src/app/home/api.service';
@Component({
  selector: 'app-hr-lop-apply',
  templateUrl: './hr-lop-apply.component.html',
  styleUrls: ['./hr-lop-apply.component.css'],
   animations: [
          trigger('slowAnimate', [
              transition(':enter', [style({ opacity: '0' }), animate(500)]),
              transition(':leave', [style({ opacity: '1' }), animate(500, style({ opacity: '0' }))]),
          ])
      ]
})
export class HrLopApplyComponent implements OnInit {

  showTraineeDetails:boolean = false;
  userEnteredGenId:any;
  traineeData:any;
  userPlant:any =  sessionStorage.getItem('plantcode');
  lopDate:any;
  lopReason:any;
  loggedInUserID = sessionStorage.getItem('emp_id');
  loggedInUserCompanyCode:any = JSON.stringify(sessionStorage.getItem('companyCode'));
  constructor(
    private messageService:MessageService,
    private loader:LoaderserviceService,
    private apiService:ApiService,
  ) { }

  ngOnInit(): void {
  }

   /** 
   * search trainee by gen id
   * get trainee leave balance and eligibility
   * @property {*} traineeData
   * @property {*} showTraineeDetails
   * @property {*} userPlant
   */
  searchTraineeByGenId(){
    const data = {
      genId:this.userEnteredGenId,
      plantCode:this.userPlant
    }
    console.log('TRAINEE SEARCH DATA:',data);
    this.apiService.getTraineeDataForFML(data).subscribe({
      next: (response:any) => {
        if(response.length){
          this.traineeData = response;
          /** set leave details to true */
          this.showTraineeDetails = true;
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
   * HR LOP apply function
   * @property {*} userEnteredGenId
   * @property {*} traineeData
   * @property {*} loggedInUserID
   * @property {*} lopReason
   * @property {*} loggedInUserCompanyCode
   */
   applyLopForTrainee(){
    /** date check */
    if(!this.lopDate){
     this.messageService.add({severity:'warn',summary:'Select LOP Date For Trainee'});
     return;
    }
    /** constructing API data */
    const data = {
      gen_id:this.userEnteredGenId,
      att_date:moment(this.lopDate).format('YYYY-MM-DD'),
      plant_code:this.traineeData[0]?.plant_code,
      plant_name:this.traineeData[0]?.plant_name,
      payroll_area:this.traineeData[0]?.payrollArea,
      name:this.traineeData[0]?.fullname,
      apply_by:this.loggedInUserID,
      reason:this.lopReason,
      apprentice_type:this.traineeData[0]?.apprentice_type,
      company_code:this.loggedInUserCompanyCode,
      confirmation:true, // default values
    }
    console.log('FORM DATA:',data);
    /** LOP apply API call */
    this.apiService.applyTraineeLopByHR(data).subscribe({
      next: (response:any) => {
        console.log('RESPONSE:',response);
        this.messageService.add({severity:'info',summary:response})
      },
      error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message});
      }
    })
    
  }
}
