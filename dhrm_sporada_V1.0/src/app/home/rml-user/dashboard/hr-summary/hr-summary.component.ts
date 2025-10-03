
import { Component, OnInit } from '@angular/core';
import {powerBiLink} from '../../../../../environments/environment.prod'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-hr-summary',
  templateUrl: './hr-summary.component.html',
  styleUrls: ['./hr-summary.component.css']
})
export class HrSummaryComponent implements OnInit {

  HR_link: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Sanitize the Power BI link
    this.HR_link = this.sanitizer.bypassSecurityTrustResourceUrl(powerBiLink.HR_link);
  

  }

}



