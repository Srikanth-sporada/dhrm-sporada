import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-cl-onboard-form',
  templateUrl: './cl-onboard-form.component.html',
  styleUrls: ['./cl-onboard-form.component.css']
})
export class ClOnboardFormComponent implements OnInit {
  aadhar:any;
  mobileNo:any;
  type:any;
  constructor(
    private router:ActivatedRoute,
    private messageService:MessageService,
    private apiService:ApiService,
  ) { }

  ngOnInit(): void {
    this.aadhar = this.router.snapshot.paramMap.get('aadhar');
    this.mobileNo = this.router.snapshot.paramMap.get('mobileno');
    this.type = this.router.snapshot.paramMap.get('type');

  }

}
