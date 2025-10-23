import { Component, OnInit } from "@angular/core";
import {MatDialog,MAT_DIALOG_DATA,MatDialogRef,} from "@angular/material/dialog";
import { AddPmpdComponent } from "./add-pmpd/add-pmpd.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx";
import { MessageService,MenuItem } from "primeng/api";

@Component({
  selector: "app-pmpd-master",
  templateUrl: "./pmpd-master.component.html",
  styleUrls: ["./pmpd-master.component.css"],
})
export class PmpdMasterComponent implements OnInit {
  displayData: any[];
  search: any;
  all:any;
  userDetails:any;
  plantData:any;
  pmpdDataCopy:any;
  selecdtedPlant:string;

   items: MenuItem[] = [
            {
                icon: 'pi pi-plus-circle',
                tooltipOptions:{
                  tooltipLabel: 'Add PMPD',
                },
                command: () => {
                    this.openDialog();
                }
            },
            {
              icon: 'pi pi-download',
              tooltipOptions:{
                tooltipLabel: 'Download',
              },
              command: () => {
                this.export();
                this.messageService.add({ severity: 'info', summary: 'Data Converted.' });
              }
            }
  ];
  constructor(public dialog: MatDialog, private api: ApiService, private messageService:MessageService) {}

  ngOnInit() {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getData();
    this.getPlantsByCode();
  }

  getPlantsByCode(){
     this.api.getplantcode(sessionStorage.getItem('plantcode')).subscribe(
      (response:any)=>{
        console.log(response)
        this.plantData=response
      }, (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
    )
  }

  getData() {
    this.api.get_pmpd_data().subscribe((response: any) => {
      this.displayData = response;
      this.pmpdDataCopy = response;
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  openDialog() {
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
        alert(`Material:${item.mat_code} Activated Successfully`);
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

  filterPmpdByPlant() {
    const filteredData = this.pmpdDataCopy.filter((pmpd:any) => this.selecdtedPlant == pmpd.plant);
    if(filteredData.length == 0){
      this.displayData = this.pmpdDataCopy;
      this.messageService.add({severity:'warn', summary:`Data Not Found For plant: ${this.selecdtedPlant}`})
    }else{
      this.displayData = filteredData;
    }
  }
}
