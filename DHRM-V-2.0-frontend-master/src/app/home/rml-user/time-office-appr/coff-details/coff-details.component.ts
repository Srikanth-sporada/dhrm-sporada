import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/home/api.service';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-coff-details',
  templateUrl: './coff-details.component.html',
  styleUrls: ['./coff-details.component.css']
})
export class CoffDetailsComponent implements OnInit {
  coffData:any[];
  gen_id: any = sessionStorage.getItem("gen_id");
  user: any = sessionStorage.getItem("user");
  plant: any = sessionStorage.getItem("plantcode");
  constructor(private dailog:MatDialogRef<CoffDetailsComponent>,@Inject(MAT_DIALOG_DATA) public data:any,private apiService:ApiService) { }

  ngOnInit() {


    if(this.data.apprentice_type ==="OPERATOR" && this.user ==="ars"){
      this.apiService.getApprovedCoffDetails_Optr(this.data.emp_id).subscribe((response:any)=>{
        if(response.status='success'){
          this.coffData=response.data
        }else{
          this.dailog.close()
          alert(response.message)
        }
      })
    }
    else{
      this.apiService.getApprovedCoffDetails(this.data.emp_id).subscribe((response:any)=>{
        if(response.status='success'){
          this.coffData=response.data
        }else{
          this.dailog.close()
          alert(response.message)
        }
      })
    }




    }




 
  close(){
    this.dailog.close()
  }
}
