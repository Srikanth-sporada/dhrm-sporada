import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-excess-hours-details',
  templateUrl: './excess-hours-details.component.html',
  styleUrls: ['./excess-hours-details.component.css']
})
export class ExcessHoursDetailsComponent implements OnInit {

  gen_id: any = sessionStorage.getItem("gen_id");
  user: any = sessionStorage.getItem("user");
  plant: any = sessionStorage.getItem("plantcode");


  excessHrData:any[]
  constructor(private dailog:MatDialogRef<ExcessHoursDetailsComponent>,@Inject(MAT_DIALOG_DATA) public data:any,private apiService:ApiService) { }

  ngOnInit() {

this.gethrApproverDtls()
    console.log(this.data.apprentice_type ==="OPERATOR" && this.user ==="ars")



  }
  close(){
    this.dailog.close()
  }


gethrApproverDtls(){

  if(this.data.apprentice_type ==="OPERATOR" && this.user ==="ars"){
    this.apiService.getApprovedHrDetails_Optr(this.data.emp_id).subscribe((response:any)=>{
      if(response.status='success'){
        this.excessHrData=response.data
      }else{
        alert(response.message)
      }
    })
  }else{
    this.apiService.getApprovedHrDetails(this.data.emp_id).subscribe((response:any)=>{
      if(response.status='success'){
        this.excessHrData=response.data
      }else{
        alert(response.message)
      }
    })
  }



}





}
