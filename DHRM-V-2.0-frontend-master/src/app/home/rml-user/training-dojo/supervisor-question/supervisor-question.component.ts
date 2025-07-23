import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { FormControl, Validators, FormBuilder, UntypedFormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-supervisor-question',
  templateUrl: './supervisor-question.component.html',
  styleUrls: ['./supervisor-question.component.css']
})
export class SupervisorQuestionComponent implements OnInit {

  form: FormGroup = new FormGroup({})
  offline_flag: boolean = true;
  flag: any = true;
  qsize: any;
  questions: any = [{}]
  inserted: any = 1;
  modules: any
  username = { 'username': sessionStorage.getItem('plantcode') }
  plantcode = sessionStorage.getItem('plantcode');

  constructor(private fb: UntypedFormBuilder, private service: ApiService, private active: ActivatedRoute, private router: Router, public loader: LoaderserviceService) {
    this.form = fb.group({
      module: [''],
      username: [sessionStorage.getItem('user_name')],
      plantcode: [this.plantcode],
      ActSts: ['']
    })
  }

  ngOnInit(): void {
    this.service.getSupDept(this.plantcode)
      .subscribe({
        next: (response) => { console.log(response); this.modules = response },
        error: (error) => console.log(error)
      })
  }

  addrow(i: any) {
    if (this.form.controls['module'].value == '') {
      alert('Please select a Department');
    } else {
      if (i == this.questions.length - 1) {
        this.questions.push({
          question: '',
          ActSts: true
        });
        this.inserted += 1;
        // console.log(this.inserted);
      }
    }
  }

  question(event: any, i: any) {
    this.questions[i].question = event.target.value;
    console.log(this.questions[i]);
    console.log('i', i)
    console.log('event', event)
  }

  getquestion(event: any) {
    const selectedDept = this.form.controls['module'].value;

    if (selectedDept) {
      this.flag = false;

      this.service.getSupQuestion({
        Department: selectedDept,
        Plant: sessionStorage.getItem('plantcode')
      })
      .subscribe({
        next: (response: any) => {
          console.log('questions from backend',response);
          this.questions = response;
          this.qsize = this.questions.length;
          this.questions.push({
            question: "",
            ActSts: true
        });
        },
        error: (error) => {
          console.error('Error fetching questions:', error);
        }
      })
    }
  }

  handleToggle(q: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(`Before toggle - ActSts for question ID ${q.Abserv_id}:`, q.ActSts);
    
    q.ActSts = input.checked ? true : false;
    
    console.log(`After toggle - ActSts for question ID ${q.Abserv_id}:`, q.ActSts);
  }
  
  
  
  

  submit() {
    const selectedDept = this.form.controls['module'].value;
  
    if (!selectedDept) {
      alert("Please select a Department.");
      return;
    }
  
    const lastValidIndex = this.questions.length - 2;
    const lastQuestionText = this.questions[lastValidIndex]?.question;
  
    if (!lastQuestionText || lastQuestionText.trim() === '') {
      alert("Last question should not be empty!");
      return;
    }
  
    const filteredQuestions = this.questions
    .slice(0, this.questions.length - 1) 
    .filter(q => q.question && q.question.trim() !== '') 
    .map(q => ({
      Abserv_id: q.Abserv_id || null,  
      question: q.question.trim(),
      module: selectedDept,
      plantcode: this.plantcode,
      ActSts: q.ActSts 
    }));

    const payloadToSend = [...filteredQuestions, { inserted: this.inserted }];
    console.log('payyyyyy', payloadToSend)
  
    this.service.SupAbserPoint(payloadToSend)
      .subscribe({
        next: (res: any) => {
          console.log('sup', res);
          if (res.message === 'success') {
            alert('The Questions have been successfully saved.');
            location.reload();
          } else {
            alert("There was an issue saving the questions. Please try again.");
          }
        },
        error: (err) => {
          console.log('Error saving questions:', err);
          alert("There was an error while saving the questions.");
        }
      });
  
    console.log('Saving questions:', filteredQuestions);
  }
  




  clearForm(): void {
    this.form.controls['module'].setValue('');
    this.offline_flag = true;
    this.questions = [{}];
    this.inserted = 1;
    console.log('Form cleared');
  }

}
