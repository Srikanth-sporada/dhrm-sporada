import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { UntypedFormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-answer-sheet',
  templateUrl: './answer-sheet.component.html',
  styleUrls: ['./answer-sheet.component.css']
})
export class AnswerSheetComponent implements OnInit {

  answers: any = [];
  genid: any;
  pevalno: any;
  aplnNo: any;
  username: any;
  supvis: any;
  istrainee: any;
  ishr: any;
  url = environment.path +'/qbank/';

  constructor(
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check for the route parameter 'peval_slno'
    this.route.paramMap.subscribe(params => {
      this.pevalno = params.get('id');
      console.log('pevalno:', this.pevalno);  // Should now log the correct value
    });

    // Fetch other session data
    this.genid = sessionStorage.getItem('gen_id');
    this.aplnNo = sessionStorage.getItem('user_name');
    this.username = sessionStorage.getItem('emp_name');
    const backendImageBaseUrl = this.url;
    this.supvis =   sessionStorage.getItem('issupervisor')
    this.istrainee = sessionStorage.getItem('istrainee')
    this.ishr = sessionStorage.getItem('ishr');

    // if (this.genid) {
      this.service.answersforuser(this.pevalno).subscribe((response2: any) => {
        this.answers = response2.map((q: any) => ({
          ...q,
          img_name: q.image_filename ? `${backendImageBaseUrl}${q.image_filename}` : null
        }));
      });
      
    // }


  }

  navigateBack() {
    this.router.navigate(['/rml/skill-developement/skill-test']);
  }

  hrNavigate() {
    this.router.navigate(['/rml/skill-developement/Supervisor_Evaluation']);
  }

  supNavigate() {
    this.router.navigate(['/rml/skill-developement/Skill-Matrix']);
  }
}
