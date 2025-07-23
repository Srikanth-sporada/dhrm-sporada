import { Component, OnInit } from '@angular/core';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { ApiService } from 'src/app/home/api.service';
import { BackdatePopupComponent } from './backdate-popup/backdate-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { get } from 'http';

@Component({
  selector: 'app-backdate',
  templateUrl: './backdate.component.html',
  styleUrls: ['./backdate.component.css']
})
export class BackdateComponent implements OnInit {
  data:any[];
  constructor(public loader: LoaderserviceService,private service:ApiService,private dailog:MatDialog) { }

  ngOnInit() {
    this.getdata()
  }

  getdata(){
    this.service.getBackDate().subscribe((response:any)=>{
      if(response.status=='success'){
        console.log(response.data)
        this.data=response.data
      }else{
        alert(response.message)
      }
    })
  }

  openEdit(plantdata:any){
    let dailog=this.dailog.open(BackdatePopupComponent,{
      data:plantdata
    })

    dailog.afterClosed().subscribe(()=>{
      this.getdata()
    })
  }

}
