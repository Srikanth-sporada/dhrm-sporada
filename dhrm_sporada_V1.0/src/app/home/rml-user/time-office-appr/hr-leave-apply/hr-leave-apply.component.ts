import { Component, OnInit } from "@angular/core";
import {animate,style,transition,trigger} from '@angular/animations';
import { ClamAPIService } from "src/app/new-contractor-mod/clam-api.service";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment.prod";
import { ApiService } from "src/app/home/api.service";
import moment from "moment";
import { LoaderserviceService } from "src/app/loaderservice.service";


@Component({
  selector: "app-hr-leave-apply",
  templateUrl: "./hr-leave-apply.component.html",
  styleUrls: ["./hr-leave-apply.component.css"],
   animations: [
          trigger('slowAnimate', [
              transition(':enter', [style({ opacity: '0' }), animate(500)]),
              transition(':leave', [style({ opacity: '1' }), animate(500, style({ opacity: '0' }))]),
          ])
      ]
})

export class HrLeaveApplyComponent implements OnInit {
  traineeLeaveEligibility: any;
  traineeLeaveBalance: any;
  /** hide leave */
  hideEsiLeave: boolean = environment?.hideEsiLeave;
  hideAdvanceLeave: boolean = environment?.hideAdvanceLeave;
  selectedLeaveType: any;
  /** trainee data */
  userEnteredGenId:any;
  traineeData:any;
  showLeaveDetails:boolean = false;
  /** user seleceted leave details */
  fromDate: any;
  toDate: any;
  leaveReason: any;
  firstHalf: any;
  secondHalf: any;
  first: boolean;
  second: boolean;
  halfCheck: boolean =  true; // default
  duration: any = 0; // deafult 0
  isBtnDisabled: boolean = true; // disable btn by deafult
  userPlant:any =  sessionStorage.getItem('plantcode');
  loggedInUserID = sessionStorage.getItem('emp_id');
 

  constructor(
    private apiService: ClamAPIService,
    private messageService: MessageService,
    private apiService2:ApiService,
    public loader:LoaderserviceService
  ) {}

  ngOnInit(): void {
    console.log(this.toDate)
  }

  /**
   * get trainee leave details
   * @property {*} removeHiddenLeave
   * @param {*} plantCode
   */
 getLeaveEligibility(plantCode: any) {
    this.apiService.get_leave_elgibility(plantCode).subscribe({
      next: (res: any) => {
        this.traineeLeaveEligibility = this.removeHiddenLeave(res);
        console.log("TRAINEE LEAVE DETAILS", this.traineeLeaveEligibility);
      },
      error: (error) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error?.message });
      },
    });
  }
  /**
   * remove hidden leave
   * remove leave element based on tha sap code
   * @param leaveArray
   */
  removeHiddenLeave(leaveArray: any) {
    const esiSapCode: string = "1070";
    const advanceSapCode: string = "1005";
    if (this.hideAdvanceLeave && this.hideEsiLeave) {
      return leaveArray.filter(
        (leave: any) =>
          leave.SAP_code !== esiSapCode && leave.SAP_code !== advanceSapCode
      );
    } else {
      return leaveArray;
    }
  }

  /**
   * formatting leave data default set null
   */
  formatLeaveData() {
    this.fromDate = null;
    this.toDate = null;
    this.leaveReason = null;
    this.firstHalf = null;
    this.secondHalf = null;
    this.first = false;
    this.second = false;
  }

  /**
   * calculate leave duration based on the from & to Date
   * @property {*} fromDate
   * @property {*} toDate
   * @property {*} selectedLeaveType
   * @property {*} halfCheck
   * @property {*} duration
   *
   */
  calculateLeaveDuration() {
    let duration = 0; // default duration
    let userSelectedLeave = this.selectedLeaveType;
    console.log("SELECTED LEAVE:", userSelectedLeave);
    if (this.fromDate > this.toDate) {
      this.messageService.add({
        severity: "warn",
        summary: "From Date must be less than To Date",
      });
    } else {
      if (this.fromDate && !this.toDate) {
        this.toDate = this.fromDate;
        this.halfCheck = false;
      }
      if (this.fromDate === this.toDate) {
        let fromDateObj = new Date(this.fromDate);
        let toDateObj = new Date(this.toDate);
        console.log("same date= ", this.fromDate, this.toDate);
        let timeDiff = toDateObj.getTime() - fromDateObj.getTime();
        duration = timeDiff / (1000 * 3600 * 24) + 1;
        duration =
          this.firstHalf || this.secondHalf ? duration - 0.5 : duration;

        console.log("TIME DIFF", timeDiff / (1000 * 3600 * 24) + 1);
        console.log("DURATION:", duration);
        this.duration = duration;
        // duration += (timeDiff / (1000 * 3600 * 24)) ;
      } else if (this.fromDate !== this.toDate) {
        let fromDateObj = new Date(this.fromDate);
        let toDateObj = new Date(this.toDate);
        console.log("different date= ", this.fromDate, this.toDate);
        const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
        duration += timeDiff === 0 ? 1 : timeDiff / (1000 * 3600 * 24) + 1;
        duration =
          this.firstHalf || this.secondHalf ? duration - 0.5 : duration;

        // duration += timeDiff === 0 ? 1 : (timeDiff / (1000 * 3600 * 24)) + 1;
        console.log("duration", duration);
        /** set calculated duration */
        this.duration = duration;
        if (
          userSelectedLeave?.Max > 0 &&
          (duration > userSelectedLeave?.Max ||
            duration < userSelectedLeave?.Min)
        ) {
          this.messageService.add({
            severity: "warn",
            summary: `${userSelectedLeave?.Leave_Type} can be applied for Min ${userSelectedLeave?.Min} days and Max ${userSelectedLeave?.Max} days`,
          });

          // this.openAlertDialog(`${userSelectedLeave?.Leave_Type} can be applied for Min ${userSelectedLeave?.Min} days and Max ${userSelectedLeave?.Max} days`, 'error');
          return;
        }
      }
    }
  }
  /**
   * check leave reason
   * @property {*} leaveReason
   */
  checkLeaveReason() {
    if (!this.leaveReason || this.leaveReason.trim() === "") {
      // this.openAlertDialog("Reason cannot be empty", 'error');
      this.messageService.add({
        severity: "warn",
        summary: "Reason cannot be Empty!",
      });
      this.isBtnDisabled = true;
    } else {
      this.isBtnDisabled = false;
    }
  }

  /**
   * get trainee leave balance
   * @param traineeAplnNo
   * @property {*} traineeLeaveBalance
   */
  getTraineeleaveBalance(traineeAplnNo: any) {
    this.apiService.get_leave_blnc(traineeAplnNo).subscribe({
      next: (res: any) => {
        // Check if res is not null or undefined before assigning to traineeLeaveBalance
        this.traineeLeaveBalance = res || {};
        console.log("TRAINEE LEAVE BALANCE:", this.traineeLeaveBalance);
      },
      error: (error) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error?.message });
      },
    });
  }

  /**
   * apply trainee leave
   * @property {*} fromDate
   * @property {*} toDate
   * @property {*} selectedLeaveType
   * @property {*} halfCheck
   * @property {*} duration
   * @property {*} leaveReason
   * @property {*} loggedInUserID
   */
  applyTraineeLeave() {
    let userSelectedLeave = this.selectedLeaveType;
    if (!this.selectedLeaveType) {
      // this.openAlertDialog("Please select Leave Type", "error");
      this.messageService.add({severity:'warn',summary:'Please select Leave Type'});
      return;
    } else if (!this.fromDate || this.fromDate === "") {
      this.messageService.add({severity:'warn',summary:'Please select the  from date'});
      // this.openAlertDialog("Please select the  from date", "error");
      return;
    } else if (!this.toDate || this.toDate === "") {
      this.messageService.add({severity:'warn',summary:'Please select the To date'});
      // this.openAlertDialog("Please select the To date", "error");
      return;
    } else if (this.fromDate > this.toDate) {
      this.messageService.add({severity:'warn',summary:'From Date must be less than To Date'});
      // this.openAlertDialog("From Date must be less than To Date", "error");
      return;
    } else if (!this.leaveReason || this.leaveReason.trim() === "") {
      this.messageService.add({severity:'warn',summary:'Reason cannot be empty'});
      // this.openAlertDialog("Reason cannot be empty", "error");
      return;
    }else if (
      userSelectedLeave.Max > 0 &&
      (this.duration > userSelectedLeave.Max || this.duration < userSelectedLeave.Min)
    ) {
      this.messageService.add({severity:'warn',summary:`${userSelectedLeave.Leave_Type} can be applied for Min ${userSelectedLeave.Min} days and Max ${userSelectedLeave.Max} days`});

      // this.openAlertDialog(
      //   `${userSelectedLeave.Leave_Type} can be applied for Min ${userSelectedLeave.Min} days and Max ${userSelectedLeave.Max} days`,
      //   "error"
      // );
      return;
    } else {
      const data = {
        Empcode: this.traineeData[0]?.apln_slno,
        plant: this.userPlant,
        reason: this.leaveReason,
        fromdate: moment(this.fromDate).format("YYYY-MM-DD"),
        todate: moment(this.toDate).format("YYYY-MM-DD"),
        first_half: this.firstHalf,
        second_half: this.secondHalf,
        duartion: this.duration,
        leave_type: this.selectedLeaveType,
        gen_id: this.traineeData[0]?.gen_id,
        approver1: this.loggedInUserID,
        approver2: this.loggedInUserID,
      };
      console.log("LEAVE DATA:", data);
      /** apply trainee leave by hr */
      this.apiService.applyTraineeLeaveByHR(data).subscribe({
        next: (response:any) => {
          this.messageService.add({severity:'info',summary:response})
          /** format and get trainee leave balance , eligibility */
          this.formatLeaveData();
          this.getTraineeleaveBalance(this.traineeData[0]?.apln_slno);
          this.getLeaveEligibility(this.traineeData[0]?.plant_code);
        },
        error: (error) => {
          console.error('ERROR:',error)
          this.messageService.add({severity:'error',summary:error?.error})
        }
      })
    }

    /**
     * search trainee by genID
     * @property {*} traineeData
     * @property {*} showLeaveDetails
     */
   


  }
  
  /** 
   * search trainee by gen id
   * get trainee leave balance and eligibility
   * @property {*} traineeData
   * @property {*} showLeaveDetails
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
          this.showLeaveDetails = true;
          console.log(response);
          /** trainee leave balance and eligibility api call */
          this.getTraineeleaveBalance(this.traineeData[0].apln_slno);
          this.getLeaveEligibility(this.traineeData[0].plant_code)
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

  /** handle checkbox toggle */
   toggleCheckbox(checkbox: string) {
      if (checkbox === 'first') {
        // this.first = !this.first;
        // this.second = !this.first;

        this.secondHalf = null; // Disable second when first is selected
      } else if (checkbox === 'second') {
        // this.second = !this.second;
        // this.first = !this.second;
        this.firstHalf = null; // Disable firstHalf when secondHalf is selected
      }
  
      // this.updateDuration();
    }

  /** clear all record */
  clearData(){
    console.log('record cleared....');
    this.formatLeaveData();
    this.traineeData = null;
    this.traineeLeaveBalance = null;
    this.traineeLeaveEligibility = null;
    this.showLeaveDetails = false;
  }
}
