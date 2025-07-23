import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import * as moment from 'moment';

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
  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    this.generate_years()
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.empDetails = JSON.parse(details);
    }
    this.selectedPlant = plantCode;
    this.apiService.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plants = response;
      },
      error: (error) => console.log(error),
    });
    
    this.date= +moment().format('YYYY')
    let data={date:this.date,plant:1200}
    
  }

  generate_years(){
    
    while(this.years[this.years.length-1] !=  +moment().format('YYYY')+1){
      this.years.push(this.years[this.years.length-1]+1)
    }
  
  }

}
