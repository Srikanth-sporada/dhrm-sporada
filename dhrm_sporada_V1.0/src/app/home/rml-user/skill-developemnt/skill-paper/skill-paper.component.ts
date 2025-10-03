import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Import Router
import { ApiService } from 'src/app/home/api.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-skill-paper',
  templateUrl: './skill-paper.component.html',
  styleUrls: ['./skill-paper.component.css']
})
export class SkillPaperComponent implements OnInit {

  newSkill: any;
  newSkillLevel: any;
  plant: any;
  question: any = [];
  isSubmitted: boolean = false;
  aplnNo: any;
  department: any;
  username: any;
  oprn_no: any;
  img_name: any;
  url = environment.path +'/qbank/';

  constructor(
    private route: ActivatedRoute,
    private service: ApiService,
    private router: Router  // Inject Router here
  ) { }

  ngOnInit(): void {
    this.newSkill = this.route.snapshot.paramMap.get('id');
    this.newSkillLevel = this.route.snapshot.paramMap.get('level');
    this.plant = sessionStorage.getItem('plantcode');
    this.department = sessionStorage.getItem('dept_name');
    this.aplnNo = sessionStorage.getItem('user_name');
    this.username = sessionStorage.getItem('gen_id');
    const backendImageBaseUrl = this.url;

    this.service.getSkillTestQuestions(this.plant, this.newSkillLevel, this.newSkill, this.username).subscribe(
      (response: any) => {
        console.log('questions', response)
        this.question = response.data.map((q: any) => ({
          ...q,
          img_name: q.image_filename ? `${backendImageBaseUrl}${q.image_filename}` : null
        }));
      }, (error) => {
        console.error('Error fetching skill Questions data', error);
      }
    );

    console.log('new_skill:', this.newSkill);
    console.log('new_skill_level:', this.newSkillLevel);
  }

  submit(): void {
    this.isSubmitted = true;

    let allAnswered = true;

    const formValue = [];
    const data = [];

    // Collect answers first
    for (let q of this.question) {
      if (!q.selectedAnswer) {
        allAnswered = false;
        break;
      }
      formValue.push({
        qslno: q.qslno,
        selectedAnswer: q.selectedAnswer,
        correct: q.correct_answer,
      });
    }

    if (allAnswered) {
      // Push the shared data only once
      data.push({
        plant: this.plant,
        dept: this.department,
        apln: this.aplnNo,
        level: this.newSkillLevel,
        oprn: this.newSkill,
        user: this.username
      });

      // Combine both formValue and data into one object
      const requestPayload = {
        formValue: formValue,
        data: data
      };

      // Call the API with the combined data
      this.service.skillTestSubmit(requestPayload).subscribe(
        (response: any) => {
          console.log('Form submitted successfully', response);

          // Check the response and navigate
          if (response.message === 'success') {
            // Redirect to the skill test page
            alert('Test Submitted Successfully, View Result In Answer Sheet');
            this.router.navigate(['/rml/skill-developement/skill-test']);
          } else if (response.message === 'failure') {
            alert('Submission Failed Try Later');
            this.router.navigate(['/rml/skill-developement/skill-test']);
          }
        },
        (error: any) => {
          console.error('Error submitting form', error);
        }
      );
    } else {
      alert('Please answer all questions before submitting.');
    }
  }
}
