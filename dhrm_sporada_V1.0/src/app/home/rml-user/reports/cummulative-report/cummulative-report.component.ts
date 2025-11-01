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
  selector: 'app-cummulative-report',
  templateUrl: './cummulative-report.component.html',
  styleUrls: ['./cummulative-report.component.css'],
})
export class CummulativeReportComponent implements OnInit {

    cummulativeReportForm: any
    all:any;
    userDetails:any;
    companyData:any = [];
    plantData:any = [];
    payrollAreaData:any = [];
    cummulativeReportData:any = [
  {
    genId: '900001',
    name: 'Arun Kumar Kumar',
    plant: 'Chennai Plant 1',
    payrollArea: 'PA01',
    calDays: 31,
    month: 'October',
    fromDate: '2025-10-01',
    toDate: '2025-10-31',
    sunday: 4,
    holiday: 2,
    workingDays: 25,
    presentDays: 23,
    absentDays: 2,
    paidDays: 23,
    otHour: 5,
    otDouble: 2,
    otTrible: 1,
    shiftA: 10,
    shiftG: 8,
    shiftB: 5,
    shiftC: 2
  },
  {
    genId: '900002',
    name: 'Meena R.',
    plant: 'Chennai Plant 2',
    payrollArea: 'PA02',
    calDays: 31,
    month: 'October',
    fromDate: '2025-10-01',
    toDate: '2025-10-31',
    lop:'530',
    eg:'120',
    sunday: 4,
    holiday: 1,
    workingDays: 26,
    presentDays: 26,
    absentDays: 0,
    paidDays: 26,
    otHour: 3,
    otDouble: 1,
    otTrible: 0,
    shiftA: 12,
    shiftG: 10,
    shiftB: 3,
    shiftC: 1
  }
    ];
    
    constructor(private modalService:NgbModal,private fb: UntypedFormBuilder, private http: HttpClient, private service: FormService, public loader: LoaderserviceService, private active: ActivatedRoute,private messageService:MessageService, private apiService:ApiService, public utility:Utility) {
      /** cummulative report filter form */
      this.cummulativeReportForm = this.fb.group({
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
      this.apiService.getPlantByCompanyCode(this.cummulativeReportForm.value.companyCode).subscribe({
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
      this.apiService.getPayrollAreaByPlantcode(this.cummulativeReportForm.value.plantCode).subscribe({
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
      this.cummulativeReportForm.controls[`${formPropery}`].setValue(formattedValue);
    }

    /** filter cummulative report 
     * @property {UntyperForm} form.value
     * @var month user selected month
    */
    filterCummulativeReport(){
      const month = this.cummulativeReportForm.value.month;
      this.cummulativeReportForm.controls['month'].setValue(moment().month(month).format("M"));
      console.log('DATA', this.cummulativeReportForm.value);
    }
}
