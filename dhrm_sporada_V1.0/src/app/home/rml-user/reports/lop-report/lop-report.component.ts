import { Component, OnInit,ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { FormService } from '../../new-joiners/form.service';
import { DatePipe } from '@angular/common';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import * as XLSX from 'xlsx';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { Utility } from 'src/app/utils/utils';
@Component({
  selector: 'app-lop-report',
  templateUrl: './lop-report.component.html',
  styleUrls: ['./lop-report.component.css']
})
export class LopReportComponent implements OnInit {

     lopReportForm: any
     all:any;
     userDetails:any;
     companyData:any = [];
     plantData:any = [];
     payrollAreaData:any = [];
     reportDataObjectKeys:any;
     lopReportData:any = [
  {
    genId: 'G101',
    name: 'Sundar Raj',
    plant: 'Plant A - Hosur',
    payrollArea: 'PA03',
    startDate: '2025-10-05',
    endDate: '2025-10-10',
    duration: 6,
    lopType: 'Unpaid Leave'
  },
  {
    genId: 'G102',
    name: 'Lakshmi Devi',
    plant: 'Plant B - Sriperumbudur',
    payrollArea: 'PA04',
    startDate: '2025-10-15',
    endDate: '2025-10-18',
    duration: 4,
    lopType: 'Sick Leave'
  },
  {
    genId: 'G103',
    name: 'Ravi Shankar',
    plant: 'Plant C - Oragadam',
    payrollArea: 'PA05',
    startDate: '2025-10-20',
    endDate: '2025-10-22',
    duration: 3,
    lopType: 'Casual Leave'
  }
]
     constructor(private modalService:NgbModal,private fb: UntypedFormBuilder, private http: HttpClient, private service: FormService, public loader: LoaderserviceService, private active: ActivatedRoute,private messageService:MessageService, private apiService:ApiService, public utility:Utility) {
       /** cummulative report filter form */
       this.lopReportForm = this.fb.group({
         companyCode: new UntypedFormControl(''),
         plantCode: new UntypedFormControl(''),
         payrollArea: new UntypedFormControl(''),
         month: new UntypedFormControl(''),
         year: new UntypedFormControl(''),
         genId: new UntypedFormControl(''),
       });
     }
     ngOnInit(): void {
       let details = sessionStorage.getItem("all");
       if (details != null) {
         this.all = JSON.parse(details);
         this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
       }
 
       /** get company data */
       this.getCompanyData();

      /** extract object keys */
      this.reportDataObjectKeys = this.utility.extractKeys(this.lopReportData);
      console.log(this.reportDataObjectKeys);

      /** test api call using utlity function with observable */
      this.utility.getPayrollAreaByPlant('1150').subscribe({
        next: (data) => {
          this.payrollAreaData = data
        }
      });
     }
 
     /** get company data for filter dropdown 
      * @property {*} companyData has companylist
     */
     getCompanyData(){
       this.apiService.companyshow().subscribe({
         next: (reponse:any) => {
           this.companyData = reponse;
         },
         error: (error:any) => this.messageService.add({severity:'error',summary:error.message})
       })
     }
 
     /** get plant data by company code
      * @property {UntypedForm} form.companyCode
      */
 
     getplantByCompanyCode(){
       this.apiService.getPlantByCompanyCode(this.lopReportForm.value.companyCode).subscribe({
         next: (response) => {
           this.plantData = response;
         },
         error: (error:any) => this.messageService.add({severity:'error',summary:error.message})
       })
     }
 
      /** get payroll area by plant code
      * @property {UntypedForm} form.plantCode
      */
 
     getPayrollAreaByPlant(){
       this.apiService.getPayrollAreaByPlantcode(this.lopReportForm.value.plantCode).subscribe({
         next: (response) => {
           this.payrollAreaData = response;
         },
         error: (error:any) => this.messageService.add({severity:'error',summary:error.message})
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
       this.lopReportForm.controls[`${formPropery}`].setValue(formattedValue);
     }
 
     /** filter cummulative report 
      * @property {UntyperForm} form.value
      * @var month user selected month
     */
     filterLopReport(){
       const month = this.lopReportForm.value.month;
       this.lopReportForm.controls['month'].setValue(moment().month(month).format("M"));
       console.log('DATA', this.lopReportForm.value);
     }

}
