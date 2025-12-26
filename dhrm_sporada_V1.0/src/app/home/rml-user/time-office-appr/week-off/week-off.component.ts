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
  data:any[]=[];
  weekOfData:any = [];
  weekDates:any;
  lockDate:any;
  today:any;
  cat:any='T';
  loading:any=false;
  genIdInput:any;
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
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getDeptByPlant();
    this.getLockDate();
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
  /** get week days */
  getDates(){
    this.apiService.getWeekdates(moment(this.date).format('YYYY-MM-DD')).subscribe((response: any) => {
      // console.log('response,response',response)
      if(response.status='success'){
        this.weekDates = response.data;
      }else{
        // alert(response.message);
        this.messageService.add({severity:'warn',summary:response.message})
      }
      
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  getLine(){
    if(this.selectedDept==''){
      this.lineList=[]
      this.slectedLine=''
    }else{
      this.apiService.getlineBydeptslno(this.selectedDept).subscribe((response: any) => {
         if(response?.message == 'failure' || response?.message == 'failed'){
          this.messageService.add({severity:'warn',summary:'Error Occured!'});
        }
        this.lineList = response;
      }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    });

    }
  }

  getData(){
    /** get week days */
    this.getDates();
    /** get trainee week off data */
    this.data=[]
    this.apiService.getWeekoffData(moment(this.date).format('YYYY-MM-DD'),this.slectedLine)
    .subscribe((response:any) => {
      let data;
      if(response.status='success'){
        data = response.data.map((element:any) => {
          // five days default sunday + saturday mapping
          if(element?.active_status == 'Y' && element.week_off_day[0]?.week_off_day == 7 && element?.week_off_day.length == 1){
            const weekOfArrray = element?.week_off_day.map((data:any) => {
            return data?.week_off_day?.toString();
          });
          // default select for saturday and sunday if six day mapping
          weekOfArrray.unshift('6');
            return {...element,week_off_day_arr:weekOfArrray}
          }else{
            // constructing the respose data for mat multiselect
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
      }else{
        // alert(response.message)
        this.messageService.add({severity:'warn',summary:response.message})
      }
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    })
  }

  getLockDate(){
    console.log(this.cat)
    this.apiService.getlockdateByCategory(this.cat).subscribe((res:any)=>{
      // this.lockDate=res.date.split('T')[0]
      this.lockDate = new Date(res.date);
      // console.log(this.lockDate)
      this.today = new Date(moment(this.lockDate,'yyyy-MM-DD').add(5,'weeks').format('yyyy-MM-DD'))
      console.log(moment(this.lockDate,'yyyy-MM-DD').add(5,'weeks').format('yyyy-MM-DD'));
      console.log('Today:', this.today)
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    })
  }

  getdatebyno(number:any){
// console.log('number',number);
  // console.log(number)
    let date = this.weekDates.filter((element:any)=>{
       return element.day == +number
    })
    // console.log(date[0].date);
    // console.log(date)
    
    return date[0].date
  }

onWeekOffChange(item: any, dayValue:any): void {
  // getting fivedays mapping status of the trainee
  const fiveDaysMapping = item.active_status;
  const selected = item.week_off_day_arr || [];
  console.log('Day Value', dayValue)
  console.log(selected);
  /** 2 days week off mapping */
  if (selected.length > 2 && fiveDaysMapping == 'Y') {
    // Remove the last selected value
    // selected.pop();
    selected.shift() // remove the first element
    item.week_off_day_arr = [...selected];
    console.log(item.week_off_day);
    /** finding changed week of id */
    const weekOfIdArr = item.week_off_day.map((weekoff:any) => {
      return weekoff.trn_woff_id
    });
    console.log('ID ARR',weekOfIdArr)
    const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
    console.log('Changed Week Off Five Days:',changedWeekOff);
    this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, weekOfIdArr);
    // this.messageService.add({severity:'warn',summary:'You can select only 2 days as week off.'});
  } 
  /** 1 day week off mapping */
  else if(selected.length > 1 && (!fiveDaysMapping || fiveDaysMapping == 'N')){
    // Remove the last selected value
    // selected.pop();
    selected.shift() // remove the first element
    item.week_off_day_arr = [...selected];
    console.log(item.week_off_day);
    /** finding changed week of id */
    const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
    console.log('Changed Week Off six Days',changedWeekOff);
    this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, changedWeekOff.trn_woff_id);
    // this.messageService.add({severity:'warn',summary:'You can select only 1 day as week off.'});
  }
  /** update week off if user selected two days for 2 days week offs */
  else if(selected.length == 2 && item.already_applied == 1){
    /** finding changed week of id */
    const weekOfIdArr = item.week_off_day.map((weekoff:any) => {
      return weekoff.trn_woff_id
    });
    console.log('ID ARR',weekOfIdArr);
    this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, weekOfIdArr);
  }
  /** if user change week off date it will update */

  // else{
  //   console.log('else block',item.week_off_day);
  //   const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
  //   console.log("else block week of",changedWeekOff);
  //   console.log('week of day arr',item.week_off_day_arr)
  //   this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, changedWeekOff.trn_woff_id);
  // }
}

  // check if the selected day is absent
  checkIfAbsent(item:any,emp_id:any,day:any, weekOffID:any){
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
      }else if(date < this.lockDate){
        // alert(`Selected day is previous payroll period`)
        this.messageService.add({severity:'info',summary:`Selected day is previous payroll period`})
        this.data.forEach((element:any)=>{
          if(element.apln_slno==emp_id){
            element.week_off_day_arr = ['7']
          }
        })
      }
      else{
        if(response.is_valid.status){
          // alert(response.is_valid.message)
          this.messageService.add({severity:'warn',summary:response.is_valid.message})
          this.data.forEach((element:any)=>{
          if(element.apln_slno==emp_id){
            element.week_off_day_arr= ['7']
          }
        })
        }
        /** checking if the selected date is absent for second week off update */ 
        if(!response.is_valid.status){
          /** checking if week of is already applied */
          if(item.already_applied == 1){
          // /** update only if changes day value , day value is in arr[1] for 2 week offs */
          // if(fiveDaysMapping == 'Y' && index == 1){
          //    const updateData = {
          //     emp_id: item.apln_slno,
          //     week_of_date:date,
          //     trn_woff_id: weekOffID
          //   }
          //  /** second week of update api */
          //   this.changealreadyUpdatedWeekOff(updateData);
          //   console.log('updatedData',updateData)
          //  }
          // /** here updating changed value is in index 0 for one week off */
          //  else if((!fiveDaysMapping || fiveDaysMapping == 'N') && index == 0){
          //     const updateData = {
          //       emp_id: item.apln_slno,
          //       week_of_date:date,
          //       trn_woff_id: weekOffID
          //     }
          //   /** second week of update api */
          //     this.changealreadyUpdatedWeekOff(updateData);
          //     console.log('updatedData',updateData)
          //   }
          /** updating week if weekOffID is array */
           if(Array.isArray(weekOffID)){
             const updateData = {
                emp_id: item.apln_slno,
                week_of_date:date,
                trn_woff_id: weekOffID[index]
              }
            /** second week of update api */
              this.changealreadyUpdatedWeekOff(updateData);
              console.log('updatedData',updateData);
           }else{
            const updateData = {
                emp_id: item.apln_slno,
                week_of_date:date,
                trn_woff_id: weekOffID
              }
            /** second week of update api */
              this.changealreadyUpdatedWeekOff(updateData);
              console.log('updatedData',updateData);
           }
          }
        }
      }
    }, (error) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error.message})
    })
    })
  }
  
  // update already changed weekoff
  changealreadyUpdatedWeekOff(data:any){
    this.apiService.changeAlreadyUpdatedEmployeeWeekOff(data).subscribe({
      next: (response:any) => {
         console.log(response)
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
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }
  updateData(){
    this.loading=true
    let changeData=this.data.filter((element:any)=>{
      return element.week_off_day!='7' && element.already_applied != 7
    })
    console.log(changeData)
    if(changeData.length==0){
      // alert('None of the data is changed');
      this.messageService.add({severity:'warn',summary:'None of the data is changed'})
      return
    }
   let updatedDate = changeData.map((element:any)=>{
    // console.log('element',element);
    let weekOfDayArr:any[] = [];
    element.week_off_day_arr.forEach((day:any) => {
      const weekOfDay = this.getdatebyno(day);
      weekOfDayArr.push(weekOfDay);
    })
    return {...element,week_off_day:weekOfDayArr,sunday:this.getdatebyno('7')}
   })

   let data={
    data:updatedDate,
    updatedBy:sessionStorage.getItem('user_name'),
    plant:sessionStorage.getItem('plantcode')
   }

    console.log('data',data);
   
   
   this.apiService.updateWeekOff(data).subscribe((response:any)=>{
      
      if(response.status='success'){
        // alert(response.message)
        this.messageService.add({severity:'info',summary:response.message})
        this.getData()
        this.loading=false
      }else{
        // alert(response.message)
        this.messageService.add({severity:'info',summary:response.message})
        this.getData()
        this.loading=false
      }
   }, (error) => {
    console.error('ERROR:',error);
    this.messageService.add({severity:'error',summary:error.message})
   })
  }
  
  /** 
   * check already applied week off
   * @property {*} data --> weekoffData
   * if some of data.already-applied = 1 TRUE else FALSE
   * */
  checkAlreadyApplied() {
    console.log('ALREADY APPLIED:',this.data.some((weekoffData:any) => weekoffData.already_applied == 1))
    return this.weekOfData.some((weekoffData:any) => weekoffData.already_applied == 1);
  }

  searchByGenId(){
    const result = this.weekOfData.filter((weekofData:any) => weekofData.gen_id == this.genIdInput);
    if(result.length){
      this.data = result;
    }else{
      this.data = this.weekOfData;
    }
  }
}
