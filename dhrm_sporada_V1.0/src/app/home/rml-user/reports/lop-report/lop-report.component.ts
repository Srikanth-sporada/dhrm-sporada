import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder,Validators } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { Utility } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-lop-report',
  templateUrl: './lop-report.component.html',
  styleUrls: ['./lop-report.component.css']
})
export class LopReportComponent implements OnInit {

     lopReportForm: any
     all:any;
     noDataImgPath:any = environment?.noDataImgPath
     userDetails:any;
     companyData:any = [];
     plantData:any = [{plant_code:'',plant_name:'All'}];
     payrollAreaData:any = [{PayrollArea:'All'}];
     reportDataObjectKeys:any;
     lopReportData:any = [];
     isAdmin:any = JSON.parse(sessionStorage.getItem('isadmin') || '');
     companyCode:any = JSON.parse(sessionStorage.getItem('companyCode') || '');
     plantCode:any = sessionStorage.getItem('plantcode');
     constructor(
      private fb: UntypedFormBuilder, 
      public loader: LoaderserviceService, 
      private messageService:MessageService, 
      private apiService:ApiService, 
      public utility:Utility) {
       /** lop report form */
       this.lopReportForm = this.fb.group({
         companyCode: new UntypedFormControl(this.companyCode),
         plantCode: new UntypedFormControl(this.plantCode),
         payrollArea: new UntypedFormControl('All'),
         month: new UntypedFormControl(new Date()),
         year: new UntypedFormControl(new Date()),
         genId: new UntypedFormControl('',Validators.pattern(/\S+/)),
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
        this.getPayrollAreaByPlant();
     }
 
     /** get company data for filter dropdown 
      * @property {*} companyData has companylist
     */
     getCompanyData(){
       this.apiService.companyshow().subscribe({
         next: (reponse:any) => {
           this.companyData = reponse;
          /** all data push */
          this.companyData.unshift({company_code:'',company_name:'All'})
         },
         error: (error:any) => this.messageService.add({severity:'error',summary:error.message})
       })
     }
 
     /** get plant data by company code
      * @property {UntypedForm} form.companyCode
      * @var {*} companyCode has company code based n admin
      */
 
     getplantByCompanyCode(){
      let companyCode = this.isAdmin ? this.lopReportForm.value.companyCode : this.companyCode;
      console.log('PLANT COMPANY CODE:', companyCode);
       this.apiService.getPlantByCompanyCode(companyCode).subscribe({
         next: (response) => {
           this.plantData = response;
          /** all data push */
           this.plantData.unshift({plant_code:'',plant_name:'All'})
         },
         error: (error:any) => this.messageService.add({severity:'error',summary:error.message})
       })
     }
 
      /** get payroll area by plant code
      * @property {UntypedForm} form.plantCode
      * @var {*} plantCode has plant code value based on admin
      */
 
     getPayrollAreaByPlant(){
      let plantCode:any = this.isAdmin ? this.lopReportForm.value.plantCode : this.plantCode;
      console.log('PAYROLL PLANT CODE:', plantCode);
       this.apiService.getPayrollAreaByPlantcode(plantCode).subscribe({
         next: (response) => {
           this.payrollAreaData = response;
            /** all push */
          this.payrollAreaData.unshift({PayrollArea:'All'});
         },
         error: (error:any) => this.messageService.add({severity:'error',summary:error?.error?.message})
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
         formattedValue = moment(date).format('MMMM') // returns month string
       }else{
         formattedValue = moment(date).format('YYYY') // returns year
       }
       this.lopReportForm.controls[`${formPropery}`].setValue(formattedValue);
       console.log(this.lopReportForm.value);
     }
 
     /** filter cummulative report 
      * @property {UntyperForm} form.value
      * @var month user selected month
     */
     filterLopReport(){
      /** format month & year */
       const formattedMonth = moment(this.lopReportForm.value.month).format('M');
       const formattedYear = moment(this.lopReportForm.value.year).format('YYYY');
       console.log({formattedMonth,formattedYear});
      /** setting payroll area all to '' string */
       if(this.lopReportForm.value.payrollArea == 'All'){
        this.lopReportForm.controls['payrollArea'].setValue('')
       }
      /** constructed form data */
       const formData = {...this.lopReportForm.value,month:formattedMonth,year:formattedYear}
       console.log(formData);
      /** get LOP report data */
      this.apiService.getLopReportData(formData).subscribe({
        next: (response:any) => {
          console.log('LOP REPORT DATA:',response);
          this.lopReportData = response;
        },
        error: (error:any) =>{
          console.error(error);
          this.messageService.add({severity:'error',summary:error?.error?.message})
        }
      })
     }

}
