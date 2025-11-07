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
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-cummulative-report',
  templateUrl: './cummulative-report.component.html',
  styleUrls: ['./cummulative-report.component.css'],
})
export class CummulativeReportComponent implements OnInit {

    cummulativeReportForm: any;
    hideCumulativeReport:boolean = environment.hideCumulativeReport;
    all:any;
    userDetails:any;
    companyData:any = [];
    plantData:any = [];
    payrollAreaData:any = [];
    cummulativeReportData:any = [];
    
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
