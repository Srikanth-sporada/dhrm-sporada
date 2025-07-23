import { Component, OnInit,ViewChild ,ElementRef, Renderer2} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import {environment} from './../../../../../environments/environment.prod'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {ClamAPIService} from 'src/app/new-contractor-mod/clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import { error } from "console";
import { NonNullableFormBuilder } from "@angular/forms";
@Component({
  selector: 'app-mid-permission',
  templateUrl: './mid-permission.component.html',
  styleUrls: ['./mid-permission.component.css']
})
export class MidPermissionComponent implements OnInit {
  all :any = sessionStorage.getItem("all");
  item:any =JSON.parse(this.all);
    constructor(private api: ApiService,private dialog: MatDialog,private renderer: Renderer2,
      private OpApi:ClamAPIService) {
 
    }
  genid:any
  empl_slNo = this.item.empl_slno
  date:any
  intime:any
  outtime:any
  reason:any
  duration:any
  bc_duration:any
userdtls:any[] =[]
perm_list:any[] =[]
isadmin:any=sessionStorage.getItem('isadmin')=='true'?true:false;
userEmpcode:string |null = sessionStorage.getItem('user_name');
plant: any = sessionStorage.getItem("plantcode");

  ngOnInit(): void {
    this.getpermList()
  }


  genIdChange(){
   
    this.userdtls=[]
    this.intime=''
    this.outtime=''
    this.reason=''
    this.duration =''
    this.date=''
    this.bc_duration=''
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
// console.log(res);
this.userdtls =res
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }
  getpermList() {
    this.OpApi.get_optr_Mid_permission_data(this.plant,this.empl_slNo,).subscribe((res: any) => {
// console.log(res);
this.perm_list =res
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }



  calculateDuration() {
    if (!this.intime || !this.outtime) {
      // this.duration = 'Invalid Time';
      this.openAlertDialog('Invalid Time','error')
      return;
    }

    const inTimeParts = this.intime.split(':').map(Number);
    const outTimeParts = this.outtime.split(':').map(Number);

    const inMinutes = inTimeParts[0] * 60 + inTimeParts[1];
    const outMinutes = outTimeParts[0] * 60 + outTimeParts[1];

    if (outMinutes < inMinutes) {
      this.openAlertDialog('Invalid Time Range','error')
      return;
    }

    const diffMinutes = outMinutes - inMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
  
    
this.bc_duration = diffMinutes
    this.duration = `${hours}h ${minutes}m`;
  }

  isFormValid(): boolean {
    return !!this.date && !!this.intime && !!this.outtime;
  }
  isSubmitFormValid(): boolean {
    return !!this.date && !!this.intime && !!this.outtime && !!this.reason;
  }

  submitPermission(){
  const  data = {
      date:this.date,
      intime:this.intime,
      outtime:this.outtime,
      duration:this.bc_duration,
      reason:this.reason,
      gen_id:this.genid,
      applied_by:this.userEmpcode,
      plant:this.plant
    }

console.log(data);
this.OpApi.mid_permission(data).subscribe((res: any) => {

  this.openAlertDialog('Mid day Permission Applied','Check')
  this.genIdChange()
  this.getpermList()
   this.genid=null
      },error=>{
        console.log(error);
        this.openAlertDialog(error.error,'error')
      });
  


  }


}
