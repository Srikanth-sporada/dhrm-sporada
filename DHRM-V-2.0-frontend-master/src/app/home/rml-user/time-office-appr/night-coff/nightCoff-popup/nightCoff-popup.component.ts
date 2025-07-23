import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-nightCoff-popup',
  templateUrl: './nightCoff-popup.component.html',
  styleUrls: ['./nightCoff-popup.component.css']
})
export class NightCoffPopupComponent implements OnInit {

  absentData:any
  selectAll:any=false
  sum:any=0;
  loading:any=false
  constructor(private dailogRef:MatDialogRef<NightCoffPopupComponent>,@Inject(MAT_DIALOG_DATA) public data:any,private apiService:ApiService) { }
  ngOnInit() {
    console.log(this.data)
    this.apiService.getFullDayAbsentDays(this.data.emp_id).subscribe((response:any)=>{
      if(response.status=='failed'){
        alert(response.message)
      }else{
        this.absentData=response.data.map((element:any)=>{
          return {...element,selected:false}
        })
        console.log(this.absentData)
      }
    })
  }




  approve(coff_date:any){
    let data={
      workedDate:this.data.date.split('T')[0],
      genid:this.data.gen_id,
      coff_date:coff_date,
      excess_hrs:this.data.hours,
      emp_id:sessionStorage.getItem('user_name')
    }
    this.loading=true
    this.apiService.approveNightCoff(data).subscribe((response:any)=>{
      if(response.status=='success'){
        alert(response.message)
        this.dailogRef.close()
        this.loading=false
      }else{
        alert(response.message)
        this.dailogRef.close()
        this.loading=false
      }
    
    })
  }

}
