import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { UntypedFormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { MessageService } from 'primeng/api';
import { LoaderserviceService } from 'src/app/loaderservice.service';
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
  dummyData = [
  {
    question: "What is the capital of France?",
    img_name: "test.png",
    Correct_Answer: "Paris",
    Test_Answer: "Paris"
  },
  {
    question: "Solve: 5 + 7",
    img_name: "test.png",
    Correct_Answer: "12",
    Test_Answer: "11"
  },
  {
    question: "Who wrote 'Hamlet'?",
    img_name: "test.png",
    Correct_Answer: "William Shakespeare",
    Test_Answer: "Shakespear"
  },
  {
    question: "Largest planet in our solar system?",
    img_name: "test.png",
    Correct_Answer: "Jupiter",
    Test_Answer: "Saturn"
  }
]
  constructor(
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService:MessageService,
    public loader:LoaderserviceService,
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
    /** get answer sheet */
    this.getAnswerSheet();
  }

  /**
   * get trainee answer sheet
   * @property {*} answers
   */
  getAnswerSheet(){
     const backendImageBaseUrl = this.url;
    this.service.answersforuser(this.pevalno).subscribe({
        next: (response2: any) => {
        
        this.answers = response2.map((q: any) => ({
          ...q,
          img_name: q.image_filename ? `${backendImageBaseUrl}${q.image_filename}` : null
        }));
      }, 
      error: (error) => {
         console.error('ERROR:',error);
         this.messageService.add({severity:'error',summary:error?.message})
      }
      });
  }
  navigateBack() {
    this.router.navigate(['/rhrm/skill-developement/skill-test']);
  }

  hrNavigate() {
    this.router.navigate(['/rhrm/skill-developement/Supervisor_Evaluation']);
  }

  supNavigate() {
    this.router.navigate(['/rhrm/skill-developement/Skill-Matrix']);
  }
}
