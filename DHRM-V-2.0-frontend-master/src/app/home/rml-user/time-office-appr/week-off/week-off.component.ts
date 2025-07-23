import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/home/api.service";
import * as moment from 'moment'
import { elementAt } from 'rxjs/operators';

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

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getDeptByPlant().subscribe((data: any) => {
      this.departmentList = data;
    });
    this.getLockDate()
 
  }

  getDates(){
    this.apiService.getWeekdates(this.date).subscribe((response: any) => {
      // console.log('response,response',response)
      if(response.status='success'){

        this.weekDates = response.data;
      }else{
        alert(response.message)
      }
      
    });
  }

  getLine(){
   
    if(this.selectedDept==''){
      this.lineList=[]
      this.slectedLine=''
    }else{
      this.apiService.getlineBydeptslno(this.selectedDept).subscribe((response: any) => {
        this.lineList = response;
      });

    }
  }

  getData(){
    this.data=[]
    this.apiService.getWeekoffData(this.date,this.slectedLine).subscribe((response:any)=>{
      let data
      if(response.status='success'){
        data= response.data.map((element:any) => {
          return {...element,week_off_day:element.week_off_day.toString()}
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
        alert(response.message)
      }
    })
  }

  getLockDate(){
    console.log(this.cat)
    this.apiService.getlockdateByCategory(this.cat).subscribe((res:any)=>{
      this.lockDate=res.date.split('T')[0]
      // console.log(this.lockDate)
      this.today =moment(this.lockDate,'yyyy-MM-DD').add(5,'weeks').format('yyyy-MM-DD')
      console.log(moment(this.lockDate,'yyyy-MM-DD').add(5,'weeks').format('yyyy-MM-DD'))
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
  checkIfAbsent(emp_id:any,day:any){
    let date=this.getdatebyno(day)
    let sunday=this.getdatebyno(7)
    this.apiService.checkIfAbsent(emp_id,date,sunday).subscribe((response:any)=>{
      // console.log(response)
      if(response.status=='failed'){
        return alert(response.message)
      }else if(date<this.lockDate){
        alert(`Selected day is previous payroll period`)
        this.data.forEach((element:any)=>{
          if(element.apln_slno==emp_id){
            element.week_off_day='7'
          }
        })
      }
      else{
        if(response.is_valid.status){
          alert(response.is_valid.message)
        this.data.forEach((element:any)=>{
          if(element.apln_slno==emp_id){
            element.week_off_day='7'
          }
        })
        }
      }
    })
    

  }

  updateData(){
    this.loading=true
    let changeData=this.data.filter((element:any)=>{
      return element.week_off_day!='7' && element.already_applied!=7
    })

    if(changeData.length==0){
      alert('None of the data is changed')
      return
    }
   let updatedDate = changeData.map((element:any)=>{
    // console.log('element',element);
    return {...element,week_off_day:this.getdatebyno(element.week_off_day),sunday:this.getdatebyno('7')}
   })

   let data={
    data:updatedDate,
    updatedBy:sessionStorage.getItem('user_name'),
    plant:sessionStorage.getItem('plantcode')
   }

    console.log('data',data);
   
   
   this.apiService.updateWeekOff(data).subscribe((response:any)=>{
      
      if(response.status='success'){
        alert(response.message)
        this.getData()
        this.loading=false
      }else{
        alert(response.message)
        this.getData()
        this.loading=false
      }
   })
  }
  
}
