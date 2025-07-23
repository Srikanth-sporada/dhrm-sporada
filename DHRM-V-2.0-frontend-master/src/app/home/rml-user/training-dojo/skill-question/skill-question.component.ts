import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-skill-question',
  templateUrl: './skill-question.component.html',
  styleUrls: ['./skill-question.component.css']
})
export class SkillQuestionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  flag: any = true;
  loading: any = false;
  modules: any;
  questions: any = [{}];
  inserted: any = 1;
  offline_flag: boolean = true;
  qsize: any;
  url = environment.path +'/qbank/';
  img: any;

  username = { 'username': sessionStorage.getItem('plantcode') };

  constructor(private fb: UntypedFormBuilder, private service: ApiService, public loader: LoaderserviceService) {
    this.form = fb.group({
      module: [''],
      username: [sessionStorage.getItem('user_name')],
      plantcode: [sessionStorage.getItem('plantcode')],
      level: ['']
    });
  }

  ngOnInit(): void {
    this.service.getOperationsSkill(this.username)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.modules = response;
        },
        error: (error) => console.log(error)
      });
  }

  // Method triggered when the 'module' is changed
  getquestions(event: any) {
    // Get selected module (oprn_slno) and level
    const selectedOpSlno = this.form.controls['module'].value;
    const selectedLevel = this.form.controls['level'].value;

    // Ensure both module and level are selected before making the API call
    if (selectedOpSlno && selectedLevel) {
      this.flag = false;
      const selectedModule = this.modules.find((module: any) => module.oprn_slno == selectedOpSlno);

      // Determine if the module is 'OFFLINE'
      if (selectedModule?.category === 'OFFLINE') {
        this.offline_flag = false;
      } else {
        this.offline_flag = true;
      }

      console.log('Selected Module:', selectedOpSlno);
      console.log('Selected Level:', selectedLevel);

      // Call the API only if both values are selected
      this.service.getSkillQs_trn({
        module: selectedOpSlno,
        plant: sessionStorage.getItem('plantcode'),
        level: selectedLevel
      })
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.questions = response;
            this.qsize = this.questions.length;
            this.questions.push({});
            this.img = `${this.url}${this.questions.image_filename}`;
          },
          error: (error) => {
            console.error('Error fetching questions:', error);
          }
        });
    }
  }

  // Method triggered when the 'level' is changed
  getLevel(event: any): void {
    const selectedLevel = event.target.value;
    console.log('Selected level:', selectedLevel);

    // Call getquestions if both level and module are selected
    const selectedOpSlno = this.form.controls['module'].value;

    if (selectedOpSlno && selectedLevel) {
      this.getquestions(event);
    }
  }

  addrow(i: any) {
    if (this.form.controls['module'].value == '') {
      alert('Please select a Operation');
    } else {
      if (i == this.questions.length - 1) {
        this.questions.push({});
        this.inserted += 1;
        console.log(this.inserted);
      }
    }
  }

  question(event: any, i: any) {
    this.questions[i].question = event.target.value;
    console.log(this.questions[i]);
  }

  answers(event: any, i: any) {
    const selectedAnswer = event.target.value;
    if (!selectedAnswer) {
      alert('Please select an answer');
      return; // Prevent further processing if no answer is selected
    }
  
    // Update the correct_answer if a valid selection is made
    this.questions[i].correct_answer = selectedAnswer.toUpperCase();
    console.log(this.questions);
  }
  
  

  file(event: any, i: any) {
    const exten = event.target.files[0].name.split('.');
    const fileExtension = exten.pop();
    const formData = new FormData();

    formData.append("file", event.target.files[0], this.form.controls['module'].value + '_' + (i + 1) + '_picture.' + fileExtension);

    this.questions[i].image_filename = this.form.controls['module'].value + '_' + (i + 1) + '_picture.' + fileExtension;

    this.service.questionbankupload(formData)
      .subscribe({
        next: (res) => { console.log(res); },
        error: (err) => { console.log(err); }
      });
  }

  submit() {
    // Get the selected values from the form
    const selectedModule = this.form.controls['module'].value;
    const selectedLevel = this.form.controls['level'].value;
  
    // Validate if both module and level are selected
    if (!selectedModule || !selectedLevel) {
      alert('Please select both Module and Level before saving.');
      return; // Do not proceed with the submission if validation fails
    }


    // Validate that all questions have a 'correct_answer'
    for (let i = 0; i < this.questions.length - 1; i++) {
      if (!this.questions[i].correct_answer) {
        alert(`Please select a correct answer for question ${i + 1}`);
        return; 
      }
    }
  
    // Add the module and other data to the last question object
    this.questions[this.questions.length - 1] = {
      module: selectedModule,
      plantcode: sessionStorage.getItem('plantcode'),
      levl: selectedLevel,
      inserted: this.inserted
    };
  
    // Call the service to save the questions
    this.service.skillQuestionBank(this.questions)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.message === 'success') {
            alert("The questions have been successfully saved.");
            location.reload(); // Optionally reload the page after saving
          } else {
            alert("There was an issue saving the questions. Please try again.");
          }
        },
        error: (err) => {
          console.log('Error saving questions:', err);
          alert("There was an error while saving the questions.");
        }
      });
  } 
  

  clearForm(): void {
    this.form.controls['module'].setValue('');
    this.form.controls['level'].setValue('');
    this.offline_flag = true;
    this.questions = [{}];  
    this.inserted = 1;
    console.log('Form cleared');
  }

  delete(i: any) {
    console.log(this.questions[i].question);
    if (this.questions.length != 1 && this.questions.length != i + 1) {
      this.service.questionBankDelete({ qslno: this.questions[i].qslno })
        .subscribe({
          next: (res: any) => {
            console.log("qdel", res);
            if (i + 1 >= this.qsize) {
              this.inserted -= 1;
              console.log(this.inserted, this.qsize);
            }
          }
        });
      this.questions.splice(i, 1);
    }
    console.log(this.questions);
  }
}
