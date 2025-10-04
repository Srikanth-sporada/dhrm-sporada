import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/home/api.service";
import * as moment from 'moment'
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
  weekDates:any;
  lockDate:any;
  today:any;
  cat:any='T';
  loading:any=false;
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
    this.getLockDate()
 
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
      let data
      if(response.status='success'){
        data = response.data.map((element:any) => {
          return {...element,week_off_day:element.week_off_day.map((weekOffday:any) => {
            return weekOffday.toString();
          })}
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
        
        console.log(data)
        this.data=data
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

    let date = this.weekDates.filter((element:any)=>{
       return element.day == +number
    })
    // console.log(date[0].date);
    
    return date[0].date
  }

onWeekOffChange(item: any): void {
  // getting fivedays mapping status of the trainee
  const fiveDaysMapping = item.active_status;
  const selected = item.week_off_day || [];

  if (selected.length > 2 && fiveDaysMapping == 'Y') {
    // Remove the last selected value
    selected.pop();
    item.week_off_day = [...selected];
    // alert('You can select only 2 days as week off.');
    this.messageService.add({severity:'warn',summary:'You can select only 2 days as week off.'})
  } else if(selected.length > 1 && (!fiveDaysMapping || fiveDaysMapping == 'N')){
    // Remove the last selected value
    selected.pop();
    item.week_off_day = [...selected];
    // alert('You can select only 2 days as week off.');
    this.messageService.add({severity:'warn',summary:'You can select only 1 day as week off.'})
  }else{
  this.checkIfAbsent(item,item.apln_slno, item.week_off_day);
    
  }
}
  // check if the selected day is absent
  checkIfAbsent(item:any,emp_id:any,day:any){
    console.log(day);
    console.log("USER DATA", item)
    // looping the selected day to check if absent
    day.forEach((day:any) => {
       let date=this.getdatebyno(day)
    let sunday=this.getdatebyno(7)
    this.apiService.checkIfAbsent(emp_id,date,sunday).subscribe((response:any)=>{
      // console.log(response)
      if(response.status=='failed'){
        // alert(response.message);
        this.messageService.add({severity:'warn',summary:response.message})
        return ;
      }else if(date<this.lockDate){
        // alert(`Selected day is previous payroll period`)
        this.messageService.add({severity:'info',summary:`Selected day is previous payroll period`})
        this.data.forEach((element:any)=>{
          if(element.apln_slno==emp_id){
            element.week_off_day='7'
          }
        })
      }
      else{
        if(response.is_valid.status){
          // alert(response.is_valid.message)
          this.messageService.add({severity:'warn',summary:response.is_valid.message})
        this.data.forEach((element:any)=>{
          if(element.apln_slno==emp_id){
            element.week_off_day='7'
          }
        })
        }
      }
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })
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
    element.week_off_day.forEach((day:any) => {
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
  
}
