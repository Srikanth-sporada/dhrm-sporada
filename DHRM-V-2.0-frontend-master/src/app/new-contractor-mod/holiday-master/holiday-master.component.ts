import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';
import * as XLSX from'xlsx';
import * as moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import {LoaderserviceService} from '../../loaderservice.service'
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
// import { error } from 'console';

@Component({
  selector: 'app-holiday-master',
  templateUrl: './holiday-master.component.html',
  styleUrls: ['./holiday-master.component.css']
})
export class HolidayMasterComponent implements OnInit {

  holidayForm:any
  showHolidayForm=false
  isadmin:string |null= sessionStorage.getItem('isadmin')
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
showAdd=true ;
  plantname:any
  factHoliday_data:any

  constructor(private fb: FormBuilder,private api : ClamAPIService,
    private modalService: NgbModal,
    private dialog: MatDialog,private service : ApiService,public loader: LoaderserviceService) { 
    this.holidayForm = this.fb.group({
      id:[''],
      plant:[this.plant_Code],
      date:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}],
      holidayType:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}],
      holidayName:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}]
    })
  }

  ngOnInit(): void {
   this.getFactHoliday_data()
    this.getplantcode()
  }

  getplantcode(){
    var company = {'company_name': sessionStorage.getItem('companyList.companycode')}
    this.service.plantcodelist(company)
    .subscribe({
      next: (response) =>{
        this.plantname = response;
        if(this.isadmin == 'true'){
          this.plantname = response;
        }else{
          this.plantname = this.plantname.filter( (data:any) => data.plant_code === this.plant_Code)
        }
      
       console.log(this.plantname)
       },
      error: (error) => console.log(error),
    });
  }

showForm(){
  this.showHolidayForm=true
}
hideForm(){
  // this.reset()
  this.showHolidayForm = false
  this.showAdd=true;
}
closeForm(){
  this.reset()
  this.showHolidayForm = false
  this.showAdd=true;
}
reset(){
  this.holidayForm.reset()
}

openAlertDialog(message: string , icon:string): void {
  this.dialog.open(ToastComponent, {
    data: {
      icon: icon,
      message: message
    }
  });
}


formatDate(inputDate: Date): String {
  const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
  const formattedDate = parsedDate.format('YYYY-MM-DD');
  return formattedDate;
}
getFactHoliday_data(){
this.api.get_FactHoliday_data().subscribe(res =>{
  this.factHoliday_data=res
  // console.log(this.factHoliday_data)
},(error)=>{
  console.log(error)
})
}

onedit(data:any){
  this.showForm()
console.log(data)
this.showAdd=false;
console.log(this.holidayForm.value)
this.holidayForm.patchValue({
  id: data.id,
  plant: data.plant_code,
  date: data.holiday_date,
  holidayType: data.type,
  holidayName: data.reason.trim()
});


}
delete(data:any){
 
console.log(data)
const formData = { ...data };



formData.holiday_date = this.holidayForm.value.holiday_date.split('T')[0]

console.log(formData)
this.api.del_Fct_Holiday(formData,this.userEmpcode).subscribe(res=>{
  this.openAlertDialog(`${res}` ,'check')
  this.getFactHoliday_data()
  this.hideForm()
  },(error) => {
    if (error.status === 400) {
      console.log(error)
      this.openAlertDialog(`${error.error}` ,'error' );
    }
     else {
      this.openAlertDialog('Error in connection','error');
    }
  })


}


update(){
// console.log("Update",this.holidayForm.value)
const formData = { ...this.holidayForm.value };
formData.date = this.formatDate(this.holidayForm.value.date)
// this.formatDate(this.holidayForm.value.date),
  this.api.updt_Fct_Holiday(formData,this.userEmpcode).subscribe(res=>{
    this.openAlertDialog(`${res}` ,'check')
  this.getFactHoliday_data()
  this.hideForm()
  this.reset()
  },(error) => {
    if (error.status === 400) {
      console.log(error)
        this.openAlertDialog(`${error.error}` ,'error' );
    }
     else {
        this.openAlertDialog('Error in connection','error');
    }
  })
 


}





onSubmit(){
  if(this.holidayForm.value){
    console.log(this.holidayForm.value);
    const formData = { ...this.holidayForm.value };
    // Convert the date to UTC timezone
    formData.date = this.formatDate(this.holidayForm.value.date)
    
this.api.add_Fct_Holiday(formData,this.userEmpcode).subscribe(res =>{
  this.openAlertDialog(`${res}`,'check')
  this.getFactHoliday_data()
  this.hideForm()
  this.reset()
  },(error) => {
    if (error.status === 400) {
      console.log(error)
        this.openAlertDialog(`${error.error}` ,'error' );
      this.showForm()
    }
     else {
        this.openAlertDialog('Error in connection','error');
      this.showForm()
    }
})


  }
 
//  event.currentTarget.reset()
}



exportExcel() : void{

  const transformedArray:any = this.factHoliday_data.map((data: any) =>{
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
  XLSX.utils.book_append_sheet(wb, ws, "Factory Holiday Master");
  XLSX.writeFile(wb,"Mst_Factory_Holiday.xlsx");

    }

}
