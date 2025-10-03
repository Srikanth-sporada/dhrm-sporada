import { Component, OnInit } from "@angular/core";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { AddPmpdComponent } from "./add-pmpd/add-pmpd.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-pmpd-master",
  templateUrl: "./pmpd-master.component.html",
  styleUrls: ["./pmpd-master.component.css"],
})
export class PmpdMasterComponent implements OnInit {
  displayData: any[];
  search: any;
  constructor(public dialog: MatDialog, private api: ApiService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.api.get_pmpd_data().subscribe((response: any) => {
      this.displayData = response;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddPmpdComponent, {
      data: { type: "add" },
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.getData();
    });
  }

  openBulkUpload(): void {
    const dailogRef = this.dialog.open(BulkUploadComponent, {
      hasBackdrop: true,
    });
    dailogRef.afterClosed().subscribe((data) => {
      this.getData();
    });
  }

  openEditDialog(values: any): void {
    const dialogRef = this.dialog.open(AddPmpdComponent, {
      data: { type: "edit", pmpd_data: values },
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.getData();
    });
  }

  activatePmpd(item: any) {
    console.log(item);
    this.api.activate_pmpd({ data: item }).subscribe((res: any) => {
      if (res.status == "succesfull") {
        alert(`Material:${item.mat_code} Activate Successfully`);
        this.getData();
      }
    });
  }

  export() {
    const x = document.querySelector("#pmpdtable");
    const ws = XLSX.utils.table_to_sheet(x);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table");
    XLSX.writeFile(wb, "PMPD Master.xlsx");
  }
}
