import { Component, OnInit } from "@angular/core";
import  {LoaderserviceService} from '../../../../loaderservice.service'
import { ApiService } from "src/app/home/api.service";
import * as XLSX from 'xlsx';
import { MessageService } from "primeng/api";
import moment from "moment";
@Component({
  selector: "app-rawpunchdata",
  templateUrl: "./rawpunchdata.component.html",
  styleUrls: ["./rawpunchdata.component.css"],
})
export class RawpunchdataComponent implements OnInit {
  id:any;
  punchData:any;
  from: any;
  to: any;
  plant: any;
  max:any;
  fromMax:any;
  plantlist:any[];
  swipId:any;
  isadmin:any;
  all:any;
  userDetails:any;
  constructor(private api: ApiService,public loader:LoaderserviceService, private messageService:MessageService) {}

  ngOnInit() {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.plant=''
    let date = new Date()
    this.fromMax = date
    const plantCode=sessionStorage.getItem('plantcode')
    this.isadmin=sessionStorage.getItem('isadmin')
    if(this.isadmin=='false'){
      this.plant=plantCode
    }
    
    this.api.getplantcode(plantCode).subscribe({
      next:(response:any) => {
        this.plantlist=response
        this.plantlist.unshift({plant_name:'All',plant_code:''})
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }

  getData() {
    this.swipId=''
    this.api
      .raw_punch_data({ from: moment(this.from).format('YYYY-MM-DD'), to: moment(this.to).format('YYYY-MM-DD'), plant: this.plant })
      .subscribe({
        next: (response) => {
          this.punchData = response;
        },
       error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
      });
  }

  datechange(){
    
    let from = this.from
    // from.setDate(from.getDate()+31);
    let year = from.getFullYear();
    let month = from.getMonth()+1;
    let day = from.getDate();
    let max = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
    
    let today = new Date().toJSON().split('T')[0];
    if(max<today){
      this.max= new Date(max);
      this.to= new Date(max);
    }else{
      this.max= new Date(today);
      this.to= new Date(today);
    }
    console.log(this.from,this.max,this,this.fromMax);
  }

  export(){
    const x = document.querySelector("#rawdata")
  const ws = XLSX.utils.table_to_sheet(x);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Table');
  XLSX.writeFile(wb, 'Raw Punch Data.xlsx');
  this.messageService.add({severity:'info',summary:'Data Downloaded!'})
  }
}
