import { Component, OnInit } from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { AuthService } from 'src/app/home/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'workmen-login',
  templateUrl: './workmen-login.component.html',
  styleUrls: ['./workmen-login.component.css']
})
export class WorkmenLoginComponent implements OnInit {
  hide = true;
  workmenLoginForm: UntypedFormGroup;
  master: any;
  username: any = ''
  password:any = ''
  constructor(public fb: UntypedFormBuilder, private router: Router, private authService: AuthService,  private service: ApiService, private messageService:MessageService) {}

  ngOnInit() {
      this.workmenLoginForm = new UntypedFormGroup({
          'User_Name' : new UntypedFormControl('', Validators.required),
          'Password': new UntypedFormControl(null, Validators.required),
      });
  }

  setLocal(){
      console.log(this.workmenLoginForm.value.User_Name)
  }

  get name()
  {
    return this.workmenLoginForm.controls
  }


  submitForm() {
      if (this.workmenLoginForm.invalid) {
          return this.messageService.add({severity:'error', summary: 'Please Fill all fields',});
      }
          console.log(this.workmenLoginForm.value)
          this.service.ars_login(this.workmenLoginForm.value)
          .subscribe({
              next: (response:any) => {
                  // console.log(response, response.status);
                  if(response.token) {
                      sessionStorage.setItem('token', response.token)
                  }
                  if(response.message == "Success") 
                  {
                    sessionStorage.setItem('user', 'ars')
                    sessionStorage.setItem('user_name', response.apln_slno)
                    sessionStorage.setItem('gen_id',response.gen_id)
                    sessionStorage.setItem('plantcode',response.plant_code)
                    sessionStorage.setItem('apprentice_type',response.apprentice_type)
                    this.goPlaces();
                  } 
                  else if (response.message == "User") 
                  {
                     this.messageService.add({severity:'error', summary: 'User Not Found!',});
                  } 
                  else 
                  {
                      this.messageService.add({severity:'error', summary: 'Incorrect Password!',});
                  }
              },
              error: (error) => this.messageService.add({severity:'error', summary: error.message}),
          });



  }

  goPlaces() {
      this.router.navigate(['../rdhrm']);
  }
}
