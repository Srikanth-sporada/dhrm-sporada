import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-hrms-reports',
  templateUrl: './hrms-reports.component.html',
  styleUrls: ['./hrms-reports.component.css'],
})
export class HrmsReportsComponent implements OnInit {

  hrmsReportURL:string = environment.payroll + '/reports?STOKEN=';
  authToken:string | null =  sessionStorage.getItem('token');
  sanitizedURL:SafeResourceUrl;
  constructor(
    private sanitizer:DomSanitizer,
    public loader:LoaderserviceService,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {
    /** auth token URL */
    this.hrmsReportURL = this.hrmsReportURL + this.authToken;
    /** sanitize DOM URL */
    this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.hrmsReportURL);
  }

  handleIframeError(){
    this.messageService.add({severity:'error',summary:'Oops! Error Occured.'})
  }

}
