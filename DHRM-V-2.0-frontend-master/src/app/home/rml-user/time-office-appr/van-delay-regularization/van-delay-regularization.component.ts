import { Component, OnInit,ViewChild ,ElementRef, Renderer2} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import {environment} from './../../../../../environments/environment.prod'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'

import {ClamAPIService} from 'src/app/new-contractor-mod/clam-api.service'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-van-delay-regularization',
  templateUrl: './van-delay-regularization.component.html',
  styleUrls: ['./van-delay-regularization.component.css']
})
export class VanDelayRegularizationComponent implements OnInit {
  item:any = sessionStorage.getItem("all");
  
  date:any
  route:any
  transporter:any
  Category:any
  lc_min:any
  driver:any
  operator_date:any
  trainee_date:any
  minDate: string;
  maxDate: string;
  userList:any[]=[]
  errorList:any[]=[]
  routelist:any[]=[]
  AppliedList:any[]=[]
  constructor(private api: ApiService,private dialog: MatDialog,private renderer: Renderer2,
    private OpApi:ClamAPIService) {
      this.setDateRange();
  }
  isadmin:any=sessionStorage.getItem('isadmin')=='true'?true:false;
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  plant: any = sessionStorage.getItem("plantcode");
  
  ngOnInit(): void {

this.getroute()

this.getdetails()

  }

  setDateRange() {
    this.get_payroll()
    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 27); // Previous month 26th
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Yesterday

    // Format dates to YYYY-MM-DD for input type="date"
    // this.minDate = previousMonth.toISOString().split('T')[0];
    // this.maxDate = yesterday.toISOString().split('T')[0];
  }

  onCategoryChange() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);


    if (this.Category === 'O') {
      this.minDate = this.operator_date.bill_Start_date_O.substring(0, 10); // Extract YYYY-MM-DD
      const endDateO = new Date(this.operator_date.bill_End_Date_O);
      this.maxDate = endDateO < today ? this.operator_date.bill_End_Date_O.substring(0, 10) : yesterday.toISOString().substring(0, 10);
 
    } else if (this.Category === 'T') {
      this.minDate = this.trainee_date.bill_Start_date_T.substring(0, 10); // Extract YYYY-MM-DD
      const endDateT = new Date(this.trainee_date.bill_End_Date_T);

    // If bill_End_Date_T is before today, use it. Otherwise, use yesterday.
    this.maxDate = endDateT < today ? this.trainee_date.bill_End_Date_T.substring(0, 10) : yesterday.toISOString().substring(0, 10);

    
    } else {
      this.minDate = ''; // Reset if no category selected
      this.maxDate = ''; // Reset if no category selected
    }
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
// console.log(res);
this.routelist =res
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }
  getdetails() {
    this.OpApi.get_Van_Delay_Regularization_Details(this.plant).subscribe((res: any) => {
// console.log(res);
this.AppliedList =res
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }
  get_payroll() {
    this.OpApi.get_route_payroll(this.plant).subscribe((res: any) => {
console.log(res[0][0]);
console.log(res[1][0]);
this.operator_date = res[0][0]
this.trainee_date= res[1][0]
// this.routelist =res
    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });

  }



  isverifyValid(): boolean {
    return !!this.route && !!this.date  && !!this.Category;
  }
  issubmitValid(): boolean {
    return !!this.transporter && !!this.driver && !!this.lc_min ;
  }
  verify(){
    if (this.date == "" || this.date == undefined || this.route =='' || this.route == undefined || this.Category == '' || this.Category == undefined) {
      // alert("Gen Id cannot be empty");
      this.openAlertDialog("Fields cannot be empty",'error')

      return;
    }
    this.OpApi.get_User_route_dtls(this.date,this.plant,this.route,this.Category).subscribe((res: any) => {
      this.userList =res

// if(res[0].Van_Eligible == true){
//   this.openAlertDialog("Already Van Facility Mapped",'error')
// }else{
//   this.userList =res
// }

    },error=>{
      console.log(error);
      this.openAlertDialog("Data not found",'error')
    });
  }


  submit(){
    if (this.transporter == "" || this.transporter == undefined || this.driver =='' || this.driver == undefined || this.lc_min =='' || this.lc_min == undefined) {
      // alert("Gen Id cannot be empty");
      this.openAlertDialog("Fields cannot be empty",'error')

      return;
    }

 const data = {
  userlist :this.userList,
 transporter: this.transporter,
driver:this.driver,
lc_min :this.lc_min,
applied_by:this.userEmpcode,
date:this.date,
plant:this.plant,
Category:this.Category,
 }
 this.OpApi.Van_delay(data).subscribe((res: any) => {
console.log(res);

  this.openAlertDialog(res,'Check')
  // this.genIdChange()
  this.getdetails()
  this.closeAllForms1()
   this.date=null
      },error=>{
        console.log(error.error);
        this.openAlertDialog(error.error,'Check')
      });
  

  }

  closeAllForms1(){
   
  

    this.route= null
    this.date =null
    this.transporter = null
    this.Category = null
    this.driver = null
    this.lc_min = null
    this.userList = []
   }



}
