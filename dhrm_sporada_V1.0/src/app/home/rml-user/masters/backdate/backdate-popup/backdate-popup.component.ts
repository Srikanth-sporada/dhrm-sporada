import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog'
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-backdate-popup',
  templateUrl: './backdate-popup.component.html',
  styleUrls: ['./backdate-popup.component.css']
})
export class BackdatePopupComponent implements OnInit {
   editing_flag:any;
   plantData:any = [];

  constructor(private dailogRef:MatDialogRef<BackdatePopupComponent>,@Inject(MAT_DIALOG_DATA)  public data:any,private apiService:ApiService,private messageService:MessageService) { 
    if(data.editingFlag){
      this.editing_flag = false;
    }else{
      this.editing_flag = true;
    }
  }
  
  ngOnInit() {
    console.log(this.data,this.editing_flag);
    /** converting plant code int to string */
    this.data.plant = String(this.data.plant);
    console.log(this.data.plant);
    this.getPlantData();
  }

  update(){
    this.apiService.updateBackDate(this.data).subscribe((response:any)=>{
      if(response.status='success'){
        this.dailogRef.close()
        this.messageService.add({severity:'info',summary:'BackDate Updated.'})
      }else{
        this.dailogRef.close();
        this.messageService.add({severity:'error',summary:'Cannot Update BackDate!'})
      }
    })
  }

  close(){
    this.dailogRef.close();
  }

  addBackDate(){
    console.log('add backdate data:',this.data);
    this.apiService.addBackDate(this.data).subscribe({
      next: (response) => {
        console.log('response:',response);
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message});
      }
    })
  }

  /** get plant data 
   * @property {*} plantData
   */
  getPlantData(){
    this.apiService.getplant().subscribe({
      next: (response:any) => {
         this.plantData = response;
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error.message})
        console.error(error);
      }
    })
  }
}
