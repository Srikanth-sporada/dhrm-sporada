import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { environment } from "../../../../../environments/environment.prod";
import { ApiService } from "src/app/home/api.service";
import * as moment from "moment";

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
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const plantCode = sessionStorage.getItem("plantcode");
    this.apiService.getplantcode(plantCode).subscribe({
      next: (response: any) => {
        this.plantlist = response;
      },
      error: (error) => console.log(error),
    });
    this.getData();
  }

  getData() {
    let date = this.date.split("-");
    this.apiService.getProdData(this.from, this.to).subscribe((response: any) => {
      if ((response.status = "success")) {
        this.productin_data = response.data;
      } else {
        alert(response.message);
      }
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
        alert(response.message);
      } else if (response.status == "success") {
        this.save = false;
        alert("Data Verified Successfully");
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
      alert(response.message);
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
  }
}
