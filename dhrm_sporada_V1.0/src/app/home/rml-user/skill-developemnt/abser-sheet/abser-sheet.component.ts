import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { UntypedFormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LoaderserviceService } from 'src/app/loaderservice.service';
@Component({
  selector: 'app-abser-sheet',
  templateUrl: './abser-sheet.component.html',
  styleUrls: ['./abser-sheet.component.css']
})
export class AbserSheetComponent implements OnInit {

  answers: any = [
  {
    Abservent_Point: "The UI is clean and responsive",
    Rating: 5,
    Remarks: "Excellent work on accessibility"
  },
  {
    Abservent_Point: "Data export feature works but needs optimization",
    Rating: 3,
    Remarks: "Performance can be improved"
  },
  {
    Abservent_Point: "Workflow automation reduces manual effort significantly",
    Rating: 4,
    Remarks: "Very useful for daily tasks"
  },
  {
    Abservent_Point: "Card-style layout improves readability",
    Rating: 5,
    Remarks: "Modern and user-friendly design"
  }
];
  genid: any;
  pevalno: any;
  aplnNo: any;
  username: any;
  ishr: any;
  istrainee: any;

  constructor(
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService:MessageService,
    public loader:LoaderserviceService,
  ) { }

  ngOnInit(): void {

    this.ishr = sessionStorage.getItem('ishr');
    this.istrainee = sessionStorage.getItem('istrainee')

    this.route.paramMap.subscribe(params => {
      this.pevalno = params.get('id');
      console.log('pevalno:', this.pevalno);  // Should now log the correct value
    });

    if (this.pevalno) {
      this.getTestData();
    }
  }

  /** 
   * get supervisor abservant test data
   * @property {*} prevalno
   * @property {*} answers
   */
  getTestData(){
    this.service.abservforuser(this.pevalno).subscribe({
        next: (res: any) => {
          console.log('DATA:',res);
        // this.answers = res;
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
      });
  }
  navigateBack() {
    this.router.navigate(['/rhrm/skill-developement/skill-test']);
  }

}
