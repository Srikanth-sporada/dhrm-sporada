import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import * as moment from 'moment'
import {MatDialog} from '@angular/material/dialog'
import { CoffpopupComponent } from './coffpopup/coffpopup.component';

@Component({
  selector: 'app-hrcompoff',
  templateUrl: './hrcompoff.component.html',
  styleUrls: ['./hrcompoff.component.css']
})
export class HrcompoffComponent implements OnInit {
data:any=[]
genid:any=''

  constructor(private apiService:ApiService,private dialog:MatDialog) { }

  ngOnInit() {
    
  }


  getData(){
    console.log(this.genid=='')
    if(this.genid==''){
      alert(`Please Enter The Gen ID`)
    }else{
      this.apiService.getHrCoff(this.genid).subscribe((response:any)=>{
        if(response.status=='failed'){
          alert(response.message)
        }else{
          this.data = response.data.map((element: any) => {
            this.getTime(element.in_time);
            return {
              ...element,
              in_time: this.getTime(element.in_time),
              out_time: this.getTime(element.out_time),
              att_date: moment(element.att_date).format("YYYY-MM-DD"),
            };
          });
        }
      })
    }
   
  }

  getTime(time: any) {
    
    let temp_time = time.split("T")[1].split(".")[0];
    return temp_time
  }

  openDialog(coffData:any){
    this.dialog.open(CoffpopupComponent,{
      data:coffData
    })
  }

  

}
