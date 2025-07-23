import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog'
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-backdate-popup',
  templateUrl: './backdate-popup.component.html',
  styleUrls: ['./backdate-popup.component.css']
})
export class BackdatePopupComponent implements OnInit {

  constructor(private dailogRef:MatDialogRef<BackdatePopupComponent>,@Inject(MAT_DIALOG_DATA)  public data:any,private apiService:ApiService) { }

  ngOnInit() {
  }

  update(){
    this.apiService.updateBackDate(this.data).subscribe((response:any)=>{
      if(response.status='success'){
        alert(`Back date control data Updated Successfully For Plant:${this.data.plant}`)
        this.dailogRef.close()
      }else{
        this.dailogRef.close()
      }
    })
  }

  close(){
    this.dailogRef.close()
  }

}
