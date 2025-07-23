import { Component, OnInit } from "@angular/core";
import  {LoaderserviceService} from '../../../../loaderservice.service'
import { ApiService } from "src/app/home/api.service";
import * as XLSX from 'xlsx';

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
  constructor(private api: ApiService,public loader:LoaderserviceService) {}

  ngOnInit() {
    this.plant=''
    let date = new Date().toJSON().split('T')[0]
    this.fromMax=date
    const plantCode=sessionStorage.getItem('plantcode')
    this.isadmin=sessionStorage.getItem('isadmin')
    if(this.isadmin=='false'){
      this.plant=plantCode
    }
    
    this.api.getplantcode(plantCode).subscribe({
      next:(response:any) => {
        this.plantlist=response
      },
      error: (error) => console.log(error)
    })
  }

  getData() {
    this.swipId=''
    this.api
      .raw_punch_data({ from: this.from, to: this.to, plant: this.plant })
      .subscribe({
        next: (response) => {
          this.punchData = response;
        },
        error: (msg) => {
          console.log(msg);
        },
      });
  }

  datechnage(){
    
    let from = new Date(this.from)
    from.setDate(from.getDate()+31)
    let year = from.getFullYear()
    let month = from.getMonth()+1
    let day = from.getDate()
    let max = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
    
    let today = new Date().toJSON().split('T')[0]
    if(max<today){
      this.max=max
      this.to=max
    }else{
      this.max=today
      this.to=today
    }
  }

  export(){
    const x = document.querySelector("#rawdata")
  const ws = XLSX.utils.table_to_sheet(x);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Table');
  XLSX.writeFile(wb, 'Raw Punch Data.xlsx');
  }
}
