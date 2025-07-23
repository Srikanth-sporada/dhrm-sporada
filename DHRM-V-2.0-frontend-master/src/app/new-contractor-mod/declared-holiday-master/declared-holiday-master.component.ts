import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-declared-holiday-master',
  templateUrl: './declared-holiday-master.component.html',
  styleUrls: ['./declared-holiday-master.component.css']
})
export class DeclaredHolidayMasterComponent implements OnInit {

  D_OffForm:any
  showD_offForm=false
  plantname:any

  constructor(private fb: FormBuilder,private modalService: NgbModal,private service : ApiService) {
    this.D_OffForm = this.fb.group({
      plant:[''],
      date:[''],
      leaveType:[''],
      reason:['']
    })
   }

 
   ngOnInit(): void {
    this.getplantcode()
  }

  getplantcode(){
    var company = {'company_name': sessionStorage.getItem('companyList.companycode')}
    this.service.plantcodelist(company)
    .subscribe({
      next: (response) =>{ this.plantname = response;
       
       },
      error: (error) => console.log(error),
    });
  }

showForm(){
  this.showD_offForm=true
}
hideForm(){
  this.reset()
  this.showD_offForm = false
}
reset(){
  this.D_OffForm.reset()
}


onSubmit(event: any){
  if(this.D_OffForm.value){
    console.log(this.D_OffForm.value);
  }
 this.hideForm()
 event.currentTarget.reset()
}

}
