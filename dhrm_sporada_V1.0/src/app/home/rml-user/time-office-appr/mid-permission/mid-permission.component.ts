import { Component, OnInit,ViewChild ,ElementRef, Renderer2} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import {environment} from './../../../../../environments/environment.prod'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {ClamAPIService} from 'src/app/new-contractor-mod/clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import { NonNullableFormBuilder } from "@angular/forms";
import { MessageService } from "primeng/api";
import * as moment from "moment";

@Component({
  selector: 'app-mid-permission',
  templateUrl: './mid-permission.component.html',
  styleUrls: ['./mid-permission.component.css']
})
export class MidPermissionComponent implements OnInit {
  all :any = sessionStorage.getItem("all");
  userDetails:any;
  item:any =JSON.parse(this.all);
    constructor(private api: ApiService,private dialog: MatDialog,private renderer: Renderer2,
      private OpApi:ClamAPIService, private messageService:MessageService) {
 
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
perm_list:any[] = [];
isadmin:any=sessionStorage.getItem('isadmin')=='true'?true:false;
userEmpcode:string |null = sessionStorage.getItem('user_name');
plant: any = sessionStorage.getItem("plantcode");

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }

    // this.getpermList()
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
    // console.log("BEFORE",this.date,this.intime,this.outtime);

    const formattedInTime = moment(this.intime).format('HH:mm');
    const formattedOutTime = moment(this.outtime).format('HH:mm');

    const inTimeParts = formattedInTime.split(':').map(Number);
    const outTimeParts = formattedOutTime.split(':').map(Number);
    console.log("AFTER",inTimeParts,outTimeParts);
    
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
      date:moment(this.date).format('YYYY-MM-DD'),
      intime: moment(this.intime).format('HH:mm'),
      outtime: moment(this.outtime).format('HH:mm'),
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
        this.openAlertDialog(error.message,'error')
      });
  }
}
