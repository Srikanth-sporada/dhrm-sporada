import { Component, OnInit ,ElementRef,ViewChild , AfterViewInit} from "@angular/core";
import * as XLSX from 'xlsx';
import moment from "moment";
import { ApiService } from "src/app/home/api.service";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { Utility } from "src/app/utils/utils";

@Component({
  selector: "app-atndreport",
  templateUrl: "./atndreport.component.html",
  styleUrls: ["./atndreport.component.css"],
})
export class AtndreportComponent implements OnInit {
  date: any = new Date();
  displayDate:any = moment().format("MM-yyyy");
  plant: any;
  plantlist: any;
  isadmin: any;
  genid: any = "";
  noOfDays: any = moment(this.date, "yyyy-MM").daysInMonth();
  atndData: any[];
  categories: any[];
  cat: any = "All";
  selectedLine: any='All'; 
  lines: any;
  all:any;
  userDetails:any;
  constructor(
    private api: ApiService, 
    private messageService:MessageService,
    public loader:LoaderserviceService,
    public utils:Utility) {}

  ngOnInit() {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    const plantCode = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    this.plant = plantCode;
  
    // get plant code api call
    this.api.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
        this.plantlist.unshift({plant_name:'All',plant_code:''})
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message});
      },
    });

    // get attedance date
    this.getData();

    // get catgory api call
    this.api.getCategories().subscribe((data: any) => {
      this.categories = data;
      this.categories.unshift({categorynm:'All'});
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message});
    });
    // get line api call
    this.api.getlineBydept().subscribe((response: any) => {
      this.lines = response;
      this.lines.unshift({Line_Name:'All'});
    },(error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message});
    });
    
  }

  getData() {
    let data = {
      plant: this.plant,
      id: this.genid,
      year: moment(this.date).format('yyyy'),
      month: moment(this.date).format('MM'),
    };
    this.api.atndReport(data).subscribe((response: any) => {
      if ((response.status = "success")) {
        this.atndData = response.data;
        this.displayDate = moment(this.date).format("MMMM,yyyy")
      } else {
        // alert(response.message);
        this.messageService.add({severity:'error',summary:response.message})
      }
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message});
    });
  }

  submit(){
    /** throttle function */
    this.utils.throttledClick();
    this.noOfDays = moment(this.date, "yyyy-MM").daysInMonth();
    this.getData();
  }

  exportexcel() {
    const x = document.querySelector("#atnddata")
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Table');
    XLSX.writeFile(wb, `attendance_data_${this.plant}.xlsx`);
    this.messageService.add({severity:'info',summary:'Data Exported.'});
  } 
}
