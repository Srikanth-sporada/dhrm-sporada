import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from '../../../../../environments/environment.prod'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {ClamAPIService} from 'src/app/new-contractor-mod/clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'src/app/new-contractor-mod/confirm-dialog/confirm-dialog.component'
import {ConfirmDialogReasonComponent} from 'src/app/new-contractor-mod/confirm-dialog-reason/confirm-dialog-reason.component';
import { MessageService } from 'primeng/api';
import { from } from 'rxjs';
import * as moment from 'moment';
@Component({
  selector: 'app-od',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

  genid: any;
  date: any;
//  permission
  odDate: any;
  odReason: any;
  odPermission: any;
  existapln:any[] = [];
  trn_list:any[] = [];
  FP_list:any[] = [];
  ODList:any[] = [];
  execeshours:any[] = [];
  trnPermission: any[] = [];
  oDdata:any
  permission:any
  odSubmit: boolean = true
  show_od_temp=false
  odGgenid: any;

  // leave
  fromdate:any
  todate:any
  leave_type:any
  optr_leave_details:any ={}
  optr_leave_eligibilty:any

  optr_leave_balance: any = {
    // Elgbl_CL: '',
    // Elgbl_PL: '',
    // Elgbl_Sick_Leave: '',
    // Elgbl_ESI_Leave: '',
    // Elgbl_Adv_Leave: '',
    // Availd_CL: '',
    // Availd_PL: '',
    // Availd_Sick_Leave: '',
    // Availd_ESI_Leave: '',
    // Availd_Adv_Leave: '',
    // Balnc_CL: '',
    // Balnc_PL: '',
    // Balnc_Sick_Leave: '',
    // Balnc_ESI_Leave: '',
    // Balnc_Adv_Leave: ''
  };
  
  leave_Reason:any
  show_leave_temp=false
  first_half:any
  second_half:any
  first: boolean = false;
  second: boolean = false;
  duration: number = 0;
  halfCheck:boolean= true
  isadmin:any=sessionStorage.getItem('isadmin')=='true'?true:false;
  user:any=sessionStorage.getItem('ars')=='ars'?true:false;
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  plant: any = sessionStorage.getItem("plantcode");
  gen_id: any = sessionStorage.getItem("gen_id");
  url=environment.path+'/'
  emp_permissionList:any
  maxDate :any
  leaveSubmit: boolean=true
  emp_LeaveList: any;
  // optr_leave_balance: any;
  selectedTabIndex: number; 
  all:any;
  userDetails:any;
  // const previousDay = new Date(currentDate);
  // previousDay.setDate(previousDay.getDate() - 1);
  constructor(private dialog: MatDialog,
    private OpApi:ClamAPIService,private messageService:MessageService) { 

this.odGgenid = this.gen_id

    }

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.fullname.toUpperCase()+`(${this.all.gen_id})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }

    console.log(this.plant);
    this.plant= sessionStorage.getItem("plantcode");
    

    if(this.plant ==='1200'){
    this.selectedTabIndex=2
    }else{
      this.selectedTabIndex=0
    }
    this.get_Mst_Permission()
    this.get_trn_emp_permission()
    this.get_leave_details()
    this.get_leave_eligibility()
    this.get_trn_emp_leave()
    this.get_leave_balanace()
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    // Format the date to YYYY-MM-DD
    this.maxDate = new Date(yesterday)
  }

  get_Mst_Permission(){
    this.OpApi.getMstPermission(this.plant).subscribe( (res:any) =>{
      this.permission=res
      this.odPermission=this.permission[0]?.Permission_Hrs
      // console.log(this.odPermission)
    })
  }
get_trn_emp_permission(){
  this.OpApi.getTrnPermission(this.gen_id).subscribe((res:any)=>{
this.emp_permissionList =res
// console.log(res)
  })
}
get_trn_emp_leave(){
  this.OpApi.getTrnLeave(this.gen_id).subscribe((res:any)=>{
this.emp_LeaveList =res
console.log(res)
  })
}

verify_Data(){
  
}


  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }

 

  checkVerify() {
    //console.log("check");
    this.show_od_temp = false;
    this.oDdata = [];
    this.FP_list=[]
   this.execeshours= []
   this.ODList= []
   this.trn_list= []
   this.existapln= []
   this.trnPermission=[]
   this.odReason=null
  }

  permission_verify() {

    if (!this.odGgenid || this.odGgenid == '' ) {
       this.openAlertDialog("Gen Id cannot be empty", 'error');
       return;
     } 
   //  else if (!this.odReason || this.odReason.trim() === '' ) {
   //     this.openAlertDialog("Reason cannot be empty", 'error');
   //     return;
   //   } 
     
     else if (!this.odDate || this.odDate === '') {
       this.openAlertDialog("Please select the date", 'error');
       return;
     }
   //console.log('this.odGgenid,this.odDate,this.plant',this.odGgenid,this.odDate,this.plant)
   
  //  formatted OD Date
  const formattedOdDate = moment(this.odDate).format('YYYY-MM-DD')
   this.OpApi.verifyOptrPermission(this.odGgenid,formattedOdDate,this.plant).subscribe(res=>{
   //console.log(res)
   this.oDdata = res
   this.FP_list= this.oDdata.FP_list.recordsets[0]
   this.execeshours= this.oDdata.execeshours.recordsets[0]
   this.ODList= this.oDdata.ODList.recordsets[0]
   this.trn_list= this.oDdata.trn_list.recordsets[0]
   this.existapln= this.oDdata.existapln.recordsets[0]
   this.trnPermission= this.oDdata.trn_permission.recordsets[0]

   this.show_od_temp=true
   },(error:any) => {
     if (error.status === 400) {
       console.log(error)
       this.openAlertDialog(`${error.error}`,'error');
      
     }
      else {
       this.openAlertDialog('Error in connection','error');
      
     }
   })
   
   
      
     }
   
   
     checkODSubmit() {
       if (!this.odReason || this.odReason.trim() === '' ) {
         this.openAlertDialog("Reason cannot be empty", 'error');
         return;
       } else{
         this.odSubmit=false
       }
       
   
     }
  
    
     oDSubmit(){
       if (!this.odGgenid || this.odGgenid.trim() === '' ) {
         this.openAlertDialog("Gen Id cannot be empty", 'error');
         return;
       } 
      else if (!this.odReason || this.odReason.trim() === '' ) {
         this.openAlertDialog("Reason cannot be empty", 'error');
         return;
       } 
      else if (this.odReason.length < 10 ) {
         this.openAlertDialog("Reason must be atleast 10 characters ", 'error');
         return;
       } 
       
       else if (!this.odDate || this.odDate.trim() === '') {
         this.openAlertDialog("Please select the date", 'error');
         return;
       }
      else{
   
       const data={
         gen_id:this.odGgenid,
         attn_date:this.odDate,
         reason:this.odReason,
         plant:this.plant,
         userEmpcode:this.userEmpcode,
         odPermission:this.odPermission

       }
       this.OpApi.submitOptrPermission(data).subscribe((res:any) => {
        // console.log(res.status)
        // const statusCode = res.status; // Access the status code
        // console.log('HTTP status code:', statusCode);
        //  console.log(res)
if(res.status === 200){
        this.odGgenid=this.gen_id
        this.odDate=null
        this.existapln=[]
        this.trn_list=[]
        this.FP_list=[]
        this.ODList=[]
        this.show_od_temp=false
        this.odReason=
        this.get_trn_emp_permission()
        this.openAlertDialog(res.message,'check');
      //  this.handleResponse(res)
}else if(res.status === 201){
  // this.openAlertDialog(res.message,'check');
  this.openConfirmationDialog(res.message);
}
       },(error:any) => {
         if (error.status === 400) {
           // console.log(error)
           this.openAlertDialog(`${error.error}`,'error');
          
         }
          else {
           this.openAlertDialog('Error in connection','error');
          
         }
       })
   
      }
      
   
     }

     handleResponse(response: string) {
      if (response.startsWith('Permission is left')) {
        this.openConfirmationDialog(response);
        //console.log("2ndn permission")
      } 
      // else if (response.startsWith('Permission Applied')) {
      //   this.openAlertDialog(response,'check');
      //   console.log("2ndn permission")
      // } 
      else {
        //console.log("other response permission")
        this.openAlertDialog(response,'check');
      }
    }



     openConfirmationDialog(message: string) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          icon: 'warning',
          message: message,
          confirmText: 'Yes',
          cancelText: 'No'
        }
      })
  
  
  
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          // User confirmed, execute the action (e.g., calling applyPermission)
          this.apply_2nd_Permission();
        } else {
          console.log('You Cancelled Permission')
          // this.openAlertDialog(`You Cancelled Permission`,'error');
        }
      });
    }
 
    
    apply_2nd_Permission(){
      const data={
        gen_id:this.odGgenid,
        attn_date:this.odDate,
        reason:this.odReason,
        plant:this.plant,
        userEmpcode:this.userEmpcode,
        odPermission:this.odPermission
  
      }

      this.OpApi.sec_permission(data).subscribe((res:any) => {
        //console.log(res)
        this.odGgenid=this.gen_id
        this.odDate=null
        this.existapln=[]
        this.trn_list=[]
        this.FP_list=[]
        this.ODList=[]
        this.show_od_temp=false
        this.odReason=null
        this.get_trn_emp_permission()
        this.openAlertDialog(res,'check');
    },(error:any) => {
      if (error.status === 400) {
        // console.log(error)
        this.openAlertDialog(`${error.error}`,'error');
       
      }
       else {
        this.openAlertDialog('Error in connection','error');
       
      }
    })
  

    }


    //
    get_leave_details() {
      this.OpApi.get_leave_details(this.odGgenid, this.plant).subscribe(
        (res: any) => {
          // Check if res is not null or undefined before assigning to optr_leave_details
          this.optr_leave_details = res || {};
          // console.log(this.optr_leave_details);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    

// Leave 
    // get_leave_details(){

    //   this.OpApi.get_leave_details(this.odGgenid,this.plant).subscribe((res:any) => {
    //     this.optr_leave_details = res
    //     console.log(this.optr_leave_details)
    //   },(error)=>{
    //     console.log(error)
    //   })

    // }
    get_leave_eligibility(){

      this.OpApi.get_leave_elgibility(this.plant).subscribe((res:any) => {
        this.optr_leave_eligibilty = res
        // console.log(this.optr_leave_eligibilty)
      },(error)=>{
        console.log(error)
      })



    }
    // get_leave_balanace(){

    //   this.OpApi.get_leave_blnc(this.userEmpcode).subscribe((res:any) => {
    //     this.optr_leave_balance = res
    //     console.log(this.optr_leave_balance)
    //   },(error)=>{
    //     console.log(error)
    //   })



    // }


    get_leave_balanace() {
      this.OpApi.get_leave_blnc(this.userEmpcode).subscribe(
        (res: any) => {
          // Check if res is not null or undefined before assigning to optr_leave_balance
          this.optr_leave_balance = res || {};
          console.log(this.optr_leave_balance);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    

    checkleaveSubmit() {
      if (!this.leave_Reason || this.leave_Reason.trim() === '' ) {
        this.openAlertDialog("Reason cannot be empty", 'error');
        return;
      } else{
        this.leaveSubmit=false
      }
      
  
    }

    checkleaveVerify(){
this.fromdate=null
this.todate=null
this.leave_Reason=null
this.first_half=null
this.second_half=null
this.first=false
this.second=false
    }

    toggleCheckbox(checkbox: string) {
      if (checkbox === 'first') {
        // this.first = !this.first;
        // this.second = !this.first;

        this.second_half = null; // Disable second when first is selected
      } else if (checkbox === 'second') {
        // this.second = !this.second;
        // this.first = !this.second;
        this.first_half = null; // Disable first_half when second_half is selected
      }
  
      // this.updateDuration();
    }
   

    updateDuration(){
     
      let duration = 0
      let option= this.leave_type
      console.log(option)
      if(this.fromdate > this.todate){
        this.openAlertDialog("From Date must be less than To Date", 'error');
      }
      // else if( option.SAP_code =='1000'  ){
      //   this.halfCheck=false



      //   if (this.fromdate && !this.todate) {
      //     this.todate = this.fromdate;
          
      //   }
      //   if(this.fromdate === this.todate){
      //     this.halfCheck=true
      //     let fromDateObj = new Date(this.fromdate);
      //     let toDateObj = new Date(this.todate);
      //     console.log("same date= ", this.fromdate, this.todate)
      //     let timeDiff = toDateObj.getTime() - fromDateObj.getTime();
      //     duration = (timeDiff / (1000 * 3600 * 24)) +1;
      //     duration = (this.first_half || this.second_half) ?(duration-0.5) : duration;
         
      //     console.log( (timeDiff / (1000 * 3600 * 24)) +1)
      //     console.log(duration)
      // this.duration = duration;

      //     // duration += (timeDiff / (1000 * 3600 * 24)) ;
      //   }else if(this.fromdate !== this.todate){
      //     this.halfCheck=false
      //     let fromDateObj = new Date(this.fromdate);
      //     let toDateObj = new Date(this.todate);
      //     console.log("different date= ", this.fromdate, this.todate)
      //     const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
      //     duration += timeDiff === 0 ? 1 : (timeDiff / (1000 * 3600 * 24)) + 1;
      //     duration = (this.first_half || this.second_half)?(duration-0.5) : duration;
      
      //     // duration += timeDiff === 0 ? 1 : (timeDiff / (1000 * 3600 * 24)) + 1;
      //   console.log("duration",duration)
      //   this.duration = duration;
      //     if (option.Max > 0 && (duration > option.Max || duration < option.Min)) {
      //       this.openAlertDialog(`${option.Leave_Type} can be applied for Min ${option.Min} days and Max ${option.Max} days`, 'error');
      //       return;
      //     }
      //   }

   
      
      


        
      // }
      else{



        if (this.fromdate && !this.todate) {
          this.todate = this.fromdate;
          this.halfCheck=false
        }
        if(this.fromdate === this.todate){
          let fromDateObj = new Date(this.fromdate);
          let toDateObj = new Date(this.todate);
          console.log("same date= ", this.fromdate, this.todate)
          let timeDiff = toDateObj.getTime() - fromDateObj.getTime();
          duration = (timeDiff / (1000 * 3600 * 24)) +1;
          duration = (this.first_half || this.second_half) ?(duration-0.5) : duration;
         
          console.log( (timeDiff / (1000 * 3600 * 24)) +1)
          console.log(duration)
      this.duration = duration;

          // duration += (timeDiff / (1000 * 3600 * 24)) ;
        }else if(this.fromdate !== this.todate){
          let fromDateObj = new Date(this.fromdate);
          let toDateObj = new Date(this.todate);
          console.log("different date= ", this.fromdate, this.todate)
          const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
          duration += timeDiff === 0 ? 1 : (timeDiff / (1000 * 3600 * 24)) + 1;
          duration = (this.first_half || this.second_half)?(duration-0.5) : duration;
      
          // duration += timeDiff === 0 ? 1 : (timeDiff / (1000 * 3600 * 24)) + 1;
        console.log("duration",duration)
        this.duration = duration;
          if (option.Max > 0 && (duration > option.Max || duration < option.Min)) {
            this.openAlertDialog(`${option.Leave_Type} can be applied for Min ${option.Min} days and Max ${option.Max} days`, 'error');
            return;
          }
        }

   
      
      } 


     
    }





    // submit
    leave_submit(){
      let option= this.leave_type
        if (!this.leave_type) {
        this.openAlertDialog("Please select Leave Type", 'error');
        return;
      }
   else if (!this.fromdate || this.fromdate === '') {
        this.openAlertDialog("Please select the  from date", 'error');
        return;
      }
      else if (!this.todate || this.todate === '') {
        this.openAlertDialog("Please select the To date", 'error');
        return;
      }
    else  if(this.fromdate > this.todate){
        this.openAlertDialog("From Date must be less than To Date", 'error');
        return;
      }
      else if (!this.leave_Reason || this.leave_Reason.trim() === '' ) {
    this.openAlertDialog("Reason cannot be empty", 'error');
    return;
  } 
 else if (this.leave_Reason.length < 10 ) {
    this.openAlertDialog("Reason must be atleast 10 characters ", 'error');
    return;
  }
  else if (option.Max > 0 && (this.duration > option.Max || this.duration < option.Min)) {
    this.openAlertDialog(`${option.Leave_Type} can be applied for Min ${option.Min} days and Max ${option.Max} days`, 'error');
    return;
  }
  
  else{

    const data ={
      Empcode: this.userEmpcode,
    plant:this.plant,
    reason:this.leave_Reason,
    fromdate:this.fromdate,
    todate:this.todate,
    first_half:this.first_half,
    second_half:this.second_half,
    duartion:this.duration,
    leave_type:this.leave_type,
    gen_id:this.gen_id,
    approver1: this.optr_leave_details.a1_alno  ,
    approver2:  this.optr_leave_details.a2_alno ,
    }

    console.log(data)


    this.OpApi.submit_optr_leave(data).subscribe((res:any)=>{
      this.openAlertDialog(res, 'check');
      this.leave_Reason=null
      this.leave_type=null
      this.fromdate=null
      this.todate=null
      this.first_half=false
      this.second_half=false
      this.duration=0
      this.get_leave_balanace()
      this.get_leave_details()
      this.get_leave_eligibility()
      this.get_trn_emp_leave()

    },(error:any) => {
      if (error.status === 400) {
        console.log(error)
        this.openAlertDialog(`${error.error}`,'error');
       
      }
       else {
        this.openAlertDialog('Error in connection','error');
       
      }
    })
  }



  




    }

    


    openConfirmDialogWithReason(message: string ,data:any ,type:any): void {
      const dialogRef = this.dialog.open(ConfirmDialogReasonComponent, {
        data: {
          icon: 'warning',
          message: message,
          confirmText: 'Yes',
          cancelText: 'No',
          buttonName:'Cancel'
        },
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result.result) {
        
        //   console.log(result)
        //      console.log('Dialog result:', result.result);
        // console.log('Dialog reason:', result.reason);
        //   console.log(data)
       

if(type==='Permission'){
  const permission={
    data:data,
    permission_reason:result.reason
  }

  this.OpApi.permission_Cancel(permission).subscribe((res:any) =>{
    this.openAlertDialog(res,'Check');
    this.get_trn_emp_permission()
  },(error)=>{
    if (error.status === 400) {
      this.openAlertDialog(`${error.error}`,'error');
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
  })

}else if (type==='leave'){
  const leave={
    data:data,
    cncl_reason:result.reason
  }
  this.OpApi.leave_Cancel(leave).subscribe((res:any) =>{
    this.openAlertDialog(res,'Check');
    this.get_leave_balanace()
    this.get_leave_details()
    this.get_leave_eligibility()
    this.get_trn_emp_leave()
  },(error)=>{
    if (error.status === 400) {
      this.openAlertDialog(`${error.error}`,'error');
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
  })
}


         
        } 
        else {
        //  this.openAlertDialog(`You Cancelled Leave`,'error');

        console.log('');
        
        }
      });
     
    }



    leave_cancel_Popup(data:any){
      this.openConfirmDialogWithReason("Do you want to cancel leave",data ,"leave");
    }
    permission_cancel_Popup(data:any){
      this.openConfirmDialogWithReason("Do you want to cancel Permisson",data,'Permission');
    }

 

}
