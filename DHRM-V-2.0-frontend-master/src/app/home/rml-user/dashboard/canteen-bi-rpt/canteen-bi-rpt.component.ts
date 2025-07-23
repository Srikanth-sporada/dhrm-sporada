import { Component, OnInit } from '@angular/core';
import {powerBiLink} from '../../../../../environments/environment.prod'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-canteen-bi-rpt',
  templateUrl: './canteen-bi-rpt.component.html',
  styleUrls: ['./canteen-bi-rpt.component.css']
})
export class CanteenBiRptComponent implements OnInit {


  cnt_link: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Sanitize the Power BI link
    this.cnt_link = this.sanitizer.bypassSecurityTrustResourceUrl(powerBiLink.Canteen_Report);
  

  }



}
