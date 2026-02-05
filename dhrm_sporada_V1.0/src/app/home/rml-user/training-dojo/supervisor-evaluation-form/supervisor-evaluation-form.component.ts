import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-supervisor-evaluation-form',
  templateUrl: './supervisor-evaluation-form.component.html',
  styleUrls: ['./supervisor-evaluation-form.component.css']
})

export class SupervisorEvaluationFormComponent implements OnInit {

  peval_no: any;
  plant: any;
  Abser_Point: any = [
  {
    index: 1,
    Abservent_Point: "Observation 1",
    rating: "Good",
    remark: "Well done"
  },
  {
    index: 2,
    Abservent_Point: "Observation 2",
    rating: "Average",
    remark: "Needs improvement"
  }
];

  Sup_id: any;
  dept_no: any;
  emp_det: any = [];
  ratings: string[] = [];
  recom: string = "Yes";
  remarks: any = [];
  user_id: any;

  constructor(
    private route: ActivatedRoute,
    private service: ApiService,
    private router: Router ,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {
    /** route params */
  this.peval_no = this.route.snapshot.paramMap.get('peval_slno');
  this.dept_no = this.route.snapshot.paramMap.get('dept');
  this.user_id = this.route.snapshot.paramMap.get('user');
  this.plant = sessionStorage.getItem('plantcode');
  this.Sup_id = sessionStorage.getItem('user_name');

  console.log('peval numbr', this.peval_no);
  console.log('Sup Num', this.Sup_id);
  console.log('dept no', this.dept_no);
  console.log('trainee id', this.user_id);

  /** get supervison abservant point */
  this.getSupervisorPoint();

  /** get old abservant points */
  this.getSupervisorOldPoints();

  /** get trainee status */
  
}

/** 
 * get supervison abservant point API
 */
  getSupervisorPoint(){
    this.service.getSupervisorAbserventPoint(this.plant, this.dept_no).subscribe({
      next:(res: any) => {
        console.log('Abservant Points:', res);
        // this.Abser_Point = res;
        /** Initialize ratings and remarks */
        this.ratings = res.map(() => 'Good');
        this.remarks = res.map(() => '');
        console.log('Remarks:', this.remarks); 
      },
      error: (error) => {
        console.error('Error Fetching Skill Abservent Points', error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    });
  }
/** 
 * get observer old points API
 */
  getSupervisorOldPoints(){
    this.service.getOldAbservent(this.peval_no).subscribe({
      next: (res: any) => {
        console.log('old abservent', res);
        if (res.message === 'success' && res.data && res.data.length > 0) {
          // Bind old abservent data to the form fields
          res.data.forEach((oldData: any, index: number) => {
            if (this.Abser_Point[index]) {
              // If old data exists for this point, bind the values to ratings, remarks, and recom
              this.ratings[index] = oldData.Rating || 'Good'; // Default to 'Good' if no rating is found
              this.remarks[index] = oldData.Remarks || ''; // Default to empty string if no remark is found
              this.recom = oldData.Supervisor_Recoment || 'Yes'; // Default to 'Yes' if no recommendation is found
            }
          });
        }
      },
      error:(error) => {
        console.error(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    });
  }
  /** 
   * get trainee status API
   */
  getTraineeStatus(){
    this.service.getSkillPersonStatus(this.peval_no).subscribe({
    next: (response: any) => {
      console.log('employee details', response);
      this.emp_det = response[0];
    },
     error:(error) => {
      console.error(error);
      this.messageService.add({severity:'error',summary:error.message})
    }
  });
  }

  /** route back function */
  back() {
    this.router.navigate(['/rhrm/skill-developement/Supervisor_Evaluation']);
  }


  /** 
   * remark change event
   * @param event
   * @param i
   *  */
  RemarkChange(event: any, i: any) {
    console.log('event', event.target.value);
    this.remarks[i] = event.target.value;
  }
  

  /** 
   * submit observar point
   */
  submit(): void {
    const formValue = [];
    const data = [];

    /** map ratings & remarks & recom */
    for (let i = 0; i < this.Abser_Point.length; i++) {
      formValue.push({
        Abser_Id: this.Abser_Point[i].Abserv_id,
        Abser_Ques: this.Abser_Point[i].Abservent_Point,
        Recoment: this.recom, 
        Rating: this.ratings[i],
        Remark: this.remarks[i]
      });
    }

    data.push({
      plant: this.plant,
      dept: this.dept_no,
      peval: this.peval_no,
      sup: this.Sup_id,
      trainee: this.user_id
    });

    console.log('Form Submission:', formValue);
    console.log('User Details Submit', data);

    const requestPayload = {
      AbsData: formValue,
      userData: data
    };

    /** sumbit supervisor point API */
    this.service.submitSuperAbserv(requestPayload)
      .subscribe({
        next: (res: any) => {
          console.log('response submit', res);
          if(res.message === 'Exsists') {
            // alert('Abservation Already Submitted');
            this.messageService.add({severity:'info',summary:'Abservation Already Submitted'})
            this.router.navigate(['/rhrm/skill-developement/Supervisor_Evaluation']);
          }
          else if(res.message === 'success') {
            // alert('Abservation Has Been Saved Successfully');
            this.messageService.add({severity:'info',summary:'Abservation Has Been Saved Successfully'})
            this.router.navigate(['/rhrm/skill-developement/Supervisor_Evaluation']);
          } else {
            // alert("There was an issue saving the questions. Please try again.");
            this.messageService.add({severity:'warn',summary:'There was an issue saving the questions. Please try again.'})
            
          }
        },
        error: (error:any) => {
          console.log('ERORR:',error);
          this.messageService.add({severity:'error',summary:error?.message});
        }
      })
  }

}
