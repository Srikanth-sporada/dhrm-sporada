import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/home/api.service";
import moment from 'moment'
import { MessageService } from 'primeng/api';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { Utility } from 'src/app/utils/utils';
@Component({
  selector: 'app-week-off',
  templateUrl: './week-off.component.html',
  styleUrls: ['./week-off.component.css']
})
export class WeekOffComponent implements OnInit {
  date:any = new Date();
  departmentList:any[];
  selectedDept:any="";
  lineList:any[];
  slectedLine:any="";
  data:any[] = [];
  weekOfData:any = [];
  weekDates:any;
  lockDate:any;
  today:any;
  cat:any='T';
  loading:any=false;
  genIdInput:any;
  isCorrectDate:boolean;
  endOfWeek:string = '';
  payrollArea:any = [];
  selectedPayrollArea:any;
  roles = [
  { value: 'T', label: 'Trainee/CL' },
  { value: 'O', label: 'Operator' }
];

  all:any;
  userDetails:any;
  constructor(
    private apiService: ApiService, 
    private messageService:MessageService,
    public loader:LoaderserviceService,
    public utils:Utility,
  ) { }

  ngOnInit() {
    /** loggen in user data */
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name;
      /** set logged in user dept & line */
      this.selectedDept = Number(this.all.Department);
      this.slectedLine = String(this.all.line_code);
      console.log(this.selectedDept, this.slectedLine);
    }
    /** get dept by plant */
    this.getDeptByPlant();
    /** get line */
    this.getLine();
    /** get payroll area by plantcode */
    this.getPayrollArea(this.all.plant_code)
    // this.date < this.today ? this.getData() : "";

  }

  /** get payroll area by plant */
  getPayrollArea(plantCode:any){
    this.apiService.getPayrollAreaByPlantcode(plantCode).subscribe({
      next: (response) => {
        this.payrollArea = response;
        /** set first record for selected payrollArea */
        this.selectedPayrollArea = this.payrollArea[0]?.PayrollArea;
        /** get lock date by payroll area */
        this.getLockDate();
      },
      error:(error:any) => {
        console.log('GET PAYROLL AREA API ERROR:');
        this.messageService.add({severity:'error',summary:error?.error?.message});
      }
    })
  }
  /** get department by plant */
  getDeptByPlant(){
     this.apiService.getDeptByPlant().subscribe((data: any) => {
      if(data?.message == 'failure' || data?.message == 'failed'){
        this.messageService.add({severity:'warn',summary:'Error Occured!'});
      }
      this.departmentList = data;
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }
  
  /** 
   * get week days
   * @method getWeekOffData()
   * @method getdatebyno()
   *  */
  getDates(){
    this.apiService.getWeekdates(moment(this.date).format('YYYY-MM-DD')).subscribe({
      next: (response: any) => {
      // console.log('response,response',response)
      if(response.status='success'){
        this.weekDates = response.data;
        /** set endOfWeek */
        this.endOfWeek = this.getdatebyno('7');
        /** weekoffData API  */
        this.getWeekOffData()
      }else{
        // alert(response.message);
        this.messageService.add({severity:'warn',summary:response.message})
      }
      
    }, 
    error: (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    }
    });
  }

  /** get line by dept */
  getLine(){
      this.apiService.getlineBydeptslno(this.selectedDept).subscribe({
        next: (response: any) => {
         if(response?.message == 'failure' || response?.message == 'failed'){
          this.messageService.add({severity:'warn',summary:'Error Occured!'});
        }
        this.lineList = response;
      }, 
      error: (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    }
      });
  }

  /**
   * get week of data 
   * @property {*} data
   * @property {*} isCorrectDate
   * @property {*} weekOfData
   * @method getDates()
   */
  getData(){
  //  if(this.isCorrectDate){
     /** get week days & get week off data*/
    this.getDates();
    /** get trainee week off data */
    this.data = [];
  }

  /** 
   * get week off data by sunday,line,date
   * @param date
   * @param line
   * @param sunday // endOfweek
   * @property {*} weekOfData 
   */
  getWeekOffData(){
    console.log('LINE', this.slectedLine);
    this.apiService
    .getWeekoffData(moment(this.date).format('YYYY-MM-DD'),this.slectedLine,this.endOfWeek)
    .subscribe({
      next:(response:any) => {
      let data;
      if(response.status == 'success'){
        data = response.data.map((element:any) => {
          // five days default sunday + saturday mapping
          if(element?.active_status == 'Y' && element.week_off_day[0]?.week_off_day == 7 && element?.week_off_day.length == 1){
            const weekOfArrray = element?.week_off_day.map((data:any) => {
            return data?.week_off_day?.toString();
          });
          /** default select for saturday and sunday if six day mapping */
          weekOfArrray.unshift('6');
            return {...element,week_off_day_arr:weekOfArrray}
          }else{
            /** constructing API response data for mat multi select */
            return {...element,week_off_day_arr:element?.week_off_day.map((data:any) => {
            return data?.week_off_day.toString();
          })}
          }
      })
        if(this.cat=='T'){
          data=data.filter((element:any)=>{
          return element.apprentice_type!='OPERATOR'
        })
        }else{
          data=data.filter((element:any)=>{
            return element.apprentice_type=='OPERATOR'
          })
        }
        console.log('Week Of Data',data)
        this.data = data;
        /** copy of week of data */
        this.weekOfData = data;
      }
      else{
        this.messageService.add({severity:'warn',summary:response.message})
      }
    }, 
    error: (error) => {
      console.error('GET WEEK OFF DATA API ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    }
    })
  }

  /**
   * get lockdate by category and check current date is correct
   * @property {*} lockDate
   * @property {*} today // actual lock date
   * @property {*} isCorrectDate 
   */
  getLockDate(){
    console.log(this.cat)
    this.apiService.getLastProcesedBill(this.all.plant_code,this.cat,'',this.selectedPayrollArea).subscribe({
      next: (res:any) => {
      if(res.date){
        this.lockDate = new Date(res.date);
        /** set default date to lock date */
        // this.date = this.lockDate;
      /** add lockdate + 5 weeks */
      this.today = new Date(moment(this.lockDate,'yyyy-MM-DD').add(1,'month').format('yyyy-MM-DD'))
      console.log(moment(this.lockDate,'yyyy-MM-DD').add(5,'weeks').format('yyyy-MM-DD'));
      console.log('Today:', this.today)
      /** check current date is correct  & get week off data */
      this.date > this.lockDate  ? this.getData() : this.messageService.add({severity:'warn',summary:'Incorrect Date!'});
      console.log('DATE:',this.date > this.lockDate)
      }
    }, 
    error: (error) => {
      console.error('GET LAST PROCESSED BILL API ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    }
    })
  }

  /**
   *  get date by number
   * @param number
   *  */
  getdatebyno(number:any){
    console.log('get date by number fun param:',number)
    let date = this.weekDates.filter((element:any)=>{
       return element.day == +number
    })
    // console.log(date[0].date);
    console.log('get date by number fn return data:',date)
    return date[0].date;
  }

  /** 
   * handle week off change based on five days mapping
   * @param item
   * @param dayValue event
   * @method checkIfAbsent()
   */
  onWeekOffChange(item: any, dayValue:any,itemIndex:any): void {
    // getting fivedays mapping status of the trainee
    const fiveDaysMapping = item.active_status;
    const selected = item.week_off_day_arr || [];
    console.log('Day Value', dayValue)
    console.log(selected);
    /** 2 days week off mapping */
    if (selected.length > 2 && fiveDaysMapping == 'Y') {
      /** remove the first element */
      selected.shift();
      item.week_off_day_arr = [...selected];
      console.log(item.week_off_day);
      /** finding changed week of id */
      const weekOfIdArr = item.week_off_day.map((weekoff:any) => {
        return weekoff.trn_woff_id
      });
      console.log('ID ARR',weekOfIdArr);
      const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
      console.log('Changed Week Off Five Days:',changedWeekOff);
      this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, weekOfIdArr, itemIndex);
    } 
    /** 1 day week off mapping */
    else if(selected.length > 1 && (!fiveDaysMapping || fiveDaysMapping == 'N')){
      /** remove the first element */
      selected.shift(); 
      item.week_off_day_arr = [...selected];
      console.log(item.week_off_day);
      /** finding changed week of id */
      const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
      console.log('Changed Week Off six Days',changedWeekOff);
      this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, changedWeekOff.trn_woff_id,itemIndex);
    }
    /** update week off if user selected two days for 2 days week offs */
    else if(selected.length == 2 && item.already_applied == 1){
      /** finding changed week of id */
      const weekOfIdArr = item.week_off_day.map((weekoff:any) => {
        return weekoff.trn_woff_id
      });
      console.log('ID ARR',weekOfIdArr);
      this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, weekOfIdArr,itemIndex);
    }
  }

  /** 
   * check if the selected day is absent
   * @param item
   * @param emp_id
   * @param day //week_off_day_arr
   * @param weekOffID
   * @param itemIndex
   * @method changealreadyUpdatedWeekOff()
   */
  checkIfAbsent(item:any,emp_id:any,day:any, weekOffID:any, itemIndex:any){
    console.log(weekOffID);
    const fiveDaysMapping = item?.active_status;
    /** looping selected day array to check present or not */
    day.forEach((day:any, index:any) => {
    let date = this.getdatebyno(day);
    let sunday = this.getdatebyno(7);
    /** checking if the selected day absent */
    this.apiService.checkIfAbsent(emp_id,date,sunday).subscribe((response:any)=>{
      // console.log(response)
      if(response.status=='failed'){
        // alert(response.message);
        this.messageService.add({severity:'warn',summary:response.message})
        return ;
      }
      else if(date < this.lockDate){
        // alert(`Selected day is previous payroll period`)
        this.messageService.add({severity:'info',summary:`Selected day is previous payroll period`});
         /** set actual w-off */
        item.week_off_day_arr = item?.week_off_day.map((data:any) => {return data?.week_off_day.toString()});
        // this.data.forEach((element:any)=>{
        //   if(element.apln_slno==emp_id){
        //     element.week_off_day_arr = ['7']
        //   }
        // })
      }
      else{
        /** if trainee is absent on selected date */
        if(response.is_valid.status){
          // alert(response.is_valid.message)
          this.messageService.add({severity:'warn',summary:response.is_valid.message});
          /** set actual w-off */
          item.week_off_day_arr = item?.week_off_day.map((data:any) => {return data?.week_off_day.toString()});
        }
        /** checking if the selected date is absent for second week off update */ 
        if(!response.is_valid.status){
          /** checking if week off is already applied */
          if(item.already_applied == 1){
          /** updating week if weekOffID is array */
           if(Array.isArray(weekOffID)){
             const updateData = {
                emp_id: item.apln_slno,
                week_of_date:date,
                trn_woff_id: weekOffID[index],
                startOfWeek: this.getdatebyno('1'), // get week monday date
                endOfWeek: this.getdatebyno('7') // get week sunday date
              }
            /** second week of update api */
              this.changealreadyUpdatedWeekOff(updateData);
              console.log('Five days w-off updated Data',updateData);
           }
          /** for single second w-off update data */
           else{
            const updateData = {
                emp_id: item.apln_slno,
                week_of_date:date,
                trn_woff_id: weekOffID,
                startOfWeek: this.getdatebyno('1'), // get week monday date
                endOfWeek: this.getdatebyno('7') // get week sunday date
              }
            /** second week of update api */
              this.changealreadyUpdatedWeekOff(updateData);
              console.log('Single w-off updated Data',updateData);
           }
          }
        }
      }
    }, (error) => {
      console.error('CHECK TRAINEE ABSENT API ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    })
    })
  }
  
  /** 
   * update already updated week off single update
   * @param data
   *  */
  changealreadyUpdatedWeekOff(data:any){
    this.apiService.changeAlreadyUpdatedEmployeeWeekOff(data).subscribe({
      next: (response:any) => {
         console.log(response);
         if(response.status == 'success'){
          this.messageService.add({key:'toast',severity:'info',summary:response.message});
          this.messageService.clear('toast');
          // api call for refresh the data
          this.getData();
         }else{
          this.messageService.add({severity:'warn',summary:response.message})
         }
      },
      error: (error) => {
        console.error('CHANGEALREADYUPDATED WOFF API ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }

  /**
   * bulk update week off
   * @method getdatebyno()
   */
  updateData(){
    this.loading=true
    let changeData = this.data.filter((element:any)=>{
      return element.week_off_day != '7' && element.already_applied != 7
    })
    console.log(changeData)
    if(changeData.length==0){
      // alert('None of the data is changed');
      this.messageService.add({severity:'warn',summary:'None of the data is changed'})
      return;
    }
   let updatedDate = changeData.map((element:any)=>{
    // console.log('element',element);
    let weekOfDayArr:any[] = [];
    /** find week date by day */
    element.week_off_day_arr.forEach((day:any) => {
      const weekOfDay = this.getdatebyno(day);
      weekOfDayArr.push(weekOfDay);
    })
    return {
      ...element,
      week_off_day:weekOfDayArr,
      sunday:this.getdatebyno('7'), 
      startOfWeek:this.getdatebyno('1'),
      endOfWeek:this.getdatebyno('7')}
   })

   let data={
    data:updatedDate,
    updatedBy:sessionStorage.getItem('user_name'),
    plant:sessionStorage.getItem('plantcode')
   }

    console.log('data',data);
   
   
   this.apiService.updateWeekOff(data).subscribe({
    next: (response:any)=>{
      
      if(response?.status){
        // alert(response.message)
        this.messageService.add({severity:'info',summary:response.message});
        this.getData();
        this.loading=false;
      }else{
        // alert(response.message)
        this.messageService.add({severity:'info',summary:response.message});
        this.getData();
        this.loading=false;
      }
   }, 
   error: (error) => {
    console.error('UPDATE BULK WOFF API ERROR:',error);
    this.messageService.add({severity:'error',summary:error.message})
   }
   })
  }
  
  /** 
   * check already applied week off
   * @property {*} data --> weekoffData
   * if some of data.already-applied = 1 TRUE else FALSE
   * */
  checkAlreadyApplied() {
    console.log('ALREADY APPLIED:',this.weekOfData.some((weekoffData:any) => weekoffData.already_applied == 1))
    return this.weekOfData.some((weekoffData:any) => weekoffData.already_applied == 1);
  }

  /** search week of data by gen id */
  searchByGenId(){
    const result = this.weekOfData.filter((weekofData:any) => weekofData.gen_id == this.genIdInput);
    if(result.length){
      this.data = result;
    }else{
      this.data = this.weekOfData;
    }
  }

  /** check current date is correct based on lock date 
  checkCorrectDate(){
      this.date < this.today ? this.isCorrectDate = true : this.isCorrectDate = false;
  }
  */

  /**
   * export @property {*} data to excell 
   */
  exportWeekOffData(){
    const exportData = this.data.map((item) => ({
    GENID: item.gen_id,
    NAME: item.fullname,
    CATEGORY: item.apprentice_type,
    WeekOffDate: item.Woff_date
    .map((date: string) => moment(date).format('YYYY-MM-DD'))
    .join(", "), // flatten array
    already_applied: item.already_applied
  }));
  /** export utils function */
  this.utils.jsonToExcellExport(exportData,this.all.plant_code,'WeekOff')
  }

  /** 
   * handle DOL based date selection
   * @param doj trainee doj
   * @param weekOffDay
   *  */
  checkWeekOffDate(doj:any,weekOffDay:any):boolean{
    const traineeDOJ = new Date(doj);
    const weekDate = new Date(this.getdatebyno(weekOffDay));
    /**
     *  find DOJ in user selected week off to handle DOJ based week off date change.
     * 
    */
    if(this.weekDates.find((weekDate:any) => weekDate.date == doj) ){
      // console.log('RETURN', traineeDOJ > weekDate)
      return traineeDOJ > weekDate
    }else{
      return false;
    }
  }
}
