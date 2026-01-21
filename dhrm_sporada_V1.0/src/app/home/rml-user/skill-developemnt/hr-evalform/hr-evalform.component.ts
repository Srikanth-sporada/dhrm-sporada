import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment.prod";
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderserviceService } from 'src/app/loaderservice.service';
@Component({
  selector: 'app-hr-evalform',
  templateUrl: './hr-evalform.component.html',
  styleUrls: ['./hr-evalform.component.css']
})

export class HREvalformComponent implements OnInit {

  username: any;
  department: any;
  genid: any;
  form: any;
  skillTestData: any = {};
  operationsData: any = []
  category: any;
  aplnNo: any;
  line: any;
  plant: any;
  droplist: any = [];
  selectedOperation: string = '';
  selectedSkill: any = null;
  ActSts: any;
  paperData: any = []
  photo: any;
  photoLink: any = environment.path;

  constructor(
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute, // ✅ this is the right one
    private messageService:MessageService,
    public loader:LoaderserviceService
  ) {
    this.form = this.fb.group({
      genid: [sessionStorage.getItem('user_name')],
      new_skill: [''],
      new_skill_level: [''],
    });
  }

  ngOnInit(): void {
    this.aplnNo = this.route.snapshot.paramMap.get('peval');
    console.log('aplnNo', this.aplnNo);
    /** get skill test */
    this.getSkillTest();
  }

  /**
   * @property {*} aplnNo
   * @property {*} skillTestData
   * @property {*} operationsData
   */
  getSkillTest(){
     this.service.getSkillTestHr(this.aplnNo).subscribe({
      next: (response: any) => {
        console.log('response', response);

        // Assigning skillTestData and operationsData
        this.skillTestData = response[0][0];
        this.operationsData = response[1];
        this.genid = this.skillTestData.gen_id;
        /** check profile */
        if (this.skillTestData.photo_filename) {
          this.photo = this.photoLink + "/uploads/" + this.skillTestData.photo_filename;
        } else {
          if (this.skillTestData.gender === 'Male') {
            this.photo = 'assets/Male.avif';
          } else {
            this.photo = 'assets/Female1.jfif';
          }
        }

        console.log('skillTestData', this.skillTestData);
        console.log('operationsData', this.operationsData);
        console.log('genid for answersheet', this.genid);
        /** get trainee answer sheet */
        this.getAnswerSheet();
      },
      error: (error) => {
        console.error('Error fetching skill test data', error);
        this.messageService.add({severity:'error',summary:error.message})
      }
     });
  }

  /**
   * get trainee answer sheet
   * @property {*} gen_id
   * @property {*} paperData
   */
  getAnswerSheet(){
     // ✅ Now safe to call answer sheet API
        this.service.answersheet(this.genid).subscribe({
          next: (response: any) => {
            console.log('response', response);
            this.paperData = response;
            console.log('answerSheet:', this.paperData);
          },
          error: (error) => {
            console.error('Error fetching answersheet', error);
            this.messageService.add({severity:'error',summary:error.message})
          }
        });
  }
}
