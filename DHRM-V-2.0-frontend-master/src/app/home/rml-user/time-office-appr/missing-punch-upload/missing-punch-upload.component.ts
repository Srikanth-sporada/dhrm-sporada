import { Component, OnInit,ViewChild ,ElementRef, Renderer2} from "@angular/core";
import * as moment from "moment";
import { MatInput } from '@angular/material/input';
import { ApiService } from "src/app/home/api.service";
import * as XLSX from 'xlsx'
import {environment} from './../../../../../environments/environment.prod'
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import {ClamAPIService} from 'src/app/new-contractor-mod/clam-api.service'
// import { ToastComponent } from '../new-contractor-mod/toast/toast.component.ts'
import { MatDialog } from '@angular/material/dialog';
import { Subscriber } from "rxjs";
@Component({
  selector: "app-missing-punch-upload",
  templateUrl: "./missing-punch-upload.component.html",
  styleUrls: ["./missing-punch-upload.component.css"],
})
export class MissingPunchUploadComponent implements OnInit {
  @ViewChild('dateTimeInput') dateTimeInput: ElementRef;

  genid: any;
  date: any;
  odGgenid: any;
  odDate: any;
  odReason: any;
  existapln:any[] = [];
  trn_list:any[] = [];
  FP_list:any[] = [];
  ODList:any[] = [];
  execeshours:any[] = [];
  oDdata:any
  dayType:any;


  MaxIn:any
  MinIn:any
  MinOut:any
  MaxOut:any
  inDate: any;
  intime: any;
  outDate: any;
  outTime: any;
  reason: any;

  fpdata: any[];

  fpin: any;
  fpout: any;




  submit: boolean = true;
  odSubmit: boolean = true

  bulkData:any[];

  file:any;
  reasonList:any[];
  show_od_temp=false
  isadmin:any=sessionStorage.getItem('isadmin')=='true'?true:false;
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  ishr:string |null = sessionStorage.getItem('ishr');
  url=environment.path+'/'

  show_fp_temp: boolean = false;
  plant: any = sessionStorage.getItem("plantcode");
present_type_before:any
  verifybtn:boolean=true
  uploadBtn:boolean=true
  constructor(private api: ApiService,private dialog: MatDialog,private renderer: Renderer2,
    private OpApi:ClamAPIService) {
    // this.form.controls['genid'].valueChanges.subscribe(()=>{
    //   console.log('Value Change')
    // })
    // this.form.controls['date'].valueChanges.subscribe(()=>{
    //   console.log('Value Change')
    // })
  }

  ngOnInit() {

    // this.dayType =  0.5;
    this.api.getFpreason().subscribe((res:any)=>{
      if(res.status='success'){
        console.log(res.data)
        this.reasonList=res.data
        this.reason=''
      }else{
        // alert(res.message)
        this.openAlertDialog(res.message,'error')
      }
      
    })
  }

  clearDateTimeInput(input: HTMLInputElement) {
    input.value = ''; // Clear the input value
}

submitDateTime() {
  // Check if a date/time is selected
  if (this.inDate || this.intime) {

    console.log('Selected date/time:', this.inDate,this.intime);
  } else {
   alert('Please select a date/time before submitting.');
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
  verify() {
    if (this.genid == "" || this.genid == undefined) {
      // alert("Gen Id cannot be empty");
      this.openAlertDialog("Gen Id cannot be empty",'error')

      return;
    }
    if (this.date == "" || this.date == undefined) {
      // alert("Please select the date");
      this.openAlertDialog("Please select the date",'error')
      return;
    }
    this.api.forgottoPunchData(this.genid, this.date).subscribe((res: any) => {
      this.fpdata = res;
    });
    this.api
      .forgottoPunchCheck(this.genid, this.date, this.plant)
      .subscribe((res: any) => {
        if (res.status == "failed") {
          // alert(res.message);
          this.openAlertDialog(res.message,'error')
          this.inDate = undefined;
          this.intime = undefined;
          this.outDate = undefined;
          this.outTime = undefined;
          this.reason = undefined;
          this.show_fp_temp = false;
          return;
        }
        if (res.status == "success") {
          this.fpin = res.data.in_time;
          this.fpout = res.data.out_time;
          this.show_fp_temp = true;
          this.inDate = undefined;
          this.intime = undefined;
          this.outDate = undefined;
          this.outTime = undefined;
          this.reason = undefined;
        }
      });
  }

  onSubmit() {
    console.log("clicked");
    // console.log('intime',`${this.inDate} ${this.intime}`);
    // console.log('outtime',`${this.outDate} ${this.outTime}`);

    
    
    this.api
      .insertFotgotPunchData({
        inpunch: `${this.inDate} ${this.intime}` ,
        outpunch: `${this.outDate} ${this.outTime}` ,
        // outpunch: this.outDate,
        reason: this.reason,
        genid: this.genid,
        date: this.date,
        id: sessionStorage.getItem("user_name"),
        plant: sessionStorage.getItem("plantcode"),
      })
      .subscribe((res: any) => {
        if (res.status == "success") {
          this.inDate = undefined;
          this.intime = undefined;
          this.outDate = undefined;
          this.outTime = undefined;
          this.reason = undefined;
          this.show_fp_temp = false;
          this.fpdata=[]
          // alert(res.message);
          this.openAlertDialog(res.message,'Check')
        }else{
          // alert(res.message)
          this.openAlertDialog(res.message,'error')
        }
      });
      this.submit=true
  }
  private closeDateTimePicker() {
    // Trigger a click event on the input to blur it and close the datetime picker
    this.renderer.selectRootElement(this.dateTimeInput.nativeElement).dispatchEvent(new Event('click'));
  }

  checkSubmit() {

    // if (this.fpin == null && this.in != undefined && this.reason != undefined) {
    //   this.submit = false;
    // }

    // if (
    //   this.fpout == null &&
    //   this.out != undefined &&
    //   this.reason != undefined
    // ) {
    //   this.submit = false;
    // }
    if (
      // this.in != undefined &&
      // this.out != undefined &&
      this.reason != undefined &&
      this.reason !=''
    ) {
      this.submit = false;
    }else{
      this.submit = true;
    }
 

    this.closeDateTimePicker();
  }

  checkVerify() {
    console.log("check");
    this.show_fp_temp = false;
    this.fpdata = [];


    // console.log(this.date);
    
    // const maxOutTime = new Date(this.date);
    // maxOutTime.setDate(maxOutTime.getDate() + 1);
    // this.MaxOut = maxOutTime.toISOString().slice(0, 16);
  
    // const minOutTime = new Date(this.date);
    // minOutTime.setDate(minOutTime.getDate() );
    // // this.MinOut = minOutTime.toISOString().slice(0, 16);
    // this.MinOut = this.date



    // const maxInTime = new Date(this.date);
    // maxInTime.setDate(maxInTime.getDate() );
    // // this.MaxIn = maxInTime.toISOString().slice(0, 16);
    // this.MaxIn = this.date
  
    // const minInTime = new Date(this.date);
    // minInTime.setDate(minInTime.getDate() -1);
    // this.MinIn = minInTime.toISOString().slice(0, 16);


    // console.log(this.MaxOut);
    // console.log(this.MinOut);
    // console.log(this.MaxIn);
    // console.log(this.MinIn);
    
    
  }
  checkVerify_1() {
    console.log("check");
    this.show_fp_temp = false;
    this.fpdata = [];


    console.log(this.date);
    
    const maxOutTime = new Date(this.date);
    maxOutTime.setDate(maxOutTime.getDate() + 1);
    this.MaxOut = maxOutTime.toISOString().slice(0, 10);
  
    const minOutTime = new Date(this.date);
    minOutTime.setDate(minOutTime.getDate() );
    // this.MinOut = minOutTime.toISOString().slice(0, 16);
    this.MinOut = this.date



    const maxInTime = new Date(this.date);
    maxInTime.setDate(maxInTime.getDate() );
    // this.MaxIn = maxInTime.toISOString().slice(0, 16);
    this.MaxIn = this.date
  
    const minInTime = new Date(this.date);
    minInTime.setDate(minInTime.getDate() -1);
    this.MinIn = minInTime.toISOString().slice(0, 10);
    
    
  }
 

  fileUpload(event:any){
    console.log('file loadded')
    const file = event.target.files[0]
    // const data = XLSX.readFile()
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    fileReader.onload=(event:any)=>{
    let binaryData= event.target.result;
    let workbook=XLSX.read(binaryData,{type:'binary'})
    let sheetname = workbook.SheetNames[0]
    this.bulkData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname])
    this.verifybtn = false
    }
  }


  verify_bulkData(){
    this.api.verify_bulk({data:this.bulkData,plant:this.plant}).subscribe((res:any)=>{
      console.log(res)
      if(res.status=='failed'){
        alert(res.message)
        this.file=''
        this.verifybtn=true
        this.uploadBtn=true
      }else if(res.status=='successfull'){
        this.uploadBtn=false
        alert(`Record's Verified Successfully`)
      }
    })
  }


  upload_bulkdData(){
    this.api.insert_bulk_fp({data:this.bulkData,plant:this.plant,id:sessionStorage.getItem("user_name")}).subscribe((res:any)=>{
      if(res.status=='failed'){
        alert(res.message)
        this.verifybtn=true
        this.uploadBtn=true
      }
      console.log(res.status)
      if(res.status=='successfull'){
        this.verifybtn=true
        this.uploadBtn=true
        alert(`Record's Inserted Successfully`)
      }
    })
  }

  filechange(){
    this.verifybtn=true
    this.uploadBtn=true
  }


  Od_Verify() {

 if (!this.odGgenid || this.odGgenid.trim() === '' ) {
    this.openAlertDialog("Gen Id cannot be empty", 'error');
    return;
  } 
//  else if (!this.odReason || this.odReason.trim() === '' ) {
//     this.openAlertDialog("Reason cannot be empty", 'error');
//     return;
//   } 
  
  else if (!this.odDate || this.odDate.trim() === '') {
    this.openAlertDialog("Please select the date", 'error');
    return;
  }
console.log('this.odGgenid,this.odDate,this.plant',this.odGgenid,this.odDate,this.plant)

this.OpApi.getOperatorOD(this.odGgenid,this.odDate,this.plant).subscribe(res=>{
console.log(res)
this.oDdata = res
this.FP_list= this.oDdata.FP_list.recordsets[0]
this.execeshours= this.oDdata.execeshours.recordsets[0]
this.ODList= this.oDdata.ODList.recordsets[0]
this.trn_list= this.oDdata.trn_list.recordsets[0]
this.existapln= this.oDdata.existapln.recordsets[0]
this.present_type_before =this.trn_list[0].present_type
console.log(this.trn_list)
console.log(this.existapln)
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
    } 
   
    
    else{
      this.odSubmit=false
    }
    

  }


 
  oDSubmit(){

    console.log("submit")
    if (!this.odGgenid || this.odGgenid.trim() === '' ) {
      this.openAlertDialog("Gen Id cannot be empty", 'error');
      return;
    } 
   else if (!this.odReason || this.odReason.trim() === '' ) {
    this.openAlertDialog("Reason cannot be empty", 'error');
    
      return;
    } 
    else if(!this.dayType){
      this.openAlertDialog("Please select Half Day or Full Day", 'error');
      return;
    }
   else if (this.odReason.length < 10 ) {
    this.openAlertDialog("Reason must be at least 10 characters long", 'error');
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
      dayType:this.dayType,
      present_type_before:this.present_type_before
    }
    console.log(data);
    
    this.OpApi.applyoptrOD(data).subscribe((res:any) => {
      console.log(res)
      this.odGgenid=null
      this.odDate=null
      this.existapln=[]
      this.trn_list=[]
      this.FP_list=[]
      this.ODList=[]
      this.dayType=0.5
      this.show_od_temp=false
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
   

  }


  checkODVerify() {
    // this.odGgenid=null
    //   this.odDate=null
    this.existapln=[]
    this.trn_list=[]
    this.FP_list=[]
    this.ODList=[]
    this.odReason=null
    
    this.show_od_temp=false

  }


}
