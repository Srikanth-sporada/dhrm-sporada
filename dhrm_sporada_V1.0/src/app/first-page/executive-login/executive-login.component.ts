import { Component, OnInit } from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import { AuthService } from 'src/app/home/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'executive-login',
  templateUrl: './executive-login.component.html',
  styleUrls: ['./executive-login.component.css']
})
export class ExecutiveLoginComponent implements OnInit {

    executiveLoginForm: UntypedFormGroup;
    
    constructor(public fb: UntypedFormBuilder, private router: Router, private authService: AuthService, private messageService: MessageService) {}

    ngOnInit() {

        this.executiveLoginForm = new UntypedFormGroup({
            'User_Name' : new UntypedFormControl('', Validators.required),
            'Password': new UntypedFormControl(null, Validators.required),
        });
    }

    // sessionStorage is used to store data for the duration of the page session
    setLocal(){
        sessionStorage.setItem('user_name', this.executiveLoginForm.value.User_Name)
        console.log(this.executiveLoginForm.value.User_Name)
    }
    
    // This function is used to submit the form
    submitForm() {
        if (this.executiveLoginForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Please fill all the fields'});
        }
            this.authService
            .login(this.executiveLoginForm.get('User_Name')?.value, this.executiveLoginForm.get('Password')?.value)
            .subscribe({
                next: (response) => {
                    console.log('user login message',response);
                    if(response.token) {
                        sessionStorage.setItem('token', response.token)
                    }
                    if(response.message == "Success") 
                    {
                        sessionStorage.setItem('user','emp')
                        this.goPlaces();
                    } 
                    else if (response.message == "userNotAvilable") 
                    {
                       this.messageService.add({ severity: 'warn', summary: 'You are not authorised use this application ,Please contact IT Admin'});
                    } else {
                       this.messageService.add({ severity: 'error', summary: 'Invalid Credentials'});
                    }
                },
                error: (error) => this.messageService.add({ severity: 'error', summary: error.message })
            });
    }

    // This function is used to navigate to the next page
    goPlaces() {
        this.router.navigate(['../rml']);
    }

}
