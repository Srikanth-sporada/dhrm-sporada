import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/home/api.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { MessageService } from 'primeng/api';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  moduleStatus:any;
  examTypeOptions = [
  { label: 'Pre-Test', value: 'pre-test' },
  { label: 'Post-Test', value: 'post-test' }
];


  constructor(
    private service: ApiService, 
    private fb: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    public loader:LoaderserviceService,
    private modal:NgbModal,
    private messageService:MessageService) {

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
    /** disbale exam type */
    this.form.get('test').disable();
    this.getTrainee();

    // this.getOfflineModules();
  }

  filterOptions(value: any): any[] {
    console.log(value);
    const filterValue = value?.toLowerCase();
    return this.trainee.filter((trainee: any) => trainee.fullname.toLowerCase().includes(filterValue));
  }

  /** submit offline evaluation form */
  offline_page() {
    this.form.get('test').enable()
    if (this.form.controls['score'].value == '' || this.form.controls['score'].value == null) {
      // alert("please enter mark for the paper")
      this.messageService.add({severity:'warn',summary:'Please Enter Mark!'})
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

      console.log('OFLINE TEST FORM:',this.form.value)

      this.loading = true
    /** offline upload API */
      this.service.offlineUpload(this.form.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.loading = false
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.messageService.add({severity:'info',summary:'Trainee offline test uploaded successfully.'})
            this.router.navigate(['/rhrm/training_dojo/test-evaluation'], { relativeTo: this.route })
            this.form.reset()
          },
          error: (error:any) => {
            console.error('ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.message});
          }
        })
    }

  }

  /** 
   * get trainee ID
   * @property {*} trainee_id
   * trainee drop down change event
   */
  store_trainee(event: any) {
    this.trainee_id = event.value;
    console.log('SELECTED TRAINEE ID:',this.trainee_id);
    /** get trainee offline */
    this.getOfflineModules();
  }

  /** 
   * get trainee test status 
   * @param event change event
   * check trainee modules
   */
  get_test_status(event: any) {
    console.log(event);
    var value = event.value.module_name;
    var obj = { module_name: value, idno: this.trainee_id }
    console.log(obj);
    /** check trainee modules */
    this.checkTraineeModules(obj);
    /** get test status */
    this.service.get_test_status(obj)
      .subscribe(
        {
          next: (response: any) => {
            console.log('TRAINEE TEST RES:',response)
            if (response.status == 'already') 
            {
              // alert("Trainee already finished evauation");
              this.messageService.add({severity:'info',summary:'Trainee already finished evaluation'});
              /** reset form */
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
                      console.error('ERROR:',error);
                      this.messageService.add({severity:'error',summary:error?.error?.message});
                    }
                  }
                )
            }
            /** based on trainee test status res */
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
                      console.error('ERROR:',error);
                      this.messageService.add({severity:'error',summary:error?.error?.message})
                    }
                  }
                )
            }
            /** set exam type based on response */
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
            console.error('ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.error?.message})
          }
        }
      )
  }

  /** 
   * trainee ofline test file uplaod
   * @param event 
   */
  offline_upload(event: any) {
    if (this.form.invalid){
      // alert('select the above requirements');
      this.messageService.add({severity:'warn',summary:'select the above requirements'})
    }
      
    else {
      var exten = event.target.files[0].name.split('.')
      exten = exten.pop();
      /** offline test file name */
      console.log('FILE NAME:', this.trainee_id + '_' + this.form.controls['module'].value.module_name + '_' + this.form.controls['test'].value + '.' + exten);

      var formData = new FormData()

      formData.append("file", event.target.files[0], this.trainee_id + '_' + this.form.controls['module'].value + '_' + this.form.controls['test'].value + '.' + exten)

      this.service.offline_test(formData)
        .subscribe({
          next: (res) => {
            console.log('OFFLINE TEST RES:',res);
            /** file rename */
            this.form.controls['file'].setValue(this.trainee_id + '_' + this.form.controls['module'].value.module_name.trim() + '_' + this.form.controls['test'].value + '.' + exten)
          },
          error: (err) => { 
            console.error('ERROR:',err);
            this.messageService.add({severity:'error',summary:err?.error?.message})
           }
        })
    }
  }

  /** 
   * get offline modules based in selected trainee
   * @property {*} modules
   * @property {*} trainee_id
   */
  getOfflineModules(){
    // get offline modules
    this.service.getOfflineModules(this.trainee_id)
      .subscribe(
        {
          next: (response) => { 
            console.log('trainee : ', response), 
            this.modules = response 
          },
          error: (error) => {
             console.error('ERROR:',error);
             this.messageService.add({severity:'error',summary:error.error.message})
          }
        }
      )
  }

  /** 
   * get offline test trainees
   * @property {*} trainee
   * @property {*} filterTrainee
   */
  getTrainee(){
    this.service.getTrainee()
      .subscribe(
        {
          next: (response) => {
            console.log('TRAINEE DATA:', response)
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

  /** 
   * check trainee module 
   * @param data
   */
  checkTraineeModules(data:any){
    this.service.checkTrainingModule(data).subscribe({
      next: (response:any) => {
        /** set module status */
        this.moduleStatus = response.status;
        console.log('CHECK:',response);
        /** open confirm component */
        if(response.status == 'false'){
          const componentInstance = this.modal.open(ConfirmationComponent, {centered:true})
          componentInstance.componentInstance.confirmFunction = () => {console.log('yes clicked!.')}
          componentInstance.componentInstance.confirmText = response.message;
        }
      },
      error: (error:any) => {
        console.log('ERROR:', error);
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }
}
