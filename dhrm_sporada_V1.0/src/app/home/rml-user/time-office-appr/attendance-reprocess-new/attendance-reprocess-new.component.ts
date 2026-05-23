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
    /** cummulative report filter form */
          this.attendanceReprocessForm = this.fb.group({
            plantCode: new UntypedFormControl(''),
            payrollArea: new UntypedFormControl('', Validators.required),
            fromDate: new UntypedFormControl(),
            toDate: new UntypedFormControl(),
            genId: [null,Validators.pattern(/\S+/)],
            attendanceReprocess:['Y',Validators.required]
          });
  }

  ngOnInit(): void {
    /** get plants */
    this.getPlants();
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
              this.openStatusModal(response)
              this.attendanceReprocessForm.reset();
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
      * @returns {date}
       */
      getMinDate():Date{
        return new Date(this.attendanceReprocessForm.value.fromDate)
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
}
