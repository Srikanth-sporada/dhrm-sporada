import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { environment } from "../../../../../environments/environment.prod";
import { ApiService } from "src/app/home/api.service";
import * as moment from "moment";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-prod-actual",
  templateUrl: "./prod-actual.component.html",
  styleUrls: ["./prod-actual.component.css"],
})
export class ProdActualComponent implements OnInit {
  url = environment.path + "/";
  file: any = "";
  data: any;
  save: any = true;
  productin_data: any = [];
  date: any = moment().format("yyyy-MM");
  plantlist: any[];
  plant: any = "";
  code:any='';
  from:any=moment().startOf('month').format('YYYY-MM-DD');
  to:any=moment().format('YYYY-MM-DD');
  all:any;
  userDetails:any;
  constructor(private apiService: ApiService, private mesasgeService:MessageService) {}

  ngOnInit() {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    const plantCode = sessionStorage.getItem("plantcode");
    this.apiService.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
      },
      error: (error) => {
        console.log(error);
        this.mesasgeService.add({severity:'error',summary:error.message})
      },
    });
    this.getData();
  }

  getData() {
    let date = this.date.split("-");
    let formattedFromDate = moment(this.from).format('YYYY-MM-DD');
    let formattedToDate =  moment(this.to).format('YYYY-MM-DD')
    this.apiService.getProdData(formattedFromDate,formattedToDate).subscribe((response: any) => {
      if ((response.status = "success")) {
        this.productin_data = response.data;
      } else {
        // alert(response.message);
        this.mesasgeService.add({severity:'info',summary:response.message})
      }
    },(error) => {
        console.log(error);
        this.mesasgeService.add({severity:'error',summary:error.message})
      });
    
  }

  fileUpload(event: any) {
    this.save = true;
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: "binary" });
      let sheetname = workbook.SheetNames[0];
      this.data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname]);
    };
  }

  verify() {
    this.apiService.verifyProdData(this.data).subscribe((response: any) => {
      if (response.status == "failed") {
        console.log("failed");
        this.file = "";
        this.data = [];
       this.mesasgeService.add({severity:'info',summary:response.message})
      } else if (response.status == "success") {
        this.save = false;
       this.mesasgeService.add({severity:'info',summary:'Data verified Successfully'})
      }
    });
  }

  upload() {
    let data = {
      data: this.data,
      plant: sessionStorage.getItem("plantcode"),
      empid: sessionStorage.getItem("user_name"),
    };
    console.log(this.data)
    this.apiService.uploadProdData(data).subscribe((response: any) => {
      this.mesasgeService.add({severity:'info',summary:response.message})
      this.file = "";
      this.save = true;
    });
  }

  exportexcel() {
    const x = document.querySelector("#table");
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table");
    XLSX.writeFile(wb, "Production Data.xlsx");
    this.mesasgeService.add({severity:'info',summary:'Data Exported Successfully!'})
  }
}
