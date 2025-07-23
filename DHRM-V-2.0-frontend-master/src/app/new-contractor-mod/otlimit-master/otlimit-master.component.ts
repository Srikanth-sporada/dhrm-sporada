import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-otlimit-master',
  templateUrl: './otlimit-master.component.html',
  styleUrls: ['./otlimit-master.component.css']
})
export class OTLimitMasterComponent implements OnInit {

  otLimitForm:any
  plantname:any
  showOTForm=false

  constructor(private fb: FormBuilder,private modalService: NgbModal,private service : ApiService) {

   }

  ngOnInit(): void {
    this.otLimitForm = this.fb.group({
      plant:[''],
      effectiveDate:[''],
      perDay: [''],
      perWeek: [''],
      perMonth: [''],
    
    })

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
    this.showOTForm=true
  }
  hideForm(){
    this.reset()
    this.showOTForm = false
  }
  reset(){
    this.otLimitForm.reset()
  }

  onSubmit(event: any){
    if(this.otLimitForm.value){
      console.log(this.otLimitForm.value);
    }
   this.hideForm()
   event.currentTarget.reset()
  }
  

}
