import { Component, OnInit,ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder,Validators} from '@angular/forms';
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
    cummulativeReportData:any = [
      {
    genId: "E001",
    name: "John Doe",
    plant: "Plant A",
    payrollArea: "Area 1",
    calDays: 30,
    off: 4,
    rh: 1,
    pl: 2,
    cl: 1,
    sl: 0,
    od: 0,
    pr: 0,
    coff: 0,
    lateHrs: 2,
    otHrs: 5,
    ot2Hrs: 3,
    ot3Hrs: 0,
    wrkingDays: 26,
    wrkedDays: 25,
    lop: 1,
    g: 0,
    n: 0,
    s1: 0,
    s2: 0,
    fml: 0,
    wrkSun: 1
  },
  {
    genId: "E002",
    name: "Jane Smith",
    plant: "Plant B",
    payrollArea: "Area 2",
    calDays: 31,
    off: 5,
    rh: 2,
    pl: 1,
    cl: 0,
    sl: 1,
    od: 0,
    pr: 0,
    coff: 1,
    lateHrs: 0,
    otHrs: 8,
    ot2Hrs: 2,
    ot3Hrs: 1,
    wrkingDays: 26,
    wrkedDays: 26,
    lop: 0,
    g: 0,
    n: 0,
    i: 0,
    ii: 0,
    fml: 0,
    wrkSun: 2
  }
];
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
        payrollArea: new UntypedFormControl(''),
        month: new UntypedFormControl(new Date()),
        year: new UntypedFormControl(new Date()),
        genId: ['',Validators.pattern(/\S+/)],
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
        error: (error:any) => this.messageService.add({severity:'error',summary:error.message})
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
     */

    getPayrollAreaByPlant(){
      let plantCode = this.isAdmin ? this.cummulativeReportForm.value.plantCode : this.plantCode;
      this.apiService.getPayrollAreaByPlantcode(plantCode).subscribe({
        next: (response) => {
          this.payrollAreaData = response;
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
    */
    filterCummulativeReport(){
      console.log({mo:this.cummulativeReportForm.value.month,yy:this.cummulativeReportForm.value.year})
      const formattedMonth = moment(this.cummulativeReportForm.value.month).format('M');
      const formattedYear = moment(this.cummulativeReportForm.value.year).format('YYYY');
      console.log({formattedMonth,formattedYear});
      const formData = {...this.cummulativeReportForm.value,month:formattedMonth,year:formattedYear}
      console.log('FORM DATA', formData);
    }
}
