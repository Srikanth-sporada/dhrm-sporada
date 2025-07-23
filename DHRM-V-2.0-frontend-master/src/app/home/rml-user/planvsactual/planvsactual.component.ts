import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-planvsactual',
  templateUrl: './planvsactual.component.html',
  styleUrls: ['./planvsactual.component.css']
})
export class PlanvsactualComponent implements OnInit {

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
    let yestdate = new Date()
    yestdate.setDate(yestdate.getDate())
    let convertedDt = moment(yestdate).format('YYYY-MM-DD')
    this.date=convertedDt
    let data={date:this.date,plant:1200}
  }
}
