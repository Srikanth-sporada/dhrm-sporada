import { Component, OnInit} from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder,Validators, FormGroup} from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { Utility } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-cummulative-report',
  templateUrl: './cummulative-report.component.html',
  styleUrls: ['./cummulative-report.component.css'],
})
export class CummulativeReportComponent implements OnInit {

    cummulativeReportForm: any;
    noDataImgPath =environment?.noDataImgPath;
    hideCumulativeReport:boolean = environment.hideCumulativeReport;
    all:any;
    userDetails:any;
    companyData:any = [];
    plantData:any = [];
    payrollAreaData:any = [];
    cummulativeReportData:any = [];
    isAdmin:any = JSON.parse(sessionStorage.getItem('isadmin') || '');
    companyCode:any = JSON.parse(sessionStorage.getItem('companyCode') || '');
    plantCode:any = sessionStorage.getItem('plantcode');
    
    constructor(
      private fb: UntypedFormBuilder, 
      public loader: LoaderserviceService, 
      private messageService:MessageService, 
      private apiService:ApiService, 
      public utility:Utility) {
      /** cummulative report filter form */
      this.cummulativeReportForm = this.fb.group({
        companyCode: new UntypedFormControl(this.companyCode),
        plantCode: new UntypedFormControl(this.plantCode),
        payrollArea: new UntypedFormControl('', Validators.required),
        month: new UntypedFormControl(new Date()),
        year: new UntypedFormControl(new Date()),
        genId: [null,Validators.pattern(/\S+/)],
      });
    }

    ngOnInit(): void {
      let details = sessionStorage.getItem("all");
      if (details != null) {
        this.all = JSON.parse(details);
        this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
      }
      /** get company & plant & payroll area */
        this.getCompanyData();
        this.getplantByCompanyCode();
        /** passing true for component life cycle call */
        this.getPayrollAreaByPlant(true);
    }

    /** Export HTML data to excel sheet
     * Table {HTMLTableElement} ID  #table
     */
    exportexcel() {
      const x = document.querySelector("#table")
      const ws = XLSX.utils.table_to_sheet(x);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Table');
      XLSX.writeFile(wb, 'cumulativereport.xlsx');
      this.messageService.add({severity:'info',summary:'Data Exported!'});
    }

    /** get company data for filter dropdown 
     * @property {*} companyData has companylist
    */
    getCompanyData(){
      this.apiService.companyshow().subscribe({
        next: (reponse:any) => {
          this.companyData = reponse;
        },
        error: (error:any) => {
          console.log('ERROR:',error);
          this.messageService.add({severity:'error',summary:error.message});
        }
      })
    }

    /** get plant data by company code
     * @property {UntypedForm} form.companyCode
     */

    getplantByCompanyCode(){
      let companyCode = this.isAdmin ? this.cummulativeReportForm.value.companyCode : this.companyCode;
      this.apiService.getPlantByCompanyCode(companyCode).subscribe({
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
      let plantCode = this.isAdmin ? this.cummulativeReportForm.value.plantCode : this.plantCode;
      this.apiService.getPayrollAreaByPlantcode(plantCode).subscribe({
        next: (response) => {
          this.payrollAreaData = response;
          console.log('PAYROLL AREA:',this.payrollAreaData);
          /** checking ngOnInit lifecycle */
          if(onComponentInit){
           /** setting default payrollArea[0] */
           this.cummulativeReportForm.controls['payrollArea'].setValue(this.payrollAreaData[0]?.PayrollArea);
            /** get cumulative report data */
           this.filterCummulativeReport();
          }
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
      this.cummulativeReportForm.controls[`${formPropery}`].setValue(formattedValue);
    }

    /** filter cummulative report 
     * @property {UntyperForm} form.value
     * @var formattedMonth user selected formatted  formattedMonth
     * @var formattedYear user selected formatted formattedYear
     * @param {boolean} onComponentInit to get report data with default payrollArea
    */
    filterCummulativeReport(){
      // console.log({mo:this.cummulativeReportForm.value.month,yy:this.cummulativeReportForm.value.year})
      const formattedMonth = moment(this.cummulativeReportForm.value.month).format('MM');
      const formattedYear = moment(this.cummulativeReportForm.value.year).format('YYYY');
      console.log({formattedMonth,formattedYear});
      const formData = {...this.cummulativeReportForm.value,month:formattedMonth,year:formattedYear}
      console.log(' FORMATTED FORM DATA', formData);
      /**
       * get cumulative report data API
       * @param {*} formData
       */
      this.apiService.getCumulativeReportData(formData).subscribe({
        next: (response:any) => {
         this.cummulativeReportData = response;
         console.log('REPORT DATA:',response);
        },
        error: (error:any) => {
          console.error('ERRR:',error);
          if(error?.error?.error){
           this.messageService.add({severity:'error',summary:error?.error?.error});
          }else{
            this.messageService.add({severity:'error', summary:error?.error?.message})
          }
        }
      })
    }

    /** 
     * handle keyborad event
     */
    onEnterPress(event:KeyboardEvent){
      console.log('key:',event.key , event.code, event.detail);
    }
}
