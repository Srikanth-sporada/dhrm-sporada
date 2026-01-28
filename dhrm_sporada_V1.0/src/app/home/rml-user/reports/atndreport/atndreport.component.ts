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
  genid: any = undefined;
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
    /** logged in user data */
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.plant = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin");
    
    /** get plants */
    this.getPlants();
    /** get attendance data */
    this.getData();
    /** get categories */
     this.getCategories();
   /** get line by dept */  
    this.getLineByDept();
    
  }

  /** get plant code API */
  getPlants(){
    this.api.getplantcode(this.plant).subscribe({
      next: (response: any) => {
        this.plantlist = response;
        this.plantlist.unshift({plant_name:'All',plant_code:''})
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error.message});
      },
    });
  }
  
  /** get categories API */
  getCategories(){
    this.api.getCategories().subscribe({
      next: (data: any) => {
      this.categories = data;
      this.categories.unshift({categorynm:'All'});
    }, 
    error: (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message});
    }
    });
  }
  /** get line by dept API */
  getLineByDept(){
    this.api.getlineBydept().subscribe({
      next: (response: any) => {
      this.lines = response;
      this.lines.unshift({Line_Name:'All', Line_code:''});
    },
    error: (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message});
    }
    });
  }
  /**
   *  get attendance data API 
   *  @property {*} plant
   * @property {!*} genid 
   *  */
  getData() {
    let data = {
      plant: this.plant,
      id: this.genid,
      year: moment(this.date).format('yyyy'),
      month: moment(this.date).format('MM'),
    };
    this.api.atndReport(data).subscribe({
      next: (response: any) => {
      if ((response.status = "success")) {
        this.atndData = response.data;
        this.displayDate = moment(this.date).format("MMMM,yyyy")
      } else {
        // alert(response.message);
        this.messageService.add({severity:'error',summary:response.message})
      }
    }, 
    error: (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error?.error?.message});
    }
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

  /** 
   * copy toast function
   * @param value
   */
  copyGenIDToClipboard(value:any){
    this.messageService.add({severity:'info',summary:`${value} Copied to clipboard.`})
  }

}
