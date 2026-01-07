import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import {animate,style,transition,trigger} from '@angular/animations';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { ApiService } from 'src/app/home/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
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
  loggedInUserCompanyCode:any = JSON.parse(sessionStorage.getItem('companyCode') || '');
  maxDate:Date = new Date(); // current date
  minDate:Date; // bill lock date
  plantCode:any = sessionStorage.getItem('plantcode');
  constructor(
    private messageService:MessageService,
    private loader:LoaderserviceService,
    private apiService:ApiService,
    private modalService:NgbModal,
  ) { }

  ngOnInit(): void {
    /** get bill lock date based n logged in user */
    this.getLockDateByCategory();
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
          console.log('TRAINEE DATA:',response);
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
      confirmation:true, // default value
    }
    console.log('FORM DATA:',data);
    /** LOP apply API call */
    this.apiService.applyTraineeLopByHR(data).subscribe({
      next: (response:any) => {
        console.log('RESPONSE:',response);
        /** checking if the trainee already present */
        if(response?.present_type){
          const confirmModalRef = this.modalService.open(ConfirmationComponent,{centered:true});
          /** passing confirmation function to ConfirmComponent instance */
           confirmModalRef.componentInstance.confirmFunction = () => this.confirmationByHR();
          /** passing confirmation text to ConfirmComponent instance */
           confirmModalRef.componentInstance.confirmText = response.message + ' ' + 'are you sure to proceed?';
        }
        /** checking if lop is already applied */
        else if(!response?.status){
          this.messageService.add({severity:'info',summary:response?.message});
        }
        /** lop applied status */
        else if(response?.status){
          this.messageService.add({severity:'info',summary:`LOP successfully applied for trainee: ${this.userEnteredGenId} on ${data?.att_date}`});
          /** reset data */
          this.resetData();
        }
      },
      error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message});
      }
    })
    
  }

  /** 
   * confirmation function if trainee present on the day
   * @property {*} userEnteredGenId
   * @property {*} traineeData
   * @property {*} loggedInUserID
   * @property {*} lopReason
   * @property {*} loggedInUserCompanyCode
   * */
  confirmationByHR(){
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
      confirmation:false, // HR confirms to apply on the present day
    }
    console.log('CONFIRM DATA:',data);
    /** LOP apply API call */
    this.apiService.applyTraineeLopByHR(data).subscribe({
      next: (response:any) => {
        console.log('RESPONSE:',response);
        if(response?.status){
          this.messageService.add({severity:'info',summary:`LOP successfully applied for trainee: ${this.userEnteredGenId} on ${data?.att_date}`});
          /** reset data */
          this.resetData();
        }
      },
      error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message});
      }
    })
  }

  /** 
   * reset data after lop applied for trainee
   * @property {*} userEnteredGenId
   * @property {*} traineeData
   * @property {boolean} showTraineeDetails
   * @property {*} lopReason
   */
  resetData(){
    this.showTraineeDetails = false;
    this.lopDate = null;
    this.userEnteredGenId = null;
    this.traineeData = null;
    this.lopReason = null;
  }
  /** 
   * get lock date for min calendar date
   * @property {Date} minDate
   * @property {*}  loggedInUserID
   */
  getLockDateByCategory(){
    this.apiService.getlockdateByCategory('T').subscribe({
      next: (response:any) => {
        console.log('LOCK DATE:',response);
        if(response?.date){
          /** set min date for calendar */
          this.minDate = moment(response?.date).add(1,'days').toDate();
          console.log('MIN DATE:',this.minDate)
        }else{
          this.messageService.add({severity:'warn',summary:`There is no Lock Date found for your plant (${this.plantCode}) !`});
          this.minDate = new Date(); // set to handle error
        }
      },
      error: (error:any) =>{
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    })
  }
}
