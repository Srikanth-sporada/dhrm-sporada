import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment.prod";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-old-skill-test',
  templateUrl: './old-skill-test.component.html',
  styleUrls: ['./old-skill-test.component.css']
})
export class OldSkillTestComponent implements OnInit {

  username: any;
  department: any;
  genid: any;
  form: any;
  skillTestData: any = {};
  operationsData: any = [];
  category: any;
  aplnNo: any;
  line: any;
  plant: any;
  droplist: any = [];
  selectedOperation: string = '';
  selectedSkill: any = null;
  ActSts: any;
  paperData: any = [];
  photo: any;
  photoLink: any = environment.path;
  fileDetails:any;
  url: any = environment.path;

  constructor(
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute // ✅ this is the right one
  ) {
    this.form = this.fb.group({
      genid: [sessionStorage.getItem('user_name')],
      new_skill: [''],
      new_skill_level: [''],
    });
  }

  ngOnInit(): void {

    this.aplnNo = this.route.snapshot.paramMap.get('peval');

    console.log('aplnNo', this.aplnNo)

    this.service.getSkillTestHr(this.aplnNo).subscribe(
      (response: any) => {
        console.log('response', response);

        // Assigning skillTestData and operationsData
        this.skillTestData = response[0][0];
        this.operationsData = response[1];
        this.genid = this.skillTestData.gen_id;

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

      },
      (error) => {
        console.error('Error fetching skill test data', error);
      }
    );

    this.service.getFileDetails(this.aplnNo).subscribe(
      (res: any) => {
        if(res.status=='success'){
          this.fileDetails = res.data;
          console.log('file details', res.data);
        }
      }
    )


  }

  getUrl(file_name:any){
    return this.url + "/skill_dev/" + file_name;
  }

}
