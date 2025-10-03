import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { FormService } from "../../new-joiners/form.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { ToastService } from "angular-toastify";

@Component({
  selector: "app-trainee-login",
  templateUrl: "./trainee-login.component.html",
  styleUrls: ["./trainee-login.component.css"],
})
export class TraineeLoginComponent implements OnInit {
  public inputType: string = "password";
  message: any;
  loading = false;

  // This function is used to toggle the input type between password and text
  public updateInput(event: any): void {
    if (event.target.checked) {
      this.inputType = "text";
    } else {
      this.inputType = "password";
    }
  }

  // TRAINEE LOGIN FORM
  form: FormGroup = new FormGroup({});

  // COMPONENT CONSTRUCTOR
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cookie: CookieService,
    private formservice: FormService,
    private service: ApiService,
    private router: Router,
    private toaster: ToastService
  ) {

    // FORM BUILDER FOR TAINEE LOGIN
    this.form = fb.group({
      username: ["", Validators.required],
      pass: ["", Validators.required],
    });

  }

  // NG LIFECYCLE HOOK
  ngOnInit(): void {
    this.service.getHr("newuser");
  }

  // TRAINEE LOGIN FUNCTION
  TraineeLogin() {
    this.loading = true;
    var username = this.form.controls["username"].value;
    if (this.form.invalid) {
      this.toaster.warn("Please fill all the fields correctly");
    } else {
      this.service.traineeLogin(this.form.value).subscribe({
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
            this.toaster.error("Username is incorrect");
          } else if (this.message.status == "wrong_pass") {
            this.loading = false;
            this.toaster.error("Password is incorrect");
          } else if (this.message.status == "wrong_apln") {
            this.loading = false;
           this.toaster.error("you still haven't registered");
          }
        },
        error: (err) => this.toaster.error(err.message),
      });
    }
  }

  // GETTER FOR TRAINEE LOGIN FORM CONTROLS
 get f() {
    return this.form.controls;
  }
}
