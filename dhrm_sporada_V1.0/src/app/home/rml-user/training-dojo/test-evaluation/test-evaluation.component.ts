import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-test-evaluation',
  templateUrl: './test-evaluation.component.html',
  styleUrls: ['./test-evaluation.component.css']
})
export class TestEvaluationComponent implements OnInit {

  trainee: any
  modules: any
  form: any
  loading:any = false
  all:any;
  userDetails:any;
  trainee_id: any = ''
  examTypeOptions = [
  { label: 'Pre-Test', value: 'pre-test' },
  { label: 'Post-Test', value: 'post-test' }
];


  constructor(private service: ApiService, private fb: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, public loader:LoaderserviceService,private messageService:MessageService) {
    this.form = this.fb.group({
      trainee: ['', Validators.required],
      test: ['', Validators.required],
      module: ['', Validators.required],
      file: [''],
      score: [''],
      pf: [''],
      percent: [''],
      priorityval: [''],
      min_percent: [''],
      plant_code: ['']
    })
  }
  filterTrainee: Observable<any[]>;

  ngOnInit(): void {
    // user information
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }

    this.form.get('test').disable()
    this.service.getTrainee()
      .subscribe(
        {
          next: (response) => {
            console.log('trainee : ', response)
            this.trainee = response
            this.filterTrainee = this.form.get('trainee').valueChanges.pipe(
              startWith(''),
              map((value: any) => this.filterOptions(value))
            );
          },
          error: (error) => {
             console.log(error);
             this.messageService.add({severity:'error',summary:error?.error?.message})
          }
        }
      )
// get offline modules
    this.service.getOfflineModules()
      .subscribe(
        {
          next: (response) => { console.log('trainee : ', response), this.modules = response },
          error: (error) => {
             console.log(error);
             this.messageService.add({severity:'error',summary:error.error.message})
          }
        }
      )

  }

  filterOptions(value: any): any[] {
    console.log(value, "/////////////////");

    const filterValue = value?.toLowerCase();
    return this.trainee.filter((trainee: any) => trainee.fullname.toLowerCase().includes(filterValue));
  }

  // submit evalution form
  offline_page() {
    this.form.get('test').enable()
    if (this.form.controls['score'].value == '' || this.form.controls['score'].value == null) {
      alert("please enter mark for the paper")
    }
    else {
      console.log('Before',this.form.value);

      var i = this.form.controls['module'].value.index
      this.form.controls['pf'].setValue(this.form.controls['module'].value.pass_criteria <= this.form.controls['score'].value ? 'p' : 'f')
      this.form.controls['priorityval'].setValue(this.form.controls['module'].value.priorityval)
      this.form.controls['percent'].setValue(parseInt(String(((this.form.controls['score'].value) / (this.form.controls['module'].value.total_marks)) * 100)))
      this.form.controls['min_percent'].setValue(this.form.controls['module'].value.pass_percent)
      this.form.controls['plant_code'].setValue(sessionStorage.getItem('plantcode'))
      this.form.controls['module'].setValue(this.form.controls['module'].value.module_name)

      console.log('After',this.form.value)
      this.loading = true
      this.service.offlineUpload(this.form.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.loading = false
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload'
            this.router.navigate(['/rdhrm/training_dojo/test-evaluation'], { relativeTo: this.route })
            this.form.reset()
          },
          error: (err) => console.log(err)
        })
    }

  }

  // store trainee id
  store_trainee(event: any) {
    this.trainee_id = event.value;
    console.log(this.trainee_id);

  }

  // get trainee test status
  get_test_status(event: any) {
    console.log(event);
    var value = event.value.module_name;
    var obj = { module_name: value, idno: this.trainee_id }
    console.log(obj)
    this.service.get_test_status(obj)
      .subscribe(
        {
          next: (response: any) => {
            console.log(response)
            if (response.status == 'already') 
            {
              // alert("Trainee already finished evauation");
              this.messageService.add({severity:'info',summary:'Trainee already finished evauation'})
              this.form.reset()
              this.service.getTrainee()
                .subscribe(
                  {
                    next: (response) => {
                      console.log('trainee : ', response)
                      this.trainee = response
                      this.filterTrainee = this.form.get('trainee').valueChanges.pipe(
                        startWith(''),
                        map((value: any) => this.filterOptions(value))
                      );
                    },
                    error: (error) => {
                      console.log(error);
                      this.messageService.add({severity:'error',summary:error?.error?.message})
                    }
                  }
                )
            }
            if (response.status == 'The trainee is not qualified for this exam' || response.status == 'Please select the Trainee') 
            {
              // alert(response.status)
              this.messageService.add({severity:'info',summary:response.status})
              this.form.reset()
              this.service.getTrainee()
                .subscribe(
                  {
                    next: (response) => {
                      console.log('trainee : ', response)
                      this.trainee = response
                      this.filterTrainee = this.form.get('trainee').valueChanges.pipe(
                        startWith(''),
                        map((value: any) => this.filterOptions(value))
                      );
                    },
                    error: (error) => {
                      console.log(error);
                      this.messageService.add({severity:'error',summary:error?.error?.message})
                    }
                  }
                )
            }
            if (response.status == 'exam failed') {
              this.form.controls['test'].setValue('post-test')
            }
            else
            {
              this.form.controls['test'].setValue(response.status)
              // this.form.controls['test'].
            }
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({severity:'error',summary:error?.error?.message})
          }
        }
      )

  }

  // test file upload
  offline_upload(event: any) {
    if (this.form.invalid){
      // alert('select the above requirements');
      this.messageService.add({severity:'warn',summary:'select the above requirements'})
    }
      
    else {
      var exten = event.target.files[0].name.split('.')
      exten = exten.pop()
      var formData = new FormData()

      formData.append("file", event.target.files[0], this.trainee_id + '_' + this.form.controls['module'].value + '_' + this.form.controls['test'].value + '.' + exten)

      this.service.offline_test(formData)
        .subscribe({
          next: (res) => {
            console.log(res)
            this.form.controls['file'].setValue(this.trainee_id + '_' + this.form.controls['module'].value + '_' + this.form.controls['test'].value + '.' + exten)
          },
          error: (err) => { 
            console.log(err);
            this.messageService.add({severity:'error',summary:err?.error?.message})
           }
        })
    }


  }
}
