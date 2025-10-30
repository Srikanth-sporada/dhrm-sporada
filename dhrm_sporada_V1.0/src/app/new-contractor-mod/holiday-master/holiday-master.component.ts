import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';
import * as XLSX from'xlsx';
import moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import {LoaderserviceService} from '../../loaderservice.service'
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import {MessageService,ConfirmationService,MenuItem} from 'primeng/api'

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
  selectedPlant:any = 'all';
  factHoliday_data:any
  holidayData:any=[];
  holidayType = [{label:'National Holiday',value:'N'},{label:'Festival Holiday',value:'F'}];
// Speed Dial items
    items: MenuItem[] = [
              {
                  icon: 'pi pi-plus-circle',
                  tooltipOptions:{
                    tooltipLabel: 'Add Holiday',
                  },
                  command: () => {
                      this.showForm()
                  }
              },
              {
                icon: 'pi pi-download',
                tooltipOptions:{
                  tooltipLabel: 'Download',
                },
                command: () => {
                  this.exportExcel();
                  this.messageService.add({ severity: 'info', summary: 'Data Converted.' });
                }
              }
    ];
  constructor(private fb: FormBuilder,private api : ClamAPIService,
    private modalService: NgbModal,
    private dialog: MatDialog,private service : ApiService,public loader: LoaderserviceService,private messageService:MessageService,private confirmationService:ConfirmationService,) { 
    this.holidayForm = this.fb.group({
      id:[''],
      plant:[this.plant_Code],
      date:['',Validators.required],
      holidayType:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}],
      holidayName:['',{validators : [Validators.required],updateOn: 'blur',disabled: false}]
    })
  }

  ngOnInit(): void {
   this.getFactHoliday_data();
    this.getplantcode();
  }

  /** get plant data api call */
  getplantcode(){
    var company = {'company_name': sessionStorage.getItem('companyList.companycode')}
    this.service.plantcodelist(company)
    .subscribe({
      next: (response) =>{
        this.plantname = response;
        if(this.isadmin == 'true'){
          this.plantname = response;
          this.plantname.unshift({plant_name:'All',plant_code:'all'})
        }else{
          this.plantname = this.plantname.filter( (data:any) => data.plant_code === this.plant_Code)
        }
      
       console.log(this.plantname)
       },
      error: (error) => this.messageService.add({severity:'error',summary:error.message})
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
this.api.get_FactHoliday_data().subscribe(res => {
  this.factHoliday_data = res
  this.holidayData = res;
  /** filter function */
  this.filterHolidayByPlant();
  // console.log(this.factHoliday_data)
},(error)=>{
  this.messageService.add({severity:'error',summary:error.message})
})
}

// edit hliday function
onedit(data:any){
  this.showForm()
console.log(data)
this.showAdd=false;
console.log(this.holidayForm.value)
this.holidayForm.patchValue({
  id: data.id,
  plant: data.plant_code,
  date: moment(data.holiday_date).format('YYYY-MM-DD'),
  holidayType: data.type[0],
  holidayName: data.reason.trim()
});


}

// delete holiday function
deleteHoliday(event:Event,data:any){
console.log(data)
const formData = { ...data };
// formData.holiday_date = this.holidayForm.value.holiday_date.split('T')[0]
console.log(formData)
this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteHolidayAPICall(formData)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
}

// delete holiday api call
deleteHolidayAPICall(formData:any){
 this.api.del_Fct_Holiday(formData,this.userEmpcode).subscribe({
  next: (res) => {
  // this.openAlertDialog(`${res}` ,'check')
  this.getFactHoliday_data();
  this.hideForm();
  this.messageService.add({severity:'info',summary:`${res}`})
  },
  error: (error) => {
    if (error.status === 400) {
      console.log(error)
      this.messageService.add({severity:'error', summary:error.error})
    }
     else {
      this.messageService.add({severity:'error',summary:'Error in connection'});
    }
  }
 })
}

update(){
// console.log("Update",this.holidayForm.value)
this.holidayForm.controls['holidayType'].setValue(this.holidayForm.value.holidayType[1])
const formData = { ...this.holidayForm.value }
formData.date = this.formatDate(this.holidayForm.value.date)
// this.formatDate(this.holidayForm.value.date),
  this.api.updt_Fct_Holiday(formData,this.userEmpcode).subscribe(
   (res) =>{
    this.messageService.add({severity:'info',summary:`${res}`})
    this.getFactHoliday_data();
    this.hideForm();
    this.reset();
  },(error) => {
    if (error.status === 400) {
      console.log(error)
        this.messageService.add({severity:'error',summary:error.error})
    }
     else {
       this.messageService.add({severity:'error',summary:'Error in network!'})
    }
  });
}

onSubmit(){
  if(this.holidayForm.value){
    console.log(this.holidayForm.value);
    this.holidayForm.controls['holidayType'].setValue(this.holidayForm.value.holidayType[0])
    const formData = { ...this.holidayForm.value };
    // Convert the date to UTC timezone
    formData.date = moment(this.holidayForm.value.date).format('YYYY-MM-DD');
    
this.api.add_Fct_Holiday(formData,this.userEmpcode).subscribe(res =>{
  this.messageService.add({severity:'info',summary:`${res}`})
  this.getFactHoliday_data();
  this.hideForm();
  this.reset();
  },(error) => {
    if (error.status === 400) {
      console.log(error)
       this.messageService.add({severity:'error',summary:error.error})
       this.showForm()
    }
     else {
      this.messageService.add({severity:'error',summary:'Error in connection'})
      this.showForm()
    }
})


  }
 
//  event.currentTarget.reset()
}

// export holiday data to excel 
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

// filter holiday by plant
filterHolidayByPlant(){
 if(this.selectedPlant == 'all'){
     this.factHoliday_data = this.holidayData;
 }else{
  const filteredHolidayData = this.holidayData.filter((holiday:any) => {
   if(holiday.plant_code == this.selectedPlant){
    return holiday;
   }
 });

 if(filteredHolidayData.length){
  this.factHoliday_data = filteredHolidayData;
 }else{
  this.factHoliday_data = this.holidayData;
  this.messageService.add({severity:'info',summary:`Holiday Not Found For Plant: ${this.selectedPlant}`})
 }
 }
}

/** filter holiday fn */
filterHoliday(event:any){
  const holidayType = event.value;
  const filteredHolidayData =  this.holidayData.filter((holiday:any) => holidayType == holiday.type && this.selectedPlant == holiday.plant_code);

  if(filteredHolidayData.length){
    this.factHoliday_data = filteredHolidayData;
  }else{
    this.factHoliday_data = this.holidayData;
  }
}
}
