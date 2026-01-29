import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-ars-dumb',
  templateUrl: './admin-ars-dumb.component.html',
  styleUrls: ['./admin-ars-dumb.component.css']
})
export class AdminArsDumbComponent implements OnInit {
  urlSafe: SafeResourceUrl = '';

  constructor(
    private sanitizer: DomSanitizer,
    private messageService:MessageService
  ) {}

  ngOnInit() {
    // If the file is in your src/assets folder
    const path = 'assets/html/test.html'; 
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

   handleIframeError(){
    this.messageService.add({severity:'error',summary:'Oops! Error Occured.'})
  }
}
