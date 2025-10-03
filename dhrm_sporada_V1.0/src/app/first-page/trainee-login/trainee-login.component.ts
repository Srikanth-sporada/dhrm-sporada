import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { MessageService } from 'primeng/api';
@Component({
  selector: ' trainee-login',
  templateUrl: './trainee-login.component.html',
  styleUrls: ['./trainee-login.component.css']
})

export class TraineeLoginComponent implements OnInit {

  message: any;
  loading = false;

  // TRAINEE LOGIN FORM
  traineeLoginForm: FormGroup = new FormGroup({});

  // COMPONENT CONSTRUCTOR
  constructor(
    private fb: FormBuilder,
    private service: ApiService,
    private router: Router,
    private messageService: MessageService
  ) {

    // FORM BUILDER FOR TAINEE LOGIN
    this.traineeLoginForm = fb.group({
      username: ["", Validators.required],
      pass: ["", Validators.required],
    });

  }

  // NG LIFECYCLE HOOK
  ngOnInit(): void {
    this.service.getHr("newuser");
  }

  // TRAINEE LOGIN FUNCTION
  submitForm() {
    this.loading = true;
    var username = this.traineeLoginForm.controls["username"].value;
    if (this.traineeLoginForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Please fill all fields!',});
    } else {
      this.service.traineeLogin(this.traineeLoginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.message = response;
          console.log(this.message);
          if (this.message.status == "success") {
            sessionStorage.setItem("user", "test");
            sessionStorage.setItem("token", this.message.token);
            localStorage.setItem("token", this.message.token);
            this.router.navigate(["/trainee-test", username]);
          } else if (this.message.status == "wrong_user") {
            this.loading = false;
           this.messageService.add({ severity: 'error', summary: 'Username is incorrect!', });
          } else if (this.message.status == "wrong_pass") {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Password is incorrect!', });
          } else if (this.message.status == "wrong_apln") {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'You still haven\'t registered!', });
          }
        },
        error: (err) => this.messageService.add({ severity: 'error', summary: err.message }),
      });
    }
  }

  // GETTER FOR TRAINEE LOGIN FORM CONTROLS
 get f() {
    return this.traineeLoginForm.controls;
  }

}
