import { Component, OnInit,ViewChild, ElementRef} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-admin-ars-dumb',
  templateUrl: './admin-ars-dumb.component.html',
  styleUrls: ['./admin-ars-dumb.component.css']
})
export class AdminArsDumbComponent implements OnInit {
  urlSafe: SafeResourceUrl = '';
  /** element ref */
  @ViewChild('arsDumpFrame') iframe!: ElementRef;
  rootURL:string =  environment?.path;

  constructor(
    private sanitizer: DomSanitizer,
    private messageService:MessageService
  ) {}

  ngOnInit() {
    // If the file is in your src/assets folder
    const path = 'assets/arsdump/ars_dump.html'; 
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

   handleIframeError(){
    this.messageService.add({severity:'error',summary:'Oops! Error Occured.'})
  }
  /** send root URL to iframe */
  sendDataToIframe() {
    /** send root URL for API call */
    this.iframe.nativeElement.contentWindow.postMessage(this.rootURL, '*');
  }
}
