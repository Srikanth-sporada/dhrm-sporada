import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-excess-hour-deatils-emp',
  templateUrl: './excess-hour-deatils-emp.component.html',
  styleUrls: ['./excess-hour-deatils-emp.component.css']
})
export class ExcessHourDeatilsEmpComponent implements OnInit {
  date:any;
  approved_hours:any;
  comp_off_data:any;
  ot:any;
  month:any;
  gen_id: any = sessionStorage.getItem("gen_id");
  user: any = sessionStorage.getItem("user");
  plant: any = sessionStorage.getItem("plantcode");
  item :any= sessionStorage.getItem("all");
  apprenticeType:any
  


  constructor(private apiService:ApiService) { }

  ngOnInit() {
    this.date=moment().format('yyyy-MM')
    
    var dataObject = JSON.parse(this.item);

 this.apprenticeType = dataObject.apprentice_type;
 this.getData()
  }

  getData(){
    let type =''
    if(this.apprenticeType ==="OPERATOR" && this.user ==="ars"){
     type='O'
    }
    else{
      type='T'
    }
    this.month=`${this.date}-01`
    this.month=moment(this.month).format('MMMM')
    let date=this.date.split('-')
    this.apiService.getApprovedHoursforEmp(date[1],date[0],type).subscribe((response:any)=>{
      console.log(response)
        if(response.status='success'){
          this.approved_hours=response.data.approved_hrs
          this.comp_off_data=response.data.comp_off
          this.ot=response.data.ot==null?0:response.data.ot
        }else{
          alert(response.message)
        }
    })
  }

}
