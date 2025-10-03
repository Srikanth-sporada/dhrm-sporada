import { Component, OnInit,ViewChild ,ElementRef, Renderer2} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import {environment} from './../../../../../environments/environment.prod'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {ClamAPIService} from 'src/app/new-contractor-mod/clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from "xlsx-js-style";
import { MessageService, ConfirmationService } from "primeng/api";
@Component({
  selector: 'app-route-master',
  templateUrl: './route-master.component.html',
  styleUrls: ['./route-master.component.css']
})
export class RouteMasterComponent implements OnInit {

  routelist:any[]=[]
  route:any
  slno:any
  viewForm = false 
  addForm = false
  excel_data:any[]=[]
  all:any;
  userDetails:any;
  constructor(private api: ApiService,private dialog: MatDialog,private renderer: Renderer2,
    private OpApi:ClamAPIService, private messageService:MessageService, private confirmationService:ConfirmationService) {

  }
  isadmin:any=sessionStorage.getItem('isadmin')=='true'?true:false;
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  plant: any = sessionStorage.getItem("plantcode");
  
  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
   this.getroute()

  }


  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }

  getroute() {
    this.OpApi.getRoute(this.plant).subscribe((res: any) => {
console.log(res);
this.excel_data =res
this.routelist =res.filter((item:any) => item.Status == 'Active')
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }

add_On(){
  this.addForm=true
}
view_On(data:any){
  console.log(data);
  this.slno = data.Route_Id
  this.viewForm=true
  this.route = data.Route_Name
 
}


close(){
  this.addForm=false
  this.viewForm=false
  this.route=null
}



submt_Route(){
this.OpApi.add_new_route(this.plant,this.route,this.userEmpcode).subscribe((res: any) => {

this.getroute()
this.close()
 this.route=null
 this.openAlertDialog('New Route Added','Check')
    },error=>{
      console.log(error);
      this.openAlertDialog(error.error,'error')
    });
}
Edit_route(){
this.OpApi.edit_route(this.plant,this.route,this.slno).subscribe((res: any) => {

this.getroute()
this.close()
 this.route=null
 this.openAlertDialog('Route updated','Check')
    },error=>{
      console.log(error);
      this.openAlertDialog(error.error,'error')
    });
}


delete(event:Event,data:any){
  this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure want to delete?',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            accept: () => {
                this.deleteAPICall(data)
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            }})
  
    }
    
deleteAPICall(data:any){
  console.log(data);
  this.OpApi.delete_route(data.Route_Id).subscribe((res: any) => {
    this.openAlertDialog('Route Mad In Active','Check')
    this.getroute()
     this.route=null
        },error=>{
          console.log(error);
          this.openAlertDialog(error.error,'error')
        });
}


    exportExcel(): void {
      const transformedArray: any = this.excel_data.map((obj: any) => {
        const { Created_By, Created_On, ...filteredObj } = obj; // Exclude fields
        const transformedObj: any = {};
    
        Object.keys(filteredObj).forEach(key => {
          const newKey = key.replace(/_/g, ' '); // Replace underscores with spaces
          transformedObj[newKey] = filteredObj[key];
        });
    
        return transformedObj;
      });
    
      var ws = XLSX.utils.json_to_sheet(transformedArray);
    
      // Apply yellow background and border styles to headers
      const headerRange = XLSX.utils.decode_range(ws['!ref']!);
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          fill: { fgColor: { rgb: "FFFF00" } }, // Yellow color
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
    
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Route Master list");
      XLSX.writeFile(wb, "Route master.xlsx");
    }
    


}
