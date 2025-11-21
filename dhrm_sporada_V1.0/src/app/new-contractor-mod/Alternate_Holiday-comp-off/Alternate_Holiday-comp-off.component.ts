import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';import * as XLSX from'xlsx';
import moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import {LoaderserviceService} from '../../loaderservice.service'
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material/datepicker';
import {MessageService,ConfirmationService,MenuItem} from 'primeng/api'

@Component({
  selector: 'app-declared-comp-off',
  templateUrl: './Alternate_Holiday-comp-off.component.html',
  styleUrls: ['./Alternate_Holiday-comp-off.component.css']
})
export class DeclaredCompOffComponent implements OnInit {

  D_OffForm:any
  showD_offForm=false
  showAdd=true ;
  plantname:any;
  plantCopy:any;
  altHoliday_data:any
  isadmin:string |null= sessionStorage.getItem('isadmin')
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  maxDate: Date;
  FH_Holiday:any
  holidayType: string = '';
  altHolidayData:any = [];
  selectedPlant:any = '';
 // Speed Dial items
    items: MenuItem[] = [
              {
                  icon: 'pi pi-plus-circle',
                  tooltipOptions:{
                    tooltipLabel: 'Add Alt Holiday',
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
  constructor(private fb: FormBuilder,private api : ClamAPIService,private modalService: NgbModal,private dialog: MatDialog,private service : ApiService,public loader: LoaderserviceService, private messageService:MessageService,private confirmationService:ConfirmationService) { 
      this.maxDate = new Date();
      this.D_OffForm = this.fb.group({
      id:[''],
      plant:[this.selectedPlant],
      holiday_date:[null,{validators : [Validators.required]}],
      coff_date:[null,{validators : [Validators.required],disabled: false}],
      reason:[null,{validators : [Validators.required],disabled: false}]
    })
   }

 
  ngOnInit(): void {
    this.getplantcode();
    this.getAltHoliday_data();
    this.get_Fh_Holiday();
  }

  // check selected holiday is National or festival
  checkHolidayType(event:any): void {
    console.log(event)
    const selectedDate:any = event;
    // const plant = this.D_OffForm.get('plant_code')?.value
    // console.log(plant)
    const formattedSelectedDate = this.formatDate(selectedDate);
    // console.log('formated',formattedSelectedDate)
    const matchingHoliday = this.FH_Holiday.find((holiday: any) => {
if(holiday.plant_code  == this.plant_Code){
  const holidayDate = new Date(holiday.holiday_date).toISOString().split("T")[0];
  // console.log(holidayDate);
      if (holidayDate === formattedSelectedDate) {
        if (holiday.type === 'F') {
          this.messageService.add({severity:'warn',summary:'Already a festival holiday is declared.'})
          // alert('Already a festival holiday is declared');
        } else if (holiday.type === 'N') {
          this.messageService.add({severity:'warn',summary:'Already a national holiday is declared.'});
          // alert('Already a national holiday is declared');
        }
      }
}    
    });
  }
  
  getplantcode(){
    var company = {'company_name': sessionStorage.getItem('companyList.companycode')}
    this.service.plantcodelist(company)
    .subscribe({
      next: (response:any) =>{ 
        this.plantname = [...response];
        if(this.isadmin == 'true'){
          this.plantname = [...response];
          this.plantname.unshift({plant_name:'All',plant_code:''});
          this.plantCopy = response;
        }else{
          this.plantname = this.plantname.filter( (data:any) => data.plant_code === this.plant_Code)
        }
       
       },
      error: (error) => this.messageService.add({severity:'error',summary:error.message}),
    });
  }
/** get factory holiday api call */
  get_Fh_Holiday(){
    this.api.get_FactHoliday_data().subscribe({
      next: (response) => {
      this.FH_Holiday = response
      console.log(response)
    },
    error: (err) => this.messageService.add({severity:'error',summary:err.message})
    })
  }

showForm(){
  this.showD_offForm=true
  this.showAdd=true;
}
hideForm(){
  this.showD_offForm = false
  this.showAdd=true;
}
closeform(){
  this.reset()
  this.showD_offForm = false
}
reset(){
  this.D_OffForm.reset()
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

/** get alterante holiday data api call */
getAltHoliday_data(){
  this.api.get_Alt_Holiday_data().subscribe(res =>{
    this.altHoliday_data = res;
    this.altHolidayData = res;
    /** filter function */
    this.filterAltHolidayByPlant();
    // console.log(this.factHoliday_data)
  },(error)=>{
    this.messageService.add({severity:'error',summary:error.message})
  })
}

onedit(data:any){
    this.showForm()
  console.log('VIEW DATA:',data);
  this.D_OffForm.get('last')?.disable()
  this.showAdd=false;
  console.log(this.D_OffForm.value)
  this.D_OffForm.patchValue({
    id: data.id,
    plant: data.plant.toString(),
    holiday_date: this.formatDate(data.holiday_date),
    coff_date: this.formatDate(data.coff_date),
    // reason: data.reason ? data.reason.trim() : ''
     reason: data.reason 
  });
  console.log(this.D_OffForm.value.holiday_date)
} 

// alternate holiday conditions check function
onSubmit() {
  if (this.D_OffForm.valid) {
    const formData = { ...this.D_OffForm.value };
    formData.holiday_date = this.formatDate(this.D_OffForm.value.holiday_date);
    formData.coff_date = this.formatDate(this.D_OffForm.value.coff_date);

    // Check if the selected dates match holidays
    const matchingHoliday = this.checkForMatchingHoliday(formData.holiday_date, formData.plant);
    const matchingC_Off = this.checkForMatchingHoliday(formData.coff_date, formData.plant);

    if (matchingHoliday && matchingC_Off) {
      // Both dates match holidays
      this.openAlertDialog('Already a holiday is declared for both Holiday Date and C-Off Date', 'error');
    } else {
      // Check each date separately
      if (matchingHoliday) {
        // Matching holiday for Holiday Date
        this.handleMatchingHoliday(matchingHoliday, 'Holiday Date');
      }
      if (matchingC_Off) {
        // Matching holiday for C-Off Date
        this.handleMatchingHoliday(matchingC_Off, 'C-Off Date');
      }

      // No matching holidays for both dates, proceed with form submission
      if (!matchingHoliday && !matchingC_Off) {
        this.submitForm(formData);
      }
    }
  }else{
    this.messageService.add({severity:'warn',summary:'Please Fill All Required Fields!'})
  }
}

// Display the appropriate error message based on the holiday type
handleMatchingHoliday(matchingHoliday:any, dateType:any) {
  if (matchingHoliday.type === 'F') {
    this.openAlertDialog(`Already a festival holiday is declared for ${dateType}. Please change ${dateType}`, 'error');
  } else if (matchingHoliday.type === 'N') {
    this.openAlertDialog(`Already a national holiday is declared for ${dateType}. Please change ${dateType}`, 'error');
  }
}

// add alternate holiday function
submitForm(formData: any) {
  this.api.add_Alt_Holiday(formData, this.userEmpcode).subscribe(
    (res) => {
      this.messageService.add({severity:'info',summary:`${res}`})
      // this.openAlertDialog(`${res}`, 'check');
      this.getAltHoliday_data();
      this.hideForm();
      this.reset();
    },
    (error) => {
      if (error.status === 400) {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.error})
        // this.openAlertDialog(`${error.error}`, 'error');
        this.showForm();
      } else {
        this.messageService.add({severity:'error',summary:'Error in connection'})
        // this.openAlertDialog('Error in connection', 'error');
        this.showForm();
      }
    }
  );
}

// checking matching holiday
checkForMatchingHoliday(selectedDate: string , plant:string): any {
  const matchingHoliday = this.FH_Holiday.find((holiday: any) => {
    if (holiday.plant_code === plant) {
      const holidayDate = new Date(holiday.holiday_date).toISOString().split("T")[0];
      return holidayDate === selectedDate;
    }
    return null;
  });
  return matchingHoliday;
}

// update alternate holiday function DISABLED
update(){
  const formData = { ...this.D_OffForm.value };
  formData.holiday_date = this.formatDate(this.D_OffForm.value.holiday_date)
  formData.coff_date = this.formatDate(this.D_OffForm.value.coff_date)

  this.api.updt_Alt_Holiday(formData,this.userEmpcode).subscribe(res=>{
    this.openAlertDialog(`${res}`,'check');
    this.getAltHoliday_data();
    this.hideForm()
    this.reset()
    },(error) => {
      if (error.status === 400) {
        console.log(error)
        this.messageService.add({severity:'warn',summary:error?.error})
      }
       else {
        this.messageService.add({severity:'error',summary:'Error In connection'})
      }
    })
  
}

// delete alternate holiday
deleteAltHoliday(event:Event,data:any){
  console.log(data)
  const formData = { ...data };
  if (this.D_OffForm.value.holiday_date) {
    formData.holiday_date = this.D_OffForm.value.holiday_date.split('T')[0];
  }
  if (this.D_OffForm.value.coff_date) {
    formData.coff_date = this.D_OffForm.value.coff_date.split('T')[0];
  }
 this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteAltHolidayAPICall(formData)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
}

// delete alternate holiday api call
deleteAltHolidayAPICall(formData:any){
 this.api.del_Alt_Holiday(formData,this.userEmpcode).subscribe(res=>{
    this.messageService.add({severity:'info',summary:`${res}`})
    this.getAltHoliday_data()
    this.hideForm()
    },(error) => {
      if (error.status === 400) {
        console.log(error)
        this.messageService.add({severity:'error',summary:error.error})
      }
       else {
        this.messageService.add({severity:'error',summary:'Error in connection'})
      }
    })
}

exportExcel() : void{

  const transformedArray:any = this.altHoliday_data.map((data: any) =>{
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
  XLSX.utils.book_append_sheet(wb, ws, "FAlternate Holiday Master");
  XLSX.writeFile(wb,"Mst_Alternate_Holiday.xlsx");

}

// filter alternate holiday by plant
filterAltHolidayByPlant(){
  if(this.selectedPlant == ''){
    this.altHoliday_data = this.altHolidayData;
   
  }else{
    const filteredAltHoliday = this.altHolidayData.filter((altHoliday:any) => altHoliday.plant == this.selectedPlant);
  if(filteredAltHoliday.length){
    this.altHoliday_data = filteredAltHoliday;
  }else{
    this.altHoliday_data = this.altHolidayData;
    this.messageService.add({severity:'info',summary:`Alternate Holiday Not Found For Plant: ${this.selectedPlant}`})
  }
  }
}
}
