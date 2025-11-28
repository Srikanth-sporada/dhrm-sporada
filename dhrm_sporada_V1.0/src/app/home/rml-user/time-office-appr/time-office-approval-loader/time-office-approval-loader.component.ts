import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-time-office-approval-loader',
  templateUrl: './time-office-approval-loader.component.html',
  styleUrls: ['./time-office-approval-loader.component.css']
})
export class TimeOfficeApprovalLoaderComponent implements OnInit {
  loaderLogoPath:any = environment?.loaderLogoPath
  constructor() { }

  ngOnInit(): void {
  }

}
