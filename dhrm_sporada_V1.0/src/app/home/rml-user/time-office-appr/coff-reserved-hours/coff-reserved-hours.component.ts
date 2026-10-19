import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import {MatDialog} from '@angular/material/dialog';
import * as XLSX from   'xlsx'
import { CoffotpopupComponent } from '../ot-compoff/coffpopup/coffpopup.component';
import { MessageService } from 'primeng/api';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
/**
 *
 *
 * @export
 * @class CoffReservedHoursComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-coff-reserved-hours',
  templateUrl: './coff-reserved-hours.component.html',
  styleUrls: ['./coff-reserved-hours.component.css']
})
export class CoffReservedHoursComponent implements OnInit {
    data: any;
    lines: any;
    all:any;
    userDetails:any;
    genId:any;
    paginationRowsPerPage:any[] = environment?.paginationRowsPerPage;
    aplnSlno:string | null;
    routerParamMap:any;
    isMergeDateSelected:boolean = false;
    requiredHours:number= 0;
    isHalfSelected:boolean = false;
    reservedCoffData:any[] = [];
    sumOfSelectedDatesHour:number = 0;
    selectedRowData:any[] = [];
    requiredCoffHours:any = null;

    constructor(
      private apiService: ApiService,
      private matdailog:MatDialog,
      private messageService:MessageService,
      public loader:LoaderserviceService,
      private router:ActivatedRoute,
      private location:Location,
    ) {}
    
    ngOnInit() {
      /** logged in user information */
      let details = sessionStorage.getItem("all");
      if (details != null) {
        this.all = JSON.parse(details);
        this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
      }
      /** apln_slno form router param */
      this.aplnSlno = this.router.snapshot.paramMap.get('aplnSlno')
      this.routerParamMap = this.router.snapshot.params;
      /** get reserved hours */
      this.getReservedHours();
      /** get required coff hours */
      this.getRequiredCoffHours();
    }
  
  /** convert to number to string */
    toNumber(string:string|number){
      return Number(string);
    }
  
     /** 
     * convert number to string
     * @param number
     *  */
    convertToString(number:any){
      if(!number){
        return '0'
      }else{
      return String(number);
      }
    }
    
    /**
     * get reserved coff hours for trrainee to apply COFF
     * @memberof CoffReservedHoursComponent
     */
    getReservedHours(){
      const aplnSlno = this.routerParamMap.aplnSlno
      this.apiService.getReservedCoffHoursByTrainee(aplnSlno).subscribe({
        next: (response:any) => {
          if(response.status == 'success'){

            this.reservedCoffData = response.data.map((data:any) => {
              return {...data, selected:false, isDisabled:null}
            });

            if(response.data.length == 0){
              this.messageService.add({severity:'warn',summary:`No reserved COFF hours found for: ${aplnSlno}`})
            }

          }else{
            this.messageService.add({severity:'warn',summary:response.message});
          }
        },
        error: (error:any) => {
          console.error('GET RESERVED COFF FOR TRAINEE API ERROR:',error);
          this.messageService.add({severity:'error',summary:error.error.message});
        }
      })
    }
    
    /**
     * get required coff by plant
     * @memberof CoffReservedHoursComponent
     */
    getRequiredCoffHours(){
      const plantCode = this.all.plant_code;
      this.apiService.getRequiredCoffHoursByPlant(plantCode).subscribe({
        next: (response:any) => {
          if(response.status == 'success'){

            this.requiredCoffHours = response.data;
            this.requiredHours = response.data.fullDayHours;

            if(response.data.length == 0){
              this.messageService.add({severity:'warn',summary:`No required coff record foun for plant: ${plantCode}`})
            }

          }else{
            this.messageService.add({severity:'warn',summary:response.message});
          }
        },
        error: (error:any) => {
          console.error('GET REQUIRED COFF HOUR API ERROR:',error);
          this.messageService.add({severity:'error',summary:error.error.message});
        }
      })
    }
    /**
     * open modal for absent days record
     * pass the selected data to popup component 
     * @property {*} selectedRowData -- has selected row data, single or multiple
     * @property {*} sumOfSelectedDatesHour -- sum of selected row data
     * @property {*} requiredHours -- has required hours to apply coff
     * @memberof CoffReservedHoursComponent
     */
    openAbsentDaysDialogModal(){
      /** find shoul  need to inser new row */
      const isNewRowInsert = this.requiredHours >= this.sumOfSelectedDatesHour  ? false : true;
      /** calculate new row hours */
      const newRowHours = this.sumOfSelectedDatesHour - this.requiredHours;
      /** find last selected date row data */
      const lastSelectedDate:any = this.selectedRowData[this.selectedRowData.length - 1];
      /** construct new data row insert data */
      const newRowData = {
        plantCode: this.all.plant_code,
        aplnSlno:this.aplnSlno,
        hours: newRowHours,
        workedDate: lastSelectedDate.workedDate,
        flag: 'RFC',
        reason:'COFF BALANCE ROW INSERTED BY SYSTEM',
        appliedBy: this.all.gen_id,
        validFrom: lastSelectedDate.validFrom,
        validTo: lastSelectedDate.validTo,
        payrollEndDate: lastSelectedDate.payrollEndDate,
        isRaisedByTrainee: false,
        type: lastSelectedDate.ot_type,
        isNightShift:false,
      }
      /** construct popup modal data input */
      const data = {
        aplnSlno: this.aplnSlno,
        requiredHours: this.requiredHours,
        selectedReservedCoffDates:this.selectedRowData,
        genId:this.routerParamMap.genId,
        coffFlag:'COFF',
        isInsertNewRow:isNewRowInsert,
        newRowInsertData: isNewRowInsert ? newRowData : null,
      };

      this.matdailog.open(CoffotpopupComponent,{
        data:data
      }).afterClosed().subscribe((data:any)=>{
        this.getReservedHours();
        console.log('coff absent pop up closed',data)
      });

    }

    navBack(){
      this.location.back();
    }
   
    /**
     * filters selected rows and sum the selected rows hours if matched the required hours disable other rows
     * if user de selects the row if required hour not met other row are enable to select
     * @param {*} event
     * @param {*} selectedRow
     * @property {*} selectedRowData -- has selected row data, single or multiple
     * @property {*} sumOfSelectedDatesHour -- sum of selected row data
     * @memberof CoffReservedHoursComponent
     */
    singleRowSelect(event:any, selectedRow:any){
      console.log('required hours', this.requiredHours);

      /** reset variables */
      this.sumOfSelectedDatesHour = 0;
      this.selectedRowData = [];

      /** filter only selected coff rows */
      const selectedDates = this.reservedCoffData.filter((coffData:any) => coffData.selected == true);
      /** filtered rows hours */
      this.sumOfSelectedDatesHour = selectedDates.reduce((accumulator:any, currentValue:any) => {
        return accumulator + currentValue.hours
      },0);

      this.selectedRowData = selectedDates;

      console.log('sum of selected hours:', this.sumOfSelectedDatesHour);
      console.log('selectedRowData', this.selectedRowData);

      /** check if selected data meet the required coff hours */
      if(this.sumOfSelectedDatesHour >= this.requiredHours){

        this.reservedCoffData.map((coffData:any) => {
          if(!coffData.selected){
            coffData.isDisabled = true;
          }
          return coffData
        });
      }else{

        this.reservedCoffData.map((coffData:any) => {
          if(!coffData.selected){
            coffData.isDisabled = false;
          }
          return coffData
        });
      }
    }
    
    /**
     * opens @property {*} openAbsentDaysDialogModal
     * set the selectedrow selected prop to true,
     * @param {*} selectedRow
     * @memberof CoffReservedHoursComponent
     */
    singleCoffApply(selectedRow:any){
      selectedRow.selected = true;
      this.openAbsentDaysDialogModal();
    }
    
    /**
     * change the required hours based on the @property {*} isHalfSelected
     * update the value of @property {*} requiredHours
     * @memberof CoffReservedHoursComponent
     */
    halfOrFullDayCheck(){
      this.isHalfSelected 
      ? this.requiredHours = this.requiredCoffHours.halfdayHours || 4 
      : this.requiredHours = this.requiredCoffHours.fullDayHours || 8;
    }
    
    /**
     * is row need to be disabled or not
     * @param {*} row
     * @return {*}  {boolean}
     * @memberof CoffReservedHoursComponent
     */
    isRowCheckBoxDisabled(row:any):boolean{
     if(row.isDisabled){
      return true;
     }else{
      return !this.isMergeDateSelected
     }
    }

    isApplyBtnDisabled(){
      if(this.sumOfSelectedDatesHour >= this.requiredHours){
        return false;
      }else{
        return true
      }
    }
}
