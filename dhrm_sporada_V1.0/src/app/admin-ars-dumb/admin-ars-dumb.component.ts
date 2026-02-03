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
  userDetails:any;
  all:any;
  /** element ref */
  @ViewChild('arsDumpFrame') iframe!: ElementRef;
  rootURL:string =  environment?.path;
  showHeader:boolean = environment?.arsDumpTabMenu;
  constructor(
    private sanitizer: DomSanitizer,
    private messageService:MessageService
  ) {}

  ngOnInit() {
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
    // If the file is in your src/assets folder
    const path = 'arsdump/ars_dump.html'; 
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

   handleIframeError(){
    this.messageService.add({severity:'error',summary:'Oops! Error Occured.'})
  }
  /** send root URL to iframe */
  sendDataToIframe() {
    /** send root URL for API call & user data */
    this.iframe.nativeElement.contentWindow.postMessage({baseURL:this.rootURL,userDetails:this.userDetails,showHeader:this.showHeader, userData:this.all}, '*');
  }
}
