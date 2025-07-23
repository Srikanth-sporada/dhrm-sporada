import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import { MatDialog } from '@angular/material/dialog';
import { OtapprAddComponent } from './otappr-add/otappr-add.component';
import {OtapprEditComponent} from './otappr-edit/otappr-edit.component'

@Component({
  selector: 'app-Ot-appr',
  templateUrl: './Ot-appr.component.html',
  styleUrls: ['./Ot-appr.component.css']
})
export class OtApprComponent implements OnInit {
  list:any[];
  plant:any;
  constructor(private apiService:ApiService,private matdailog:MatDialog) { }

  ngOnInit() {
    this.plant=sessionStorage.getItem('isadmin')=='true'?'':sessionStorage.getItem('plantcode')
    console.log(this.plant)
    this.getData()
   
  }

  getData(){
    this.apiService.getOtapperMapping(this.plant).subscribe((response:any)=>{
      if(response.status=='success'){
        this.list=response.data
      }else{
        alert(response.messsage)
      }
    })
  }

  openAdd(){
    let dailog=this.matdailog.open(OtapprAddComponent)

    dailog.afterClosed().subscribe((data:any)=>{this.getData()})
  }

  openEdit(item:any){
    let dailog=this.matdailog.open(OtapprEditComponent,{
      data:item
    })

    dailog.afterClosed().subscribe((data:any)=>{this.getData()})
  }

  delete(id:any){
    let data={id:id}
    this.apiService.deleteOtMapping(data).subscribe((response:any)=>{
      if(response.status='success'){
        alert(response.message)
        this.getData()
      }else{
        alert(response.message)
        this.getData()
      }
    })
  }
}
