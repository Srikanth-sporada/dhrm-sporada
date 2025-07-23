import { Component, OnInit,ViewChild ,ElementRef, Renderer2} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import {environment} from './../../../../../environments/environment.prod'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {ClamAPIService} from 'src/app/new-contractor-mod/clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from "xlsx-js-style";
@Component({
  selector: 'app-van-facility-mapping',
  templateUrl: './van-facility-mapping.component.html',
  styleUrls: ['./van-facility-mapping.component.css']
})
export class VanFacilityMappingComponent implements OnInit {

  showAdd :boolean;
  userdtls:any[]=[]
  routelist:any[]=[]
  genid:any
  pickup:any
  transport:any
  route:any
  viewPayscaleForm=false
van_mapList:any[] =[]

  constructor(private api: ApiService,private dialog: MatDialog,private renderer: Renderer2,
    private OpApi:ClamAPIService) {

  }
  isadmin:any=sessionStorage.getItem('isadmin')=='true'?true:false;
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  plant: any = sessionStorage.getItem("plantcode");
  
  ngOnInit(): void {

this.getroute()
this.getpermList()

  }




  genIdChange(){
   
    this.userdtls=[]

  }
  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }
  verify() {
    if (this.genid == "" || this.genid == undefined) {
      // alert("Gen Id cannot be empty");
      this.openAlertDialog("Gen Id cannot be empty",'error')

      return;
    }
    this.OpApi.mid_Userdetails(this.genid,this.plant).subscribe((res: any) => {
console.log(res);

if(res[0].Van_Eligible == true){
  this.openAlertDialog("Already Van Facility Mapped",'error')
}else{
  this.userdtls =res
}

    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }
  getroute() {
    this.OpApi.getRoute(this.plant).subscribe((res: any) => {
// console.log(res);
this.routelist =res.filter((item:any) => item.Status == 'Active')
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }


  isSubmitFormValid(): boolean {
    return !!this.route && !!this.transport && !!this.pickup;
  }

  submitVan(){
    const  data = {
      route:this.route,
      transport:this.transport,
      pickup:this.pickup,
      gen_id:this.genid,
      applied_by:this.userEmpcode,
      plant:this.plant
    }

console.log(data);
this.OpApi.Van_Facility(data).subscribe((res: any) => {

  this.openAlertDialog('Van Facility Mapped','Check')
  this.genIdChange()
  this.getpermList()
  this.closeAllForms1()
   this.genid=null
      },error=>{
        console.log(error);
        this.openAlertDialog(error.error,'error')
      });
  


  }
  delete(data:any){

console.log(data);
this.OpApi.delete_Van_Facility(data).subscribe((res: any) => {

  this.openAlertDialog('Van Facility Made In-Active','Check')
  this.genIdChange()
  this.getpermList()
  this.closeAllForms1()
   this.genid=null
      },error=>{
        console.log(error);
        this.openAlertDialog(error.error,'error')
      });
  


  }
  

  getpermList() {
    this.OpApi.get_Van_Details(this.plant,).subscribe((res: any) => {
// console.log(res);
this.van_mapList =res
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }




  onView(data: any) {
    this.viewPayscaleForm = true
     this.showAdd = false;
     console.log(data);

     this.route= data.Route_Id
     this.transport = data.Transporter
     this.pickup = data.Pickup_Point
     this.genid = data.Gen_id
     

   }
 


   closeAllForms1(){
    this.viewPayscaleForm = false
  

    this.route= null
    this.transport = null
    this.pickup = null
    this.genid = null
   }


  exportExcel(): void {
 
 
   
     const transformedArray: any = this.van_mapList.map((obj: any) => {
      const {Route_Id,Van_Eligible, ...filteredObj } = obj; // Exclude fields
      const transformedObj: any = {};
  
      Object.keys(filteredObj).forEach(key => {
        const newKey = key.replace(/_/g, ' '); // Replace underscores with spaces
        transformedObj[newKey] = filteredObj[key];
      });
  
      return transformedObj;
    });
    //  console.log(transformedArray);
 
     var ws = XLSX.utils.json_to_sheet(transformedArray);
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
     XLSX.utils.book_append_sheet(wb, ws, "Van Mapping list");
     XLSX.writeFile(wb, "Van mapping list.xlsx");
   }
 

}
