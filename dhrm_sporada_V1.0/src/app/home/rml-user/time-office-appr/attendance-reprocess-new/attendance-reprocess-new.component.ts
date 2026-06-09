import { Component, OnInit } from '@angular/core';
import { ClamAPIService } from 'src/app/new-contractor-mod/clam-api.service';
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';
import { UntypedFormControl, UntypedFormBuilder,Validators, FormGroup} from '@angular/forms';
import moment from 'moment';
import { Utility } from 'src/app/utils/utils';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { ReturnStatement } from '@angular/compiler';
import { validateBasis } from '@angular/flex-layout';

@Component({
  selector: 'app-attendance-reprocess-new',
  templateUrl: './attendance-reprocess-new.component.html',
  styleUrls: ['./attendance-reprocess-new.component.css']
})

export class AttendanceReprocessNewComponent implements OnInit {

  attendanceReprocessForm:FormGroup;
  all:any;
  userDetails:any;
  plantData:any = [];
  payrollAreaData:any = [];
  cummulativeReportData:any = [];
  isAdmin:any = JSON.parse(sessionStorage.getItem('isadmin') || '');
  isHr:boolean;
  isHrApprover:any;
  lastBillLokedDate:Date;  
  userPlantCode:any = sessionStorage.getItem('plantcode');
  toMinDate:Date;
  reprocessTable:any = [
    {label:'Attendance Table',value:'Y'},
    {label:'Punch Table',value:'N'}
  ]
  constructor(
    private clamApiService:ClamAPIService,
    private apiService:ApiService,
    private messageService:MessageService,
    private fb: UntypedFormBuilder,
    protected utils:Utility,
    private modalService:NgbModal,
    protected loader:LoaderserviceService,
  ) { 
    /** attendance filter form */
          this.attendanceReprocessForm = this.fb.group({
            plantCode: new UntypedFormControl(this.userPlantCode),
            payrollArea: new UntypedFormControl('', Validators.required),
            fromDate: new UntypedFormControl(new Date(), Validators.required),
            toDate: new UntypedFormControl(new Date(), Validators.required),
            genId: new UntypedFormControl(null,[Validators.pattern(/\S+/)]),
            attendanceReprocess:['Y',Validators.required]
          });
  }

  ngOnInit(): void {
    /** logged in user details */
    let details = sessionStorage.getItem("all");
      if (details != null) {
        this.all = JSON.parse(details);
        this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
      }
      /** setting required restrictions */
      this.userPlantCode = this.all.plant_code;
      this.isHr = this.all.Is_HR;
      this.isHrApprover =  this.all.Is_HRAppr;
    /** get plants */
    this.getPlants();
    /** get payroll area */
    this.getPayrollAreaByPlant(this.userPlantCode);

    

    /** gen id validation based on the user role */
    if (this.isAdmin) {
      this.attendanceReprocessForm.get('genId')?.removeValidators(Validators.required);
    } else if(this.isHr || this.isHrApprover) {
      this.attendanceReprocessForm.get('genId')?.addValidators(Validators.required);
    }
    this.attendanceReprocessForm.get('genId')?.updateValueAndValidity();
  }

  /** get plant API */
  getPlants(){
    this.clamApiService.getPlant().subscribe({
      next:(response:any) => {
        console.log('response:',response);
        this.plantData = response;
      },
      error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    })
  }
   
       /** get payroll area by plant code
       * @property {UntypedForm} form.plantCode
       * @param {boolean} onComponentInit to get report data with default payrollArea
       */
      getPayrollAreaByPlant(onComponentInit:boolean){
        const plantCode:any = this.attendanceReprocessForm.value.plantCode;
        // console.log(plantCode)
        this.apiService.getPayrollAreaByPlantcode(plantCode).subscribe({
          next: (response) => {
            this.payrollAreaData = response;
            console.log('PAYROLL AREA:',this.payrollAreaData);
          },
          error: (error:any) => {
            console.error('ERROR:',error);
            this.payrollAreaData = [];
            this.messageService.add({severity:'error',summary:error?.error?.message})
          }
        })
      }
  
      /** format js object date using moment for api 
       * @function moment used to format the js date object
       * @param {*} formPropery
       * @param {*} date js date obj
       * @var formattedValue has formatted date based on form property
      */
  
      formatDateAndSetFormProperty(date:any,formPropery:any){
        console.log(date)
        let formattedValue:any;
        if(formPropery == 'month'){
          formattedValue = moment(date).format('MMMM') // returns month number
        }else{
          formattedValue = moment(date).format('YYYY') // returns year
        }
        this.attendanceReprocessForm.controls[`${formPropery}`].setValue(formattedValue);
      }
  
      /** reporcess attendance
       * @property {UntyperForm} form.value
       * @var formattedFromDate user selected formatted  formattedFromDate
       * @var formattedToDate user selected formatted formattedToDate
      */
      reprocessAttendance(){
        /** format from and to date */
        const formattedFromDate = moment(this.attendanceReprocessForm.value.fromDate).format('YYYY-MM-DD');
        const formattedToDate = moment(this.attendanceReprocessForm.value.toDate).format('YYYY-MM-DD');
        console.log({formattedFromDate,formattedToDate});
        const formData = {...this.attendanceReprocessForm.value, fromDate:formattedFromDate,toDate:formattedToDate}
        console.log(' FORMATTED FORM DATA', formData);
        /**
         * reprocess attendance API
         * @param {*} formData
         */
        this.clamApiService.reprocessAttendance(formData).subscribe({
          next: (response:any) => {
            console.log('response:',response);
            if(response.success && response?.data.length !== 0){
              this.openStatusModal(response);
              /** user based form reset */
              if(this.isAdmin){
                this.attendanceReprocessForm.reset();
              }
              else if(this.isHr || this.isHrApprover){
                this.attendanceReprocessForm.reset({
                  plantCode:this.userPlantCode,
                  payrollArea: this.payrollAreaData[0]?.PayrollArea,
                  fromDate: new Date(),
                  toDate: new Date(),
                  genId: '',
                  attendanceReprocess:'Y'
                })
              }
            } else if(response?.success && response?.data.length == 0){
              this.messageService.add({severity:'warn',summary:'No data to reprocess!'})
            }
            else{
              this.messageService.add({severity:'info',summary:response?.message});
            }
          },
          error: (error:any) => {
            console.error('REPROCESS API ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.error?.message});
          }
        })
      }

      /** 
       * get min date based on the selected from date
       */
      getMinDate(){
       this.toMinDate =  new Date(this.attendanceReprocessForm.value.fromDate);
       this.attendanceReprocessForm.controls['toDate'].setValue('')
      }

      /**
       * export json data to excell
       * @property {*} utils
       */
      exportData(data:any){
        this.utils.jsonToExcellExport(data,this.attendanceReprocessForm.value.plantCode,'reprocessed_data')
      }

   /** 
   * open status modal
   * @param apiResponse
   * @param totalDataCount
   */
  openStatusModal(apiResponse:any){
    const confirmModalRef = this.modalService.open(ConfirmationComponent, {centered:true});
    confirmModalRef.componentInstance.confirmFunction = () => this.exportData(apiResponse?.data);
    /** modal text */
    confirmModalRef.componentInstance.confirmText = `${apiResponse?.message}. Click Yes to download data.`
    console.log('modal opened...');
  }

  isPlantDisabled():boolean{
    let isDisabled:boolean = false;
    if(this.isAdmin){
      isDisabled = false;
    }
    else if(this.isHr || this.isHrApprover){
      isDisabled = true;
    } 
    return isDisabled;
  }
}
