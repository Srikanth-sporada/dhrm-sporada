import { Component, OnInit } from '@angular/core';
import {animate,style,transition,trigger} from '@angular/animations';
import { ClamAPIService } from 'src/app/new-contractor-mod/clam-api.service';
import { ApiService } from 'src/app/home/api.service';
import { MessageService } from 'primeng/api';
import { Utility } from 'src/app/utils/utils';
@Component({
  selector: 'app-hr-applied-leave-record',
  templateUrl: './hr-applied-leave-record.component.html',
  styleUrls: ['./hr-applied-leave-record.component.css'],
  animations: [
          trigger('slowAnimate', [
              transition(':enter', [style({ opacity: '0' }), animate(500)]),
              transition(':leave', [style({ opacity: '1' }), animate(500, style({ opacity: '0' }))]),
          ])
      ]
})
export class HrAppliedLeaveRecordComponent implements OnInit {

  userEnteredGenId:any;
  showLeaveRecord:boolean;
  traineeData:any;
  userPlant:any = sessionStorage.getItem('plantcode');
  leaveRecordData:any;

  constructor(
    private apiService:ClamAPIService,
    private apiService2:ApiService,
    private messageService:MessageService,
    public utils:Utility,
  ) { }

  ngOnInit(): void {
  }

  /** 
   * search trainee by gen id
   * get trainee leave balance and eligibility
   * @property {*} traineeData
   * @property {*} showLeaveRecord
   * @property {*} userPlant
   */
  searchTraineeByGenId(){
    const data = {
      genId:this.userEnteredGenId,
      plantCode:this.userPlant
    }
    console.log('TRAINEE SEARCH DATA:',data);
    this.apiService2.getTraineeDataForFML(data).subscribe({
      next: (response:any) => {
        if(response.length){
          this.traineeData = response;
          /** set leave details to true */
          this.showLeaveRecord = true;
          console.log(response);
          /** get trainee leave records */
          this.getTraineeLeaveRecord(this.traineeData[0]?.gen_id);
        }else{
          this.messageService.add({severity:'warn',summary:'Gen ID not found!'})
        }
      },
      error: (error) => {
        console.error('ERROR:',error)
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }

  /** 
   * get trainee leave records
   * @param genId
   * @property {*} leaveRecordData
   *  */
 getTraineeLeaveRecord(genId:any){
  this.apiService.getTrnLeave(genId).subscribe({
    next: (res:any) => {
      this.leaveRecordData = res;
      console.log(res);
    },
    error: (error:any) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.error})
    }
  })
 }
}
