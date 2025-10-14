import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment.prod";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-skill-test',
  templateUrl: './skill-test.component.html',
  styleUrls: ['./skill-test.component.css']
})
export class SkillTestComponent implements OnInit {

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
  photoLink: any= environment.path;
  all:any;
  userDetails:any;
  // Flag to control the display of the self-learning button
  showSelfLearningButton: boolean = false;
 skillLevelOptions = [
  {
    label: 'Level 2',
    value: '2',
    ngIf: 'selectedOperation && (getSkillLevel(0) || selectedSkill?.oprn_trained == null || selectedSkill?.oprn_trained === undefined)'
  },
  {
    label: 'Level 2',
    value: '2',
    ngIf: 'selectedOperation && getSkillLevel(1)'
  },
  {
    label: 'Level 3',
    value: '3',
    ngIf: 'selectedOperation && getSkillLevel(2)'
  },
  {
    label: 'Level 4',
    value: '4',
    ngIf: 'selectedOperation && getSkillLevel(3)'
  },
  {
    label: 'No options',
    value: null,
    ngIf: 'selectedOperation && getSkillLevel(4)',
    disabled: true
  }
];

  constructor(private service: ApiService, private fb: UntypedFormBuilder, private router: Router, private messageService:MessageService) {
    this.form = this.fb.group({
      genid: [sessionStorage.getItem('user_name')],
      new_skill: [''],
      new_skill_level: [''],
    });
  }

  ngOnInit(): void {
    // user information
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.fullname.toUpperCase()+`(${this.all.gen_id})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    // Initialize session variables
    this.username = sessionStorage.getItem('emp_name');
    this.department = sessionStorage.getItem('dept_name');
    this.genid = sessionStorage.getItem('gen_id');
    this.category = sessionStorage.getItem('apprentice_type');
    this.aplnNo = sessionStorage.getItem('user_name');
    this.plant = sessionStorage.getItem('plantcode');

    // If genid exists, call the service to fetch skill test data
    if (this.genid) {
      this.service.getSkillTest(this.aplnNo).subscribe(
        (response: any) => {
          console.log('response', response);

          // Assigning skillTestData and operationsData
          this.skillTestData = response[0][0]; 
          this.operationsData = response[1];

          // this.photo = this.skillTestData.photo_filename;
          this.photo = this.photoLink + "/uploads/" + this.skillTestData.photo_filename;
          

          console.log('skillTestData', this.skillTestData);
          console.log('operationsData', this.operationsData);

          // If line_code exists in the skillTestData, fetch skill operations
          if (this.skillTestData && this.skillTestData.line_code) {
            this.line = this.skillTestData.line_code;  // Safely access line_code
            console.log('line', this.line);

            this.ActSts = this.skillTestData.activestat;

            // Fetch operations based on line and plant
            this.service.getSkillOperations(this.skillTestData.dept_slno, this.plant).subscribe(
              (response1: any) => {
                console.log('response1', response1);
                this.droplist = response1;  // Update droplist with operation data
              },
              (error) => {
                console.error('Error fetching skill operations data', error);
              }
            );
          } else {
            console.error('line_code is missing or skillTestData is empty');
          }
        },
        (error) => {
          console.error('Error fetching skill test data', error);
        }
      );
    } else {
      console.error('genid is missing from session storage');
    }

    if (this.genid){
      this.service.answersheet(this.genid).subscribe(
        (response2: any) => {
          console.log('response2', response2);

          this.paperData = response2;

          console.log('paperdata', this.paperData);
        }
      )
    }
  }

  // This method is triggered when the operation is changed
  onOperationChange() {
    console.log('Selected Operation Value:', this.selectedOperation);

    // Find the selected operation from the operationsData
    this.selectedSkill = this.operationsData.find((item:any) => {
      return item.oprn_desc === this.selectedOperation;  // Compare based on operation description
    });

    // Reset the skill level once operation is changed
    this.form.get('new_skill_level')?.setValue('');

    console.log('Selected Skill:', this.selectedSkill);

    if (this.selectedOperation) {
      this.service.getskillvideo(this.selectedOperation, this.plant).subscribe(
        (response: any) => {
          console.log('Skill Video Response:', response);

          if (response && response.length > 0 && response[0].oprn_file !== null) {
            this.showSelfLearningButton = true;
            console.log('File found, showing self-learning button');
          } else {
            this.showSelfLearningButton = false;
            console.log('No file found or file is null, hiding self-learning button');
          }
        },
        (error) => {
          console.error('Error fetching skill video:', error);
          this.showSelfLearningButton = false;  
        }
      );
    }
  }

  loadSelfLearningFile() {
    const operation = this.selectedOperation;
    const skillLevel = this.form.get('new_skill_level')?.value;
    
    if (operation && skillLevel) {
      this.service.getskillvideo(operation, this.plant).subscribe(
        (response: any) => {
          if (response && response.length > 0 && response[0].oprn_file) {
            const filePath = response[0].oprn_file; 
            const fullFileUrl = this.photoLink + "/oprn_file/" + filePath;
            
            window.open(fullFileUrl, '_blank');
          }
        },
        (error) => {
          console.error('Error loading file for self learning:', error);
        }
      );
    } else {
      alert('Please select a valid operation and skill level.');
    }
  }

  // Method to start skill test
  startSkillTest(): void {
    const newSkill = this.form.get('new_skill')?.value;
    const newSkillLevel = this.form.get('new_skill_level')?.value;

    if (!newSkill || !newSkillLevel) {
      alert('Please select skill and level.');
      return;
    }

    this.service.getRepActiSts(this.genid).subscribe(
      (res: any) => {
        console.log(res)
        if(res && res.message === 'Active') {
          this.service.getSkillTestQuestions(this.plant, newSkillLevel, newSkill, this.genid).subscribe(
            (response: any) => {
              if (response && response.data && response.data.length > 0 && response.message === 'success') {
                // ✅ Navigate only if questions exist
                this.router.navigate(['/rml/skill-developement/skill-test', newSkill, newSkillLevel]);
              } else if (response && response.message === 'Already') {
                alert('Test Already Completed For This Level. Supervisor Abservent Is Pending!')
              } else {
                alert('Skill Test Question Paper Is Not Available, Contact HR');
              }
            },
            (error) => {
              console.error('Error checking skill test questions:', error);
              alert('Error fetching questions. Please try again later.');
            }
          );
        } else {
          alert(`Your Reporting Person ${res.data} Already Resigned. Contact HR`);
        }
      }
    )

    
  }

  // Method to determine if the selected skill level is valid
  getSkillLevel(level: number): boolean {
    if (!this.selectedSkill) return false;  
    switch (level) {
      case 1:
        return this.selectedSkill.oprn_trained === 1;
      case 2:
        return this.selectedSkill.oprn_trained === 2;
      case 3:
        return this.selectedSkill.oprn_trained === 3;
      case 4:
        return this.selectedSkill.oprn_trained === 4;
      default:
        return false;
    }
  }
}
