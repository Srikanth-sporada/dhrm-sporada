import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "src/app/home/api.service";
import { MatButtonModule } from "@angular/material/button";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";
import moment from "moment";

@Component({
  selector: "app-coff-details",
  templateUrl: "./coff-details.component.html",
  styleUrls: ["./coff-details.component.css"],
})
export class CoffDetailsComponent implements OnInit {
  coffData: any[];
  gen_id: any = sessionStorage.getItem("gen_id");
  user: any = sessionStorage.getItem("user");
  plant: any = sessionStorage.getItem("plantcode");
  expandedRecordData:any[] = [];
  constructor(
    private dailog: MatDialogRef<CoffDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private messageService: MessageService,
    public loader:LoaderserviceService,
  ) {}

  ngOnInit() {
    if (this.data.apprentice_type === "OPERATOR" && this.user === "ars") {
      this.apiService
        .getApprovedCoffDetails_Optr(this.data.emp_id)
        .subscribe((response: any) => {
          if ((response.status = "success")) {
            this.coffData = response.data;
          } else {
            this.dailog.close();
            // alert(response.message);
            this.messageService.add({
              severity: "info",
              summary: response?.message,
            });
          }
        });
    } else {
      this.apiService
        .getApprovedCoffDetails(this.data.emp_id)
        .subscribe((response: any) => {
          if ((response.status = "success")) {
            this.coffData = response.data;
          } else {
            this.dailog.close();
            // alert(response.message);
            this.messageService.add({
              severity: "info",
              summary: response?.message,
            });
          }
        });
    }
  }

  toString(dates:string){
    const utlizedDates = dates.split(',')
    return String(utlizedDates.length);
  }
  close() {
    this.dailog.close();
  }

  getUtlizedDates(event:any){
    const expandedRecord = this.coffData[event.index];
    console.log(expandedRecord);

    const data = {
      aplnSlno: expandedRecord.emp_id,
      coffDate: moment(expandedRecord.data).format('YYYY-MM-DD')
    };

    this.apiService.getUtilizedDatesByTraineeCoffDate(data).subscribe({
      next: (response:any) => {
        if(response.status == 'success'){
         this.expandedRecordData = [];
         this.expandedRecordData = response.data;
        }else{
          this.messageService.add({severity:'warn', summary:response.message});
        }
      },
      error: (error:any) => {
        console.error('GET UTLIZED COFF DATE API ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message || 'Oops! something went wrong'});
      }
    })
  }
}
