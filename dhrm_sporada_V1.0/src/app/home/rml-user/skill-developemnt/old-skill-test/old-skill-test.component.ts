import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment.prod";
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderserviceService } from 'src/app/loaderservice.service';

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
//   operationsData: any = [
//   {
//     oprn_desc: "Safety Training",
//     oprn_trained: 1   // highlights yellow
//   },
//   {
//     oprn_desc: "Machine Operation",
//     oprn_trained: 2   // highlights blue
//   },
//   {
//     oprn_desc: "Quality Inspection",
//     oprn_trained: 3   // highlights green
//   },
//   {
//     oprn_desc: "Advanced Maintenance",
//     oprn_trained: 4   // highlights darkgreen
//   },
//   {
//     oprn_desc: "Emergency Procedures",
//     oprn_trained: 1   // highlights yellow
//   },
//   {
//     oprn_desc: "Inventory Management",
//     oprn_trained: 2   // highlights blue
//   }
// ];
operationsData:any = [];  
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
  fileDetails:any = [];
//   fileDetails:any = [
//   {
//     curr_skill_level: 1,
//     tnr_filename: "test_doc_level1.pdf",
//     sup_filename: "evaluation_doc_level1.pdf"
//   },
//   {
//     curr_skill_level: 2,
//     tnr_filename: "test_doc_level2.pdf",
//     sup_filename: "evaluation_doc_level2.pdf"
//   },
//   {
//     curr_skill_level: 3,
//     tnr_filename: "test_doc_level3.pdf",
//     sup_filename: "evaluation_doc_level3.pdf"
//   },
//   {
//     curr_skill_level: 4,
//     tnr_filename: "test_doc_level4.pdf",
//     sup_filename: "evaluation_doc_level4.pdf"
//   }
// ];
  url: any = environment.path;

  constructor(
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService:MessageService,
     // ✅ this is the right one
     public loader:LoaderserviceService,
  ) {
    this.form = this.fb.group({
      genid: [sessionStorage.getItem('user_name')],
      new_skill: [''],
      new_skill_level: [''],
    });
  }

  ngOnInit(): void {

    this.aplnNo = this.route.snapshot.paramMap.get('peval');

    console.log('Application:', this.aplnNo);
    /** get skill test */
    this.getSkillTest();
    /** get test files */
    this.getTestFiles();
  }

  /**
   * get Trainee Skill Test
   * @property {*} aplnNo
   * @property {*} skillTestData
   * @property {*} operationsData
   * 
   */
  getSkillTest(){
     this.service.getSkillTestHr(this.aplnNo).subscribe({
      next: (response: any) => {
        console.log('skill evaluation:', response);

        // Assigning skillTestData and operationsData
        this.skillTestData = response[0][0];
        // this.skillTestData.activestat = 'INACTIVE';
        this.operationsData = response[1];
        this.genid = this.skillTestData.gen_id;
        /** profile check */
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
      error: (error) => {
        console.error('Error fetching skill test data', error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }

  /** 
   * get Test documents
   * @property {*} aplnNo
   * @property {*} fileDetails
   *  */
  getTestFiles(){
    this.service.getFileDetails(this.aplnNo).subscribe({
      next:  (res: any) => {
        if(res.status=='success'){
          this.fileDetails = res.data;
          console.log('file details', res.data);
        }else{
          console.log('ERROR:',res);
          this.messageService.add({severity:'error',summary:'Oops! Error occured.'})
        }
      },
      error:(error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
    })
  }
  /**
   *  get file URL
   * @param fileName
   */
  getUrl(fileName:any){
    return this.url + "/skill_dev/" + fileName;
  }

}
