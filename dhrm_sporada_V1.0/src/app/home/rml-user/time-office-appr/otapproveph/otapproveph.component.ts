import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";

@Component({
  selector: "app-otapproveph",
  templateUrl: "./otapproveph.component.html",
  styleUrls: ["./otapproveph.component.css"],
})
export class OtapprovephComponent implements OnInit {
  data: any;
  date: any;
  categories: any[];
  cat: any = "";
  selectAll = false;
  departmentList:any;
  selectedDept: any='';
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getData();
    this.apiService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
    this.apiService.getDeptByPlant().subscribe((data: any) => {
      this.departmentList = data;
    });
  }

  getData() {
    this.apiService.getPhOt().subscribe((response: any) => {
      if ((response.status = "success")) {
        this.data = response.data.map((element: any) => {
          return { ...element, selected: false };
        });
        console.log(this.data);
      } else if (response.status == "failed") {
        alert(response.message);
      }
    });
  }

  approve(slno: any, status: any) {
    let data = {
      slno,
      status,
      empId: sessionStorage.getItem("user_name"),
    };
    console.log(data);
    this.apiService.approvePhOt(data).subscribe((res: any) => {
      if (res.status == "success") {
        alert(res.message);
        this.getData();
      } else {
        alert(res.message);
      }
    });
  }

  submit(status: any) {
    let filtered_data = this.data
      .filter((element: any) => {
        return element.selected == true;
      })
      .map((element: any) => {
        return element.slno;
      });
    if (filtered_data.length == 0) {
      return alert("Please select At least one OT request");
    }
    let data = {
      slno: filtered_data,
      status,
      empId: sessionStorage.getItem("user_name"),
    };
    this.apiService.approvePhOtBulk(data).subscribe((response: any) => {
      alert(response.message);
      this.getData();
      this.selectAll = false;
    });
  }

  checkItems() {
    let count = 0;
    for (let element of this.data) {
      if (element.selected == true) {
        count++;
      }
    }
    if (count == this.data.length) {
      this.selectAll = true;
    }
    if (count < this.data.length) {
      this.selectAll = false;
    }
  }

  handelSelectAll() {
    if (this.selectAll) {
      this.data = this.data.map((element: any) => {
        return { ...element, selected: true };
      });
    } else {
      this.data = this.data.map((element: any) => {
        return { ...element, selected: false };
      });
    }
  }
}
