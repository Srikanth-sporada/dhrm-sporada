import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import moment from 'moment';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-ocm',
  templateUrl: './ocm.component.html',
  styleUrls: ['./ocm.component.css']
})
export class OcmComponent implements OnInit {
  years:any[]=[2023]
  date:any;
  selectedPlant:any
  plants:any[]
  isadmin:any;
  ishr:any;
  isHeadHr:any;
  isfin:any;
  empDetails:any;
  all:any;
  userDetails:any;
  /** #NEW FROM RML */
  Is_CHR: any;
  Is_CFIN: any;

  constructor(
    private apiService:ApiService,
    private messageService:MessageService,
  ) {}

  ngOnInit(): void {
    /** logged in user data */
    let detail = sessionStorage.getItem("all");
    if (detail != null) {
      this.all = JSON.parse(detail);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.generate_years();
    
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    /** #NEW FROM RML */
    this.Is_CHR = sessionStorage.getItem("Is_CHR") === "true";
    this.Is_CFIN = sessionStorage.getItem("Is_CFIN") === "true";
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.empDetails = JSON.parse(details);
    }
    this.selectedPlant = plantCode;

    this.getPlantCode(plantCode);

    /** format JS date to YYYY  */
    this.date= moment(this.date).format('YYYY')
    let data={date:this.date,plant:1200}
    console.log(this.date)
  }

  generate_years(){
    
    while(this.years[this.years.length-1] !=  +moment().format('YYYY')+1){
      this.years.push(this.years[this.years.length-1]+1)
    }
    console.log('GENERATED YEARS:',this.years)
  
  }

  /** GET PLANT CODES */
  getPlantCode(plantCode:any){
    this.apiService.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plants = response;
      },
      error: (error) => {
        console.log('GET PLANT CODE API ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }
}
