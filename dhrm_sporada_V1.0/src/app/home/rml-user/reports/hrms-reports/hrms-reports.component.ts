import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-hrms-reports',
  templateUrl: './hrms-reports.component.html',
  styleUrls: ['./hrms-reports.component.css']
})
export class HrmsReportsComponent implements OnInit {

  hrmsReportURL:string = environment.payroll + '/reports';
  sanitizedURL:SafeResourceUrl;
  constructor(private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    /** sanitize DOM URL */
    this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.hrmsReportURL);
  }

}
