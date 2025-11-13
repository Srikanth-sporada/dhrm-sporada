import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/home/api.service";
import moment from 'moment'
import { elementAt } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-week-off',
  templateUrl: './week-off.component.html',
  styleUrls: ['./week-off.component.css']
})
export class WeekOffComponent implements OnInit {
  date:any='';
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
  constructor(private apiService: ApiService, private messageService:MessageService) { }

  ngOnInit() {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.apiService.getDeptByPlant().subscribe((data: any) => {
      this.departmentList = data;
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });
    this.getLockDate();
  }

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
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });
  }

  getLine(){
   
    if(this.selectedDept==''){
      this.lineList=[]
      this.slectedLine=''
    }else{
      this.apiService.getlineBydeptslno(this.selectedDept).subscribe((response: any) => {
        this.lineList = response;
      }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    });

    }
  }

  getData(){
    this.data=[]
    this.apiService.getWeekoffData(moment(this.date).format('YYYY-MM-DD'),this.slectedLine).subscribe((response:any)=>{
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
      console.log(error);
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
      console.log(error);
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
  console.log(selected)
  if (selected.length > 2 && fiveDaysMapping == 'Y') {
    // Remove the last selected value
    // selected.pop();
    selected.shift() // remove the first element
    item.week_off_day_arr = [...selected];
    // alert('You can select only 2 days as week off.');
    console.log(item.week_off_day);
    const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
    console.log('Changed Week Off Five Days:',changedWeekOff);
    this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, changedWeekOff.trn_woff_id);

    // this.messageService.add({severity:'warn',summary:'You can select only 2 days as week off.'});
  } else if(selected.length > 1 && (!fiveDaysMapping || fiveDaysMapping == 'N')){
    // Remove the last selected value
    // selected.pop();
    selected.shift() // remove the first element
    item.week_off_day_arr = [...selected];
    // alert('You can select only 2 days as week off.');
    console.log(item.week_off_day);
    const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
    console.log('Changed Week Off six Days',changedWeekOff);
    this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, changedWeekOff.trn_woff_id);

    // this.messageService.add({severity:'warn',summary:'You can select only 1 day as week off.'});
  }
  else{
    console.log(item.week_off_day);
    const changedWeekOff = item.week_off_day?.find((data:any) => data.week_off_day !== dayValue)
    console.log(changedWeekOff);
    this.checkIfAbsent(item,item.apln_slno, item.week_off_day_arr, changedWeekOff.trn_woff_id);
  }
}

  // check if the selected day is absent
  checkIfAbsent(item:any,emp_id:any,day:any, weekOffID:any){
    console.log(weekOffID)
    // looping the selected day to check if absent
    day.forEach((day:any) => {
    let date = this.getdatebyno(day);
    let sunday = this.getdatebyno(7);
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

        /** checking if the selected date is absent */ 
        if(!response.is_valid.status){
          /** checking if week of is already applied */
          if(item.already_applied == 1){
            /** checking select week day */
            const updateData = {
              emp_id: item.apln_slno,
              week_of_date:date,
              trn_woff_id: weekOffID
            }
          /** second week of update api */
            this.changealreadyUpdatedWeekOff(updateData);
            console.log('updatedData',updateData)
          }
        }
      }
    }, (error) => {
      console.log(error);
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
          this.messageService.add({severity:'info',summary:response.message});
          // api call for refresh the data
          this.getData()
         }else{
          this.messageService.add({severity:'warn',summary:response.message})
         }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  updateData(){
    this.loading=true
    let changeData=this.data.filter((element:any)=>{
      return element.week_off_day!='7' && element.already_applied!=7
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
    console.log(error);
    this.messageService.add({severity:'error',summary:error.message})
   })
  }
  
  /** check already applied week off */
  checkAlreadyApplied() {
    return this.data.some((weekoffData:any) => weekoffData.already_applied == 1);
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
