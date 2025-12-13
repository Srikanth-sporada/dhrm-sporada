import { Component, OnInit } from '@angular/core';
import {animate,style,transition,trigger} from '@angular/animations';
import { ClamAPIService } from 'src/app/new-contractor-mod/clam-api.service';
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';
import { Utility } from 'src/app/utils/utils';
import { UntypedFormControl, UntypedFormBuilder,Validators, FormGroup} from '@angular/forms';
import moment from 'moment';
import { environment } from 'src/environments/environment.prod';
import { LoaderserviceService } from 'src/app/loaderservice.service';

@Component({
  selector: 'app-hr-applied-leave-record',
  templateUrl: './hr-applied-leave-record.component.html',
  styleUrls: ['./hr-applied-leave-record.component.css'],
  animations: [
          trigger('slowAnimate', [
              transition(':enter', [style({ opacity: '0' }), animate(500)]),
              transition(':leave', [style({ opacity: '1' }), animate(500, style({ opacity: '0' }))]),
          ])
      ]
})
export class HrAppliedLeaveRecordComponent implements OnInit {

  userEnteredGenId:any;
  showLeaveRecord:boolean;
  traineeData:any;
  userPlant:any = sessionStorage.getItem('plantcode');
  leaveRecordData:any;
  leaveRecordForm:any;
  companyData:any;
  plantData:any;
  currentDate:Date = new Date;
  payrollAreaData:any;
  isAdmin:any = JSON.parse(sessionStorage.getItem('isadmin') || '');
  companyCode:any = JSON.parse(sessionStorage.getItem('companyCode') || '');
  plantCode:any = sessionStorage.getItem('plantcode');
  noDataImgPath:any = environment?.noDataImgPath;
  constructor(
    private apiService:ClamAPIService,
    private apiService2:ApiService,
    private messageService:MessageService,
    public utils:Utility,
    private fb:UntypedFormBuilder,
    public loader:LoaderserviceService,
  ) { 
     /** leave record filter form */
      this.leaveRecordForm = this.fb.group({
        companyCode: new UntypedFormControl(this.companyCode),
        plantCode: new UntypedFormControl(this.plantCode),
        payrollArea: new UntypedFormControl('', Validators.required),
        startDate: new UntypedFormControl(moment().subtract(15,'days').toDate()), // 15 days back
        endDate: new UntypedFormControl(new Date()),
        genId: [null,Validators.pattern(/\S+/)],
      });
  }

  ngOnInit(): void {
   /** get company & plant & payroll area */
        this.getCompanyData();
        this.getplantByCompanyCode();
        /** passing true for component life cycle call */
        this.getPayrollAreaByPlant(true);
  }

  /** 
   * search trainee by gen id
   * get trainee leave balance and eligibility
   * @property {*} traineeData
   * @property {*} showLeaveRecord
   * @property {*} userPlant
   */
  searchTraineeByGenId(){
    const data = {
      genId:this.userEnteredGenId,
      plantCode:this.userPlant
    }
    console.log('TRAINEE SEARCH DATA:',data);
    this.apiService2.getTraineeDataForFML(data).subscribe({
      next: (response:any) => {
        if(response.length){
          this.traineeData = response;
          /** set leave details to true */
          this.showLeaveRecord = true;
          console.log(response);
          /** get trainee leave records */
          this.getTraineeLeaveRecord(this.traineeData[0]?.gen_id);
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
   * get trainee leave records
   * @param genId
   * @property {*} leaveRecordData
   *  */
 getTraineeLeaveRecord(genId:any){
  this.apiService.getTrnLeave(genId).subscribe({
    next: (res:any) => {
      this.leaveRecordData = res;
      console.log(res);
    },
    error: (error:any) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.error})
    }
  })
 }

  /** get company data for filter dropdown 
     * @property {*} companyData has companylist
    */
    getCompanyData(){
      this.apiService2.companyshow().subscribe({
        next: (reponse:any) => {
          this.companyData = reponse;
        },
        error: (error:any) => {
          console.error('ERROR:',error);
          this.messageService.add({severity:'error',summary:error.message})
        }
      })
    }
    
    /** get plant data by company code
     * @property {UntypedForm} form.companyCode
     */
    getplantByCompanyCode(){
      let companyCode = this.isAdmin ? this.leaveRecordForm.value.companyCode : this.companyCode;
      this.apiService2.getPlantByCompanyCode(companyCode).subscribe({
        next: (response) => {
          this.plantData = response;
        },
        error: (error:any) => {
          /** setting plantData [] is error */
          console.error('ERROR:',error);
          this.plantData = [] ;
          this.messageService.add({severity:'error',summary:error.message});
        }
      })
    }

    /** get payroll area by plant code
     * @property {UntypedForm} form.plantCode
     * @param {boolean} onComponentInit to get report data with default payrollArea
     */

    getPayrollAreaByPlant(onComponentInit:boolean){
      let plantCode = this.isAdmin ? this.leaveRecordForm.value.plantCode : this.plantCode;
      this.apiService2.getPayrollAreaByPlantcode(plantCode).subscribe({
        next: (response) => {
          this.payrollAreaData = response;
          console.log('PAYROLL AREA:',this.payrollAreaData);
          /** checking ngOnInit lifecycle */
          if(onComponentInit){
           /** setting default payrollArea[0] */
           this.leaveRecordForm.controls['payrollArea'].setValue(this.payrollAreaData[0]?.PayrollArea);
            /** get cumulative report data */
           this.filterLeaveRecords();
          }
        },
        error: (error:any) => {
          console.error('ERROR:',error);
          this.payrollAreaData = [];
          this.messageService.add({severity:'error',summary:error?.error?.message})
        }
      })
    }

    /** filter cummulative report 
    * @property {UntyperForm} form.value
    * @var formattedStartDate user selected formatted  formattedMonth
    * @var formattedEndDate user selected formatted formattedEndDate
    * @param {boolean} onComponentInit to get report data with default payrollArea
    */
    filterLeaveRecords(){
          const formattedStartDate = moment(this.leaveRecordForm.value.startDate).format('YYYY-MM-DD');
          const formattedEndDate= moment(this.leaveRecordForm.value.endDate).format('YYYY-MM-DD');
          console.log({formattedStartDate,formattedEndDate});
          const formData = {...this.leaveRecordForm.value,startDate:formattedStartDate,endDate:formattedEndDate}
          console.log(' FORMATTED FORM DATA', formData);
          /**
           * get cumulative report data API
           * @param {*} formData
           */
          this.apiService.getHrAppliedLeaveRecord(formData).subscribe({
            next: (response:any) => {
             this.leaveRecordData = response;
             console.log('LEAVE RECORD:',response);
            },
            error: (error:any) => {
              console.error('ERROR:',error);
              this.messageService.add({severity:'error',summary:error?.error?.message})
            }
          })
    }
    
}
