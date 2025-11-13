import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment.prod'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-corp-hr-dashboard',
  templateUrl: './corp-hr-dashboard.component.html',
  styleUrls: ['./corp-hr-dashboard.component.css']
})
export class CorpHRDashboardComponent implements OnInit {
  // Corp_HR_Link
  Corp_HR_Link: SafeResourceUrl;
  userDetails:any;
  all:any;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    /** logged in user details */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails =
        this.all.Emp_Name.toUpperCase() +
        `(${this.all.User_Name})` +
        "-" +
        this.all.dept_name +
        "-" +
        this.all.plant_name;
    }
    // Sanitize the Power BI link
    this.Corp_HR_Link = this.sanitizer.bypassSecurityTrustResourceUrl(environment.Corp_HR_Link);
  

  }


}
