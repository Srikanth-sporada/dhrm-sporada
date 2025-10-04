import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, UntypedFormBuilder, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Route, Router, RouteReuseStrategy, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/home/api.service';
import { LoaderserviceService } from 'src/app/loaderservice.service';

@Component({
  selector: 'app-supervisor-evaluation',
  templateUrl: './supervisor-evaluation.component.html',
  styleUrls: ['./supervisor-evaluation.component.css']
})
export class SupervisorEvaluationComponent implements OnInit {

  someSubscription:any
  filterinfo:any= [];

  id:any
  form:any
  filterinfos: any;
  all:any;
  evaluationOptions = [
  { value: '1', label: 'First Evaluation', },
  { value: '2', label: 'Second Evaluation', },
  { value: '3', label: 'Third Evaluation', },
  { value: '4', label: 'Fourth Evaluation', }
];

  userDetails:any;
  constructor(private fb : UntypedFormBuilder, private http: HttpClient, private service: ApiService, private active: ActivatedRoute, private router: Router,public loader:LoaderserviceService, private messageService:MessageService) {


    this.form = this.fb.group({
      status: ['1'],
      plantcode: [sessionStorage.getItem('plantcode')],
      id: ['2'],
      emp_id: [sessionStorage.getItem('user_name')]
    });

   }

  //  ngOnDestroy() {
  //   if (this.someSubscription) {
  //     this.someSubscription.unsubscribe();
  //   }
  // }


  ngOnInit(): void {
  let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    console.log("00",this.form.value)

    this.service.evaluationdaysup(this.form.value)
    .subscribe(
      {
        next: (response)=>{console.log(response); 
          this.filterinfo = response
          this.filterinfos = this.filterinfo.filter((obj:any)=> obj.ra_entry !== 'N')
          console.log(this.filterinfos)
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({severity:'error',summary:error.message})
        }
      }
    )
  }

  filter()
  {
    console.log(this.form.value)
    this.service.evaluationdaysup(this.form.value)
    .subscribe(
      {
        next: (response)=>{
          console.log(response); this.filterinfo = response
        },
         error: (error) => {
          console.log(error);
          this.messageService.add({severity:'error',summary:error.message})
        }
      }
    ) 
  }

}
