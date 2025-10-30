import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { Location } from '@angular/common';
import * as XLSX from'xlsx'
import moment from 'moment';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import { ClamAPIService } from '../clam-api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.css']
})
export class LeaveMasterComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  leave_mst_form:any
  selectedGenId: string = '';
  all:any;
  userDetails:any
  url=environment.path+'/'
  uploadedFile:any
  parsedData: any[];
  showForm = false
  showsingleUpdt = false
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  mst_leave_data:any
  updateReocrds:any
  nonValidatedRecords:any
  validatedRecords:any
  validOpt:any
  // selectedFile:any
  constructor(
    private api:ClamAPIService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private messageService:MessageService,
  ) { 


    this.leave_mst_form = this.fb.group({
      plant: [''],
  emp_id: [''],
  gen_id: [''],
  fullname: [''],
  Calendar_Year:[''],
  CL: [''],
  PL: [''],
  Sick_Leave: [''],
  ESI_Leave: [''],
  Adv_Leave: ['']
    })
  }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.get_mst_Leave_data()
  }

  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
        confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
        
      }
    });
  }
  

  handleFileInput(event: any): void {
    const selectedFile = event.target.files[0];

    // console.log(selectedFile)
    const fileReader = new FileReader();
  
    fileReader.onload = (event: any) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, {
        type: 'binary',
        cellDates: true, 
        dateNF: 'yyyy-mm-dd',
      });
      const sheetname = workbook.SheetNames[0];
       this.parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname], {
        raw: false, 
      });
      
      this.parsedData = this.convertDataTypes(this.parsedData);

      // console.log(this.parsedData);
      // console.log(this.parsedData.length);
    };
  
    fileReader.readAsBinaryString(selectedFile);
  }
  

  resetFileInput() {

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.parsedData=[]
    }
  }
  
  convertDataTypes(data: any[]): any[] {
    return data.map((row) => {
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const value = row[key];
          if (value === 'null') {
            row[key] = null;
          } else if (!isNaN(value)) {
            row[key] = parseFloat(value);
          }
        }
      }
      return row;
    });
  }

get_mst_Leave_data(){
  this.api.get_Mst_Leave(this.plant_Code).subscribe((res:any)=>{
    this.mst_leave_data=res
  },(error:any)=>{
    console.log(error);
    this.messageService.add({severity:'error',summary:error.message})
  })
}
verifydata(){
  // console.log(this.parsedData);

  if(this.parsedData.length>0  ){
    const data={
      mst_leave_Data : this.parsedData,
      plant : this.plant_Code,
      empCode : this.userEmpcode 
    }
    this.validatedRecords =[]
    this.nonValidatedRecords =[]
    this.updateReocrds =[]
      this.api.verify_leave_Mst(data).subscribe((res :any) => {
        // console.log(res)
    
    
        if(!res){
          this.get_mst_Leave_data()
          this.showForm=false
        }else{
          this.showForm=true
    this.validOpt = res
    
    // console.log(this.validOpt)
    

    
if(this.validOpt.validatedRecords.length === 0 && this.validOpt.updateReocrds.length === 0 && this.validOpt.nonValidatedRecords.length===0 ){
  this.clsoe()
  this.openAlertDialog(`All records Updated`,'check')
}else{
  this.showForm= true
  this.validatedRecords=this.validOpt.validatedRecords
  this.nonValidatedRecords=this.validOpt.nonValidatedRecords
  this.updateReocrds=this.validOpt.updateReocrds
}

    
        }
      }, (error:any)=>{
    console.log(error);
    this.messageService.add({severity:'error',summary:error.message})
  })
  }else{
    this.openAlertDialog(`Please select the file `,'error')
  }

}

clsoe(){
  this.showForm= false
  
  this.validatedRecords=[]
this.nonValidatedRecords=[]
this.updateReocrds=[]
this.resetFileInput();
}
clsoe2(){
  this.showsingleUpdt= false


}




submit(){

  // console.log(this.validatedRecords)
  const data={
    valid_Data : this.validatedRecords,
    plant : this.plant_Code,
    empCode : this.userEmpcode 
  }
  this.api.submit_leave_mst(data).subscribe((res:any) =>{
    // console.log(res)
    this.openAlertDialog(`${res}`,'check')
    this.get_mst_Leave_data()
    this.validatedRecords=[]
    

if(this.validatedRecords.length == 0 && this.updateReocrds.length == 0 && this.nonValidatedRecords.length==0 ){
  this.clsoe()
}else{
  this.showForm= true
}

  },(error) => {
    if (error.status === 400) {
      console.log(error)
      this.openAlertDialog(`${error.error}`,'error');
      
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
})
  
}
bulkUpdate(){
  const data={
    updateReocrds : this.updateReocrds,
    plant : this.plant_Code,
    empCode : this.userEmpcode 
  }
  // console.log(this.updateReocrds)
  this.api.update_bulk_leave_mst(data).subscribe((res:any) =>{
    // console.log(res)
    this.openAlertDialog(`${res}`,'check')
    this.updateReocrds = []
    // this.resetFileInput();
    this.get_mst_Leave_data()
    
if(this.validatedRecords.length == 0 && this.updateReocrds.length == 0 && this.nonValidatedRecords.length==0 ){
  this.clsoe()
}else{
  this.showForm= true
}
  },(error) => {
    if (error.status === 400) {
      console.log(error)
      this.openAlertDialog(`${error.error}`,'error');
      
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
})
  
}



edit(data:any){
  // console.log(data)
  this.leave_mst_form.patchValue({
    plant: data.plant,
    emp_id: data.emp_id,
    gen_id: data.gen_id,
    fullname: data.fullname,
    Calendar_Year: data.Calendar_Year,
    CL: data.CL,
    PL: data.PL,
    Sick_Leave: data.Sick_Leave,
    ESI_Leave: data.ESI_Leave,
    Adv_Leave: data.Adv_Leave
  });
  this.showsingleUpdt=true
}
single_Update(){
// this.showsingleUpdt=true
  // console.log(this.leave_mst_form.value)
  const data1={
    updateReocrds : this.leave_mst_form.value,
    plant : this.plant_Code,
    empCode : this.userEmpcode 
  }
  this.api.update_leave_mst(data1).subscribe((res:any) =>{
    // console.log(res)
    this.openAlertDialog(`${res}`,'check')
    this.showsingleUpdt=false
    this.get_mst_Leave_data()
   
  },(error) => {
    if (error.status === 400) {
      console.log(error)
      this.openAlertDialog(`${error.error}`,'error');
      
    }
     else {
      this.openAlertDialog('Error in connection','error');
     
    }
})
  
}



invalid_Data(){
  this.exportExcel(this.nonValidatedRecords , 'Invalid Data' , 'Invalid_Leave_Mst.xlsx')
}

download(){
  this.exportExcel(this.mst_leave_data , 'Leave Master Data ' , 'Leave_Mst.xlsx')
}

exportExcel(dataset:any, sheetName:any ,fileName:any) : void{

  const transformedArray:any = dataset.map((data: any) =>{
    const transformedObj:any = {};
    Object.keys(data).forEach(key => {
      const newKey = key.replace(/_/g, ' '); 
      transformedObj[newKey] = data[key];
     
    });
    return transformedObj;
   
  
  })
  // console.log(transformedArray);
  var ws = XLSX.utils.json_to_sheet(transformedArray);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb,fileName);
  this.messageService.add({severity:'error',summary:'Data Converted!'})
    }

  
}
