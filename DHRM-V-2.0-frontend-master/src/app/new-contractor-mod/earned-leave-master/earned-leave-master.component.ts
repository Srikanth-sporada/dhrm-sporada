import { Component, OnInit,ViewChild  } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {El_Obj} from './earned_leave.model'
import {ClamAPIService} from '../clam-api.service'
import * as moment from 'moment';
import * as XLSX from'xlsx'
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LoaderserviceService} from '../../loaderservice.service'



@Component({
  selector: 'app-earned-leave-master',
  templateUrl: './earned-leave-master.component.html',
  styleUrls: ['./earned-leave-master.component.css'],
  providers: [  DatePipe],
})
export class EarnedLeaveMasterComponent implements OnInit {
  @ViewChild('picker1') picker1: MatDatepicker<Date>;
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];



  el_Obj:El_Obj = new El_Obj()
  plantArr :any
  activeEL:any
  showAdd :boolean;
 
  El_Mst:any;
earnedLeaveMaster:any
showEarnedLeaveMaster =false
userEmpcode:string |null = sessionStorage.getItem('user_name');
    constructor(private fb: FormBuilder ,private api:ClamAPIService,private datePipe: DatePipe,public loader: LoaderserviceService) { 

  }


  ngOnInit(): void {

    const currentDate = new Date(); // Current date
    const currentYear = currentDate.getFullYear(); // Current year
    const nextYear = currentYear + 1;
    
    this.earnedLeaveMaster = this.fb.group({
      El_SlNo:[''],
      plant:['',{validators : [Validators.required],updateOn: 'blur'}],
      Sl_month:['',{validators : [Validators.required],updateOn: 'blur'}],
      status:['',{validators : [Validators.required],updateOn: 'blur'}],
      effectiveFrom: [new Date(currentYear, 4 - 1, 1), { validators: [Validators.required], updateOn: 'blur' }],
    effectiveTo: [new Date(nextYear, 3 - 1, 31), { validators: [Validators.required], updateOn: 'blur' }],
      minWorkingDays:['',{validators : [Validators.required,Validators.pattern('^[0-9]{1,2}$'),Validators.min(0), Validators.max(31)],updateOn: 'blur'}]
    
    })



console.log(this.earnedLeaveMaster.value.effectiveFrom)
console.log(this.earnedLeaveMaster.value.effectiveTo)


    this.getPlant()
    this.get_El_Mst()


}

clickAddEl(){
  this.showAdd=true;
}

showELForm(){
  this.showEarnedLeaveMaster = true;
  this.earnedLeaveMaster.reset()
}
hideELForm(){
  this.showEarnedLeaveMaster = false;
  this.earnedLeaveMaster.reset()
}
reset(){
  this.earnedLeaveMaster.reset()
}

getPlant(){
  this.api.getPlant().subscribe(res => {
   
    this.plantArr = res
  },error =>{
    console.log("plant list not getting",error);
  })
  }
  formatDateWithHr(inputDate: Date): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
    return formattedDate;
  }
   formatDate(inputDate: Date): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    return formattedDate;
  }



  


  EL_submit(){
if(this.earnedLeaveMaster.valid){
  this.el_Obj.Plant_code = this.earnedLeaveMaster.value.plant
  this.el_Obj.Salary_Month = this.earnedLeaveMaster.value.Sl_month
  this.el_Obj.Status = this.earnedLeaveMaster.value.status
  this.el_Obj.Effective_from = this.formatDate(this.earnedLeaveMaster.value.effectiveFrom)
  this.el_Obj.Effective_to = this.formatDate(this.earnedLeaveMaster.value.effectiveTo)
  this.el_Obj.Min_Working_Days = this.earnedLeaveMaster.value.minWorkingDays


  this.el_Obj.Created_By = this.userEmpcode;
  this.el_Obj.Created_On = this.formatDateWithHr(new Date()).toString()


  this.api.add_El(this.el_Obj).subscribe((res:any) => {
    alert('Earned leave added successfully')
      this.hideELForm()
      this.reset()
      this.get_El_Mst()
  },( error) =>{
    if(error.status=== 400){
      alert('data already exists')
    }else{
      alert(('Error in connection'))
    }
  })

}
}



markFormGroupAsTouched(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((key) => {
    const control = formGroup.controls[key];
    if (control instanceof FormGroup) {
      this.markFormGroupAsTouched(control);
    } else {
      control.markAsTouched();
    }
  });
}
get_El_Mst(){
  this.api.get_El_Mst().subscribe(res => {
    this.El_Mst = res
    this.activeEL = this.El_Mst.filter((item:any) => item.Status === true)
    // console.log(this.El_Mst)
    // console.log(  this.activeEL)
      },  error => {
        alert("Something went Wrong")
      })
}

onEdit(data:any){
  console.log(data)
  this.showAdd = data ? false : true; 
  this.earnedLeaveMaster.controls['El_SlNo'].setValue(data.El_SlNo);
  this.earnedLeaveMaster.controls['plant'].setValue(data.Plant_code);
  this.earnedLeaveMaster.controls['Sl_month'].setValue(data.Salary_Month);
  this.earnedLeaveMaster.controls['status'].setValue(data.Status.toString());
  this.earnedLeaveMaster.controls['effectiveFrom'].setValue(data.Effective_from);
  this.earnedLeaveMaster.controls['effectiveTo'].setValue(data.Effective_to);
  this.earnedLeaveMaster.controls['minWorkingDays'].setValue(data.Min_Working_Days);
  // this.showAdd=false;

}



OnUpdate(){
  if(this.earnedLeaveMaster.valid){
this.el_Obj.El_SlNo = this.earnedLeaveMaster.value.El_SlNo
this.el_Obj.Plant_code = this.earnedLeaveMaster.value.plant
this.el_Obj.Salary_Month = this.earnedLeaveMaster.value.Sl_month
this.el_Obj.Min_Working_Days = this.earnedLeaveMaster.value.minWorkingDays
this.el_Obj.Effective_from = this.formatDate(this.earnedLeaveMaster.value.effectiveFrom)
this.el_Obj.Effective_to = this.formatDate(this.earnedLeaveMaster.value.effectiveTo)
this.el_Obj.Status = this.earnedLeaveMaster.value.status
this.el_Obj.Modifed_By =  this.userEmpcode
this.el_Obj.Modifed_On = this.formatDateWithHr(new Date())

this.api.edit_El(this.el_Obj, this.el_Obj.El_SlNo).subscribe(res=>{
  alert('Earned Leave Updated')
}
, error=>{
  alert('Error in connection')
}
)
this.get_El_Mst()
this.hideELForm()
this.reset()
}else{
  this.markFormGroupAsTouched(this.earnedLeaveMaster);
}

}





del_El(data: any) {
  if(data.Status){
    this.api.delete_El(data.El_SlNo).subscribe(res =>{
      this.get_El_Mst()
      alert("Leave Deleted successfully")
    })
  }else{
    alert("Data Already Deleted")
  }
 
  }

  exportExcel() : void{

    const transformedArray:any = this.El_Mst.map((data: any) =>{
      const transformedObj:any = {};
      Object.keys(data).forEach(key => {
        const newKey = key.replace(/_/g, ' '); 
        transformedObj[newKey] = data[key];
       
      });
      return transformedObj;
     
    
    })
    console.log(transformedArray);
    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Earned Leave Master");
    XLSX.writeFile(wb,"Mst_Earned_leave.xlsx");
  
      }


}
