import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.css']
})
export class TransferFormComponent implements OnInit {

  form:any
  gen_id: any 
  changedepartment : any
  changeline : any
  changeRole : any
  reportingto: any 
  obj:any
  flag: any = true;
  state: boolean;
  slno: any;
  fullname:any;
  genID:any;
    constructor(private fb : UntypedFormBuilder,private http: HttpClient,private active :ActivatedRoute , private service: ApiService, private router : Router, private messageService:MessageService, private location:Location) {
    
      this.form = this.fb.group({
        apln_slno: [''],
        current_department: [''],
        current_line: [''],
        emp_name:[''],
        current_Role:[''],
        changedepartment : ['', Validators.required],
        changeline : ['', Validators.required],
        change_Role : ['', Validators.required],
        reportingto:  ['', Validators.required],
        changeworkcat:['',],
        fullname:[''],
        idno: [''],
        plantcode:[sessionStorage.getItem('plantcode')],
        workcat:['']
     
      })
  
    }
  
  
    ngOnInit(): void {

      this.form.controls['apln_slno'].setValue(this.active.snapshot.paramMap.get('apln_slno'))

      var object = {
        'apln_slno': this.active.snapshot.paramMap.get('apln_slno'),
        'dept_slno': this.active.snapshot.paramMap.get('dept'),
        'line_code':this.active.snapshot.paramMap.get('line')
      }

      this.service.dept_line(object)
      .subscribe({
        next: (response)=>{console.log(response); 
          this.obj = response;
          this.fullname = this.obj[3]?.fullname;
          this.genID = this.obj[3]?.gen_id
          console.log(this.obj);

          const data =this.obj[3]
          
          this.form.controls['current_department'].setValue(this.obj[0]?.dept_name)
          this.form.controls['current_line'].setValue(this.obj[1]?.line_name)
         
          this.form.controls['emp_name'].setValue(this.obj[2]?.emp_name)
          this.form.controls['fullname'].setValue(this.obj[3]?.fullname)
          this.form.controls['idno'].setValue(this.obj[3]?.gen_id)
          this.form.controls['workcat'].setValue(this.obj[4].Category_Name)
          this.form.controls['current_Role'].setValue(this.obj[4].Role_Name)
          this.obj = []
        },
        error: (err) => this.messageService.add({severity:'error',summary:err.message})
      })

      this.service.dept_line_report({plantcode: sessionStorage.getItem('plantcode')})
      .subscribe(
        {
          next: (response)=>
          {
            console.log(response);
            this.obj = response;
            // this.reportingto = this.obj[0]
            this.changedepartment = this.obj[1]
            // this.changeline = this.obj[2]
          },
          error: (err) => this.messageService.add({severity:'error',summary:err.message})
        }
      )

     
    }

    submit()
    {
      console.log(this.form.value)

      // this.form.controls['reportingto'].setValue(this.slno)

      this.service.transfer(this.form.value)
      .subscribe(
        {
          next: (response:any)=>{console.log(response);
          if(response.status == 'success')
          {
            this.messageService.add({severity:'info',summary: response.message})
            this.router.navigate(['/rdhrm/new_joiners/dept_transfer'])
          }
          },  error: (err) => {
            console.log(err);
            this.messageService.add({severity:'error',summary:err.message})
          },
        }
      )
    }

    emp_slno(event:any)
    {
      const func = this.reportingto.findIndex( (obj:any)=> obj['emp_name'] === event.target.value)
      this.slno = this.reportingto[func].empl_slno
      console.log(this.slno)
    }

    getLineName_1(event:any)
    {
      var x = event.value;
      this.service.getLineName({dept_slno: this.changedepartment[x].dept_slno})
      .subscribe(
        {
          next:(response:any)=>{console.log(response);
           this.changeline = response[0]
            this.reportingto = response[1]
          },
          error: (err) => this.messageService.add({severity:'error',summary:err.message})
      })
    }

    getline_Role(event :any){
      this.getLineName(event)
      this.getRoleMaster(event)
    }

    getLineName(event:any)
    {
      var x = event.value
      this.service.getLineName({dept_slno: x})
      .subscribe(
        {
          next:(response:any)=>{console.log(response);
           this.changeline = response[0]
            this.reportingto = response[1]
          },
          error: (err) => this.messageService.add({severity:'error',summary:err.message})
      })
    }

    getRoleMaster(event:any)
    {
      var x = event.value;
      this.service.getRoleName({dept_slno: x})
      .subscribe(
        {
          next:(response:any)=>{console.log(response);
           this.changeRole = response[0];
          },
          error: (err) => this.messageService.add({severity:'info',summary:err.message})
      })
    }

    onRoleChange(event: any) {

     console.log(event.value);
      const selectedRoleId = Number(event.value);
    
      const selectedRole = this.changeRole.find((role: any) => role.Role_Id === selectedRoleId);
    
      if (selectedRole) {
        this.form.controls['changeworkcat'].setValue(selectedRole.Category_Name);
        console.log(this.form.value.changeworkcat)
      } else {
        this.form.controls['changeworkcat'].setValue('');
      }
    }

    goBack(){
      this.location.back()
    }

    log(){
      console.log(this.form.value)
    }
}
