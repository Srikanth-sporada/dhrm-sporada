import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormBuilder,Validator, Validators} from "@angular/forms"
import { ApiService } from 'src/app/home/api.service';
import * as moment from 'moment';
import { stringify } from 'querystring';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-pmpd',
  templateUrl: './add-pmpd.component.html',
  styleUrls: ['./add-pmpd.component.css']
})
export class AddPmpdComponent implements OnInit {
  isEdit:any;//edit=true or add=false
  data_verified:boolean=false;
  updatebutton:boolean=true
  plant:any[];
  division=['SGP','SSLP','HYD','CYL']
  material_type=['HALB','FERT']
  uom=['NOS','EA','SET']
  pmpdData:any=this.fb.group({
    plant:['',Validators.required],
    material_code:['',Validators.required],
    material_desc:['',Validators.required],
    uom:['',Validators.required],
    material_type:['',Validators.required],
    division:['',Validators.required],
    pmpd:['',Validators.required],
    effective_date:['',Validators.required],
    active_status:['1'],
  })

  constructor(public dailogRef:MatDialogRef<AddPmpdComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb:FormBuilder,public api:ApiService,
    private messageService:MessageService
    ) { }

  ngOnInit() { 
    this.api.getplantcode(sessionStorage.getItem('plantcode')).subscribe(
      (response:any)=>{
        console.log(response)
        this.plant=response
      },(error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    )
    if(this.data.type=='edit'){
      this.isEdit=true
      let data =  this.data.pmpd_data
      console.log(data)
      this.pmpdData.controls['plant'].setValue(`${data.plant}`)
      this.pmpdData.controls['plant'].disable()
      this.pmpdData.controls['material_code'].setValue(`${data.mat_code.toUpperCase()}`)
      this.pmpdData.controls['material_code'].disable()
      this.pmpdData.controls['material_desc'].setValue(`${data.mat_desc.toUpperCase()}`)
      this.pmpdData.controls['material_desc'].disable()
      this.pmpdData.controls['uom'].setValue(`${data.uom.toUpperCase()}`)
      this.pmpdData.controls['uom'].disable()
      this.pmpdData.controls['material_type'].setValue(`${data.mat_type.toUpperCase()}`)
      this.pmpdData.controls['material_type'].disable()
      this.pmpdData.controls['division'].setValue(`${data.division.toUpperCase()}`)
      this.pmpdData.controls['division'].disable()
      this.pmpdData.controls['effective_date'].setValue(`${data.effective_date}`)
      this.pmpdData.controls['pmpd'].setValue(`${data.pmpd}`)
      this.pmpdData.controls['active_status'].setValue(data.active_status==true?'1':'0')
      
    }

    if(this.data.type=='add'){
      this.isEdit=false
     
    }
    this.pmpdData.valueChanges.subscribe((res:any)=>{
      if(this.data.type=='add'){
        this.data_verified=false
      }
      if(this.data.type=='edit'){
        this.updatebutton=false
        
      }
        
    })
    
  }

  verifydata(){
    const date = moment(this.pmpdData.controls['effective_date'].value).format("YYYY-MM-DD")
    this.pmpdData.controls['effective_date'].value = date;
   
    this.api.verify_pmpd_data([this.pmpdData.value]).subscribe((response:any)=>{
      console.log(response)
      if(response.status=='failed'){
        // alert(response.message)
        this.messageService.add({severity:'info',summary:response.message})
      }else if(response.status='Successful'){
        this.data_verified=true
      }
    },(error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      })
  }

  upload_data():any{
    const date = moment(this.pmpdData.controls['effective_date'].value).format("YYYY-MM-DD")
    let data = [{...this.pmpdData.value,effective_date:date}]
    this.api.upload_pmpd_data({data:data,user:sessionStorage.getItem('user_name')}).subscribe((response:any)=>{
       if(response.status=='Successfull'){
          // alert("Data uploaded successfully")
        this.messageService.add({severity:'info',summary:'Data uploaded successfully'})

        this.dailogRef.close()
       }else{
        // alert('someting went wrong please check with IT admin')
         this.messageService.add({severity:'info',summary:'someting went wrong please check with IT admin'})
       }
    },(error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      })
  }

  updateData():any{
    this.api.update_pmpd_data({data:this.pmpdData.getRawValue(),user:sessionStorage.getItem('user_name')}).subscribe((res:any)=>{
      if(res.status=='succesfull'){
        this.dailogRef.close()
        // alert(res.message)
        this.messageService.add({severity:'info',summary:res.message})
      }else{
        // alert('Something Went Wrong Please Try again or contact admin');
        this.messageService.add({severity:'info',summary:'someting went wrong please check with IT admin'})
      }
    },(error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      })
  }

}
