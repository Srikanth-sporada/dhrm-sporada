import { Component, OnInit } from '@angular/core';
import moment from 'moment'
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';
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
  all:any;
  userDetails:any;


  constructor(private apiService:ApiService, private messageService:MessageService) { }

  ngOnInit() {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.fullname.toUpperCase()+`(${this.all.gen_id})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    // this.date=moment().format('yyyy-MM')
    this.date = new Date();
    
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
    // let date=this.date.split('-');
    // formatting date obj to month and year
    let month = moment(this.date).format('MM');
    let year = moment(this.date).format('YYYY')
    this.apiService.getApprovedHoursforEmp(month,year,type).subscribe((response:any)=>{
      console.log(response)
        if(response.status='success'){
          this.approved_hours=response.data.approved_hrs
          this.comp_off_data=response.data.comp_off
          this.ot=response.data.ot==null?0:response.data.ot
        }else{
          // alert(response.message)
          this.messageService.add({severity:'warn',summary:response.message})
        }
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })
  }

}
