import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../api.service";
import moment from 'moment'


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  date:any;
  selectedPlant:any
  plants:any[]
  isadmin:any;
  ishr:any;
  isHeadHr:any;
  isfin:any;
  all:any;
  userDetails:any;
  empDetails:any;
  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    let detail = sessionStorage.getItem("all");
    if (detail != null) {
      this.all = JSON.parse(detail);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.empDetails = JSON.parse(details);
    }
    this.selectedPlant = plantCode;
    this.apiService.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        response.push({plant_code:'',plant_name:'All'})
        this.plants = response.reverse();
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
