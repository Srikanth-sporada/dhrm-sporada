import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { NightCoffPopupComponent } from "./nightCoff-popup/nightCoff-popup.component";

@Component({
  selector: "app-night-coff",
  templateUrl: "./night-coff.component.html",
  styleUrls: ["./night-coff.component.css"],
})
export class NightCoffComponent implements OnInit {
  data: any = [
  {
    emp_id:3551,
    gen_id: "EMP001",
    fullname: "John Doe",
    dept_name: "Production",
    Line_Name: "Line A",
    apprentice_type: "Trainee",
    date: "2026-01-21"
  },
  {
    emp_id:3551,
    gen_id: "EMP002",
    fullname: "Jane Smith",
    dept_name: "Quality Assurance",
    Line_Name: "Line B",
    apprentice_type: "Apprentice",
    date: "2026-01-20"
  },
  {
    emp_id:3551,
    gen_id: "EMP003",
    fullname: "Raj Kumar",
    dept_name: "Maintenance",
    Line_Name: "Line C",
    apprentice_type: "Intern",
    date: "2026-01-19"
  },
  {
    emp_id:3551,
    gen_id: "EMP004",
    fullname: "Emily Davis",
    dept_name: "Logistics",
    Line_Name: "Line D",
    apprentice_type: "Trainee",
    date: "2026-01-18"
  }
];
  lines: any;
  selectedLine: any = "";
  downlodData: any;
  loading:any=false
  constructor(private apiService: ApiService, private matdailog: MatDialog) {}

  ngOnInit() {
    this.getData();
    this.apiService.getlineBydept().subscribe((response: any) => {
      this.lines = response;
    });
  }

  getData() {
    this.loading=true
    this.apiService.getNightShiftCompOff().subscribe((response: any) => {
      if (response.status == "failed") {
        alert(response.message);
        this.loading=false
      } else {
        console.log(response.data);
        this.downlodData = response.data;
        this.data = this.data
          .map((element: any) => {
            return { ...element, approvedHr: null, reason: "" };
          })
          this.loading=false
      }
    });
  }

  openDailog(details: any) {
    this.matdailog
      .open(NightCoffPopupComponent, {
        data: details,
        width:'800px'
      })
      .afterClosed()
      .subscribe((data: any) => {
        this.getData();
      });
  }
}
