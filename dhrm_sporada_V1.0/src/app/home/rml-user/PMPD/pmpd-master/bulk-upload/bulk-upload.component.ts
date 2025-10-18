import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx'
import { ApiService } from 'src/app/home/api.service';
import { environment } from '../../../../../../environments/environment.prod';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  url=environment.path+'/'
  data:any[];
  fileloaded = false
  data_verified:any=false;
  
  constructor(private api:ApiService,public dailogref:MatDialogRef<BulkUploadComponent>,@Inject(MAT_DIALOG_DATA) public data1:any,private messageService:MessageService) { 
  }

  ngOnInit() {
    
  }

  
  fileUpload(event:any){
    const file = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    fileReader.onload=(event:any)=>{
    let binaryData= event.target.result;
    let workbook=XLSX.read(binaryData,{type:'binary'})
    let sheetname = workbook.SheetNames[0]
    this.data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname])
    this.fileloaded = true
    }
  }

  verify_data():void{
    console.log(this.data)
    if(this.data.length==0){
      // alert(`No data in File Please check`)
      this.messageService.add({severity:'warn',summary:'No Data in File Please Check!'})
    }else{
      this.api.verify_pmpd_data(this.data).subscribe((response:any)=>{
        if(response.status=='failed'){
         this.messageService.add({severity:'warn',summary:response.message})
        }else if(response.status='Successful'){
          this.data_verified=true
        }
      }, (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      })
    }
    
  }

  upload_data():any{
    this.api.upload_pmpd_data({data:this.data,user:sessionStorage.getItem('user_name')}).subscribe((response:any)=>{
       if(response.status=='Successfull'){
          // alert("Data uploaded successfully")
          this.messageService.add({severity:'info',summary:'Data Uploaded Successfully!'})
          this.dailogref.close()
       }else{
         this.messageService.add({severity:'warn',summary:'Something Went Wrong!'})
       }
    },(error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      })
  }




  



}
