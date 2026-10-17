import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import * as XLSX from   'xlsx'
import { CoffotpopupComponent } from '../ot-compoff/coffpopup/coffpopup.component';
import { CoffDetailsComponent } from "../coff-details/coff-details.component";
import { ExcessHoursDetailsComponent } from '../excess-hours-details/excess-hours-details.component';
import { MessageService } from 'primeng/api';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
    requiredHours:number = 8;
    isHalfSelected:boolean = false;
    reservedCoffData:any[] = []
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
              return {...data, selected:false}
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
     * open modal for absent days record
     * @memberof CoffReservedHoursComponent
     */
    openAbsentDaysDialogModal(){
      this.requiredHours = this.isHalfSelected ? 4 : this.requiredHours;
      console.log('merge',this.isMergeDateSelected);
      console.log('half',this.isHalfSelected);
      console.log('required', this.requiredHours);

      const selectedWorkedDates = this.reservedCoffData.filter((coffData:any) => coffData.selected == true); // filter only selected dates

      const data = {
        aplnSlno: this.aplnSlno,
        requiredHours: this.requiredHours,
        selectedWorkedDate:selectedWorkedDates,
        genId:this.routerParamMap.genId
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
}
