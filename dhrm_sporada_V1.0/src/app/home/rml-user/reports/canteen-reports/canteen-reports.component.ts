import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import * as XLSX from'xlsx';
import * as moment from 'moment';
import { ClamAPIService } from '../../../../new-contractor-mod/clam-api.service';
import { ToastComponent } from '../../../../new-contractor-mod/toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-canteen-reports',
  templateUrl: './canteen-reports.component.html',
  styleUrls: ['./canteen-reports.component.css']
})
export class CanteenReportsComponent implements OnInit {

  cntForm: FormGroup
  cntlist:any
  isadmin:string |null= sessionStorage.getItem('isadmin')
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
button1:boolean =false
   constructor(private fb: UntypedFormBuilder,private api:ClamAPIService
    , private dialog: MatDialog,) {
    this.cntForm = this.fb.group({
      plant: [this.plant_Code],
      FromDate: '',
      ToDate: '',
      rpt_type: '',
      
    });
   }

  ngOnInit(): void {
  }
  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }

  download(){
    console.log(this.cntForm.value)
    this.button1 =true
    this.api.getCanteenRpt(this.cntForm.value).subscribe(res => {
      // console.log(res)
      this.cntlist =res

      // console.log(this.cntlist.length)
      if(this.cntlist.length == 0)
{
  this.openAlertDialog('Data not Found','error')
}  else{
  this.exportExcel(this.cntlist)
  this.cntForm.reset()
  this.button1 =false
  // console.log(this.cntlist)


}

    },(error)=>{
      console.log(error)
      this.openAlertDialog(error,'error')
      this.button1 =false
    })

  }

  exportExcel(data:any) : void{
// 
    // console.log(data.data)
    // console.log(data.rpt_type)


let  fileName
let sheetName

if(data.rpt_type === 'Summary'){
  fileName='Canteen Summary Report'
  sheetName='Summary'
}
else if(data.rpt_type === 'Detailed'){
  fileName='Canteen Detailed Report'
  sheetName='Detailed'
}



    const transformedArray:any = data.data.map((data: any) =>{
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
    XLSX.utils.book_append_sheet(wb, ws,sheetName);
    XLSX.writeFile(wb,`${fileName}.xlsx`);
  
      }





}
