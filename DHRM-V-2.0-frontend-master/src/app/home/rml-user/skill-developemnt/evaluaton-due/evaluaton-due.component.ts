import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, UntypedFormBuilder, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Route, Router, RouteReuseStrategy, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { LoaderserviceService } from 'src/app/loaderservice.service';
@Component({
  selector: 'app-evaluaton-due',
  templateUrl: './evaluaton-due.component.html',
  styleUrls: ['./evaluaton-due.component.css']
})
export class EvaluatonDueComponent implements OnInit {

  someSubscription:any
  filterinfo:any = []
  id:any
  form:any
  tick :any = '✔️'
  ex:any
  department:any;
  changeline:any;
  line:any;
  name:any;
  dept:any;
  skillsummary:any
  constructor(private fb : UntypedFormBuilder, private http: HttpClient, private service: ApiService, private active: ActivatedRoute, private router: Router,public loader:LoaderserviceService) {

    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    // this.someSubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Here is the dashing line comes in the picture.
    //     // You need to tell the router that, you didn't visit or load the page previously, so mark the navigated flag to false as below.
    //     this.router.navigated = false;
    //   }
    // });

    this.form = this.fb.group({
      status: ['0-60'],
      plantcode: [sessionStorage.getItem('plantcode')],
      id: ['3']

    });

   }

  ngOnInit(): void {
    this.service.getskillsummry().subscribe((response:any)=>{
      if(response.status='success'){
        this.skillsummary=response.data
        let sum_skill=response.data.reduce((acc:any,element:any)=>{
            return {skill_1:acc.skill_1+element.skill_1,
                    skill_2:acc.skill_2+element.skill_2,
                    skill_3:acc.skill_3+element.skill_3,
                    skill_4:acc.skill_4+element.skill_4}
        },{skill_1:0,skill_2:0,skill_3:0,skill_4:0})
        sum_skill={...sum_skill,diff_range:'A_SUM'}
        this.skillsummary.push(sum_skill)
        console.log(this.skillsummary)
      }
    })
    this.filter()
    this.service.dept_line_report({plantcode: sessionStorage.getItem('plantcode')})
    .subscribe(
      {
        next: (response:any)=>
        {
          console.log(response);
          this.department = response[1]
        }
      }
    )
  }

  filter()
  {
    var form = {plant_code : sessionStorage.getItem('plantcode'), dept_slno : ''}
    var x:any = sessionStorage.getItem('all')
    x = JSON.parse(x)
    form.dept_slno = x.Department
    var RA = x.Is_ReportingAuth
    if(RA)
    {
      this.service.evaluationDueSupervisor(form)
      .subscribe(
        {
          next: (response)=>{console.log(response); this.filterinfo = response}
        }
      ) 
    }
    else
    {
      this.service.evaluationDueSupervisor(form)
      .subscribe(
        {
          next: (response)=>{console.log(response); this.filterinfo = response}
        }
      ) 
    }

  }

  getLineName(event:any){
    let deptDetails = this.department.filter((item:any) => {
      return item.dept_name == event.value
    })
    let deptCode=deptDetails[0].dept_slno
      this.service.getLineName({dept_slno: deptCode})
      .subscribe(
        {
          next:(response:any)=>{console.log(response);
           this.changeline = response[0]
           console.log(this.changeline)
          }
      })
    }

}
