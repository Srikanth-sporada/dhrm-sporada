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
  data: any = [];
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
        this.data = response.data
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
