import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PayrollObj} from './payroll.model'
import {ClamAPIService} from '../clam-api.service'
import {LoaderserviceService} from '../../loaderservice.service'
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import * as XLSX from'xlsx';
import {MessageService,ConfirmationService,MenuItem} from 'primeng/api'

@Component({
  selector: 'app-payroll-master',
  templateUrl: './payroll-master.component.html',
  styleUrls: ['./payroll-master.component.css']
})
export class PayrollMasterComponent implements OnInit {
     
  payroll:any
  showPayrollForm= false
  payrollObj:PayrollObj = new PayrollObj();
  plantArr:any;
  activePayroll:any
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  payrollData:any;
  showAdd :boolean;
  selectedPlant:any;
  all:any;
  userDetails:any;
  items: MenuItem[] = [
            {
                icon: 'pi pi-plus-circle',
                tooltipOptions:{
                  tooltipLabel: 'Add Payroll',
                },
                command: () => {
                   this.showPayroll();
                   this.clickAddPayroll();
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
  statusOptions = [
  { label: "Active", value: "true" },
  { label: "InActive", value: "false" }
  ];

  constructor(private fb: FormBuilder ,private api:ClamAPIService,private dialog: MatDialog,public loader: LoaderserviceService,private messageService:MessageService,private confirmationService:ConfirmationService) {
   
   }

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.payroll = this.fb.group({
      slNo:[''],
      plant:['',{validators : [Validators.required],updateOn: 'blur'}],
      effectivedate:['',{validators : [Validators.required]}],
      EmployerPF:['',{validators : [Validators.required],updateOn: 'blur'}],
      EmployPF:['',{validators : [Validators.required],updateOn: 'blur'}],
      EmployerESI:['',{validators : [Validators.required],updateOn: 'blur'}],
      EmployESI:['',{validators : [Validators.required],updateOn: 'blur'}],
      EmployerLWF:['',{validators : [Validators.required],updateOn: 'blur'}],
      EmployLWF:['',{validators : [Validators.required],updateOn: 'blur'}],
      status:['',{validators : [Validators.required],updateOn: 'blur'}],
      leaveWagesCheck:['No',{validators : [Validators.required],updateOn: 'blur'}],

    })
    
this.getAllPayroll()
    this.getPlant();
  }

  showPayroll(){
    this.showPayrollForm =true
    this.reset()
}

clickAddPayroll(){
  this.showAdd=true;
}

hidePayroll(){
  this.showPayrollForm =false
  this.reset()

}
reset(){
  this.payroll.reset()
}

getPlant(){
  this.api.getPlant().subscribe(res => {
    // console.log(res)
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

openAlertDialog(message: string): void {
  this.dialog.open(ToastComponent, {
    data: {
      icon: 'Check',
      message: message
    }
  });
}

onEdit(data:any){
  this.showPayroll()
  console.log(data)
  this.payroll.controls['slNo'].setValue(data.Payroll_SlNo);
  this.payroll.controls['plant'].setValue(data.Plant_code);
  this.payroll.controls['effectivedate'].setValue(data.Effective_from);
  this.payroll.controls['EmployerPF'].setValue(data.PF_Employer);
  this.payroll.controls['EmployPF'].setValue(data.PF_Employee);
  this.payroll.controls['EmployerESI'].setValue(data.ESI_Employer);
  this.payroll.controls['EmployESI'].setValue(data.ESI_Employee);
  this.payroll.controls['EmployerLWF'].setValue(data.LWF_Employer);
  this.payroll.controls['EmployLWF'].setValue(data.LWF_Employee);
  this.payroll.controls['status'].setValue(data.Status.toString());
  this.payroll.controls['leaveWagesCheck'].setValue(data.Leave_wages.toString());
this.showAdd=false
}

updatePayroll(){
  if(this.payroll.valid && this.payroll.status){
    this.payrollObj.Payroll_SlNo = this.payroll.value.slNo
    this.payrollObj.Plant_code = this.payroll.value.plant
    this.payrollObj.PF_Employee = this.payroll.value.EmployPF
    this.payrollObj.PF_Employer = this.payroll.value.EmployerPF
    this.payrollObj.ESI_Employee = this.payroll.value.EmployESI
    this.payrollObj.ESI_Employer = this.payroll.value.EmployerESI
    this.payrollObj.LWF_Employee = this.payroll.value.EmployLWF
    this.payrollObj.LWF_Employer = this.payroll.value.EmployerLWF
    this.payrollObj.Leave_wages = this.payroll.value.leaveWagesCheck
    this.payrollObj.Effective_from = this.formatDate(this.payroll.value.effectivedate)
    this.payrollObj.Status = this.payroll.value.status
    this.payrollObj.Modified_By = this.userEmpcode;
    this.payrollObj.Modified_On = this.formatDateWithHr(new Date()).toString()

    this.api.edit_Payroll_Master(this.payrollObj,this.payrollObj.Payroll_SlNo).subscribe(res =>{
      // alert('Payroll updated successfully')
      this.openAlertDialog(`${res}`)
      this.getAllPayroll()
      this.hidePayroll()
      this.reset()
  
    },
    (error)=>{
      if (error.status === 400){
        this.openAlertDialog(`${error.error}`);
    }else {
      this.openAlertDialog(`${error.error}`);
    }
    })

  }else{
    this.markFormGroupAsTouched(this.payroll)
    
  }
}

submitPayroll(){
if(this.payroll.value){
  this.payrollObj.Plant_code = this.payroll.value.plant
  this.payrollObj.PF_Employee = this.payroll.value.EmployPF
  this.payrollObj.PF_Employer = this.payroll.value.EmployerPF
  this.payrollObj.ESI_Employee = this.payroll.value.EmployESI
  this.payrollObj.ESI_Employer = this.payroll.value.EmployerESI
  this.payrollObj.LWF_Employee = this.payroll.value.EmployLWF
  this.payrollObj.LWF_Employer = this.payroll.value.EmployerLWF
  this.payrollObj.Leave_wages = this.payroll.value.leaveWagesCheck
  this.payrollObj.Effective_from = this.formatDate(this.payroll.value.effectivedate)
  this.payrollObj.Status = this.payroll.value.status
  this.payrollObj.Created_By = this.userEmpcode;
  this.payrollObj.Created_On = this.formatDateWithHr(new Date()).toString()

  console.log(this.payrollObj)
this.api.add_Payroll_Master(this.payrollObj).subscribe(res =>{
  // alert('payroll added successfully')
  this.openAlertDialog(`${res}`)
  this.getAllPayroll()
this.hidePayroll()
this.reset()
},(error) =>{
  if (error.status === 400){
    this.openAlertDialog(`${error.error}`);
}else {
  this.openAlertDialog(`${error.error}`);
}
})

return true;
}
else{
  this.markFormGroupAsTouched(this.payroll);
    return false;
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

getAllPayroll(){
  this.api.get_Payroll_Master().subscribe(res =>{
this.payrollData = res
this.activePayroll = this.payrollData.filter((item:any) => item.Status === true)
  },(error)=>{
    if (error.status === 400){
  
      this.openAlertDialog(`${error.error}`);
  }else {
    this.openAlertDialog(`${error.error}`);
  }
  })
}

deletePayroll(event:Event,data:any){
  this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deletePayrollAPICall(data)},
            reject: () => {
                this.messageService.add({ severity: 'warn', summary: 'Rejected'});
            }
      })
}

deletePayrollAPICall(data:any){
    this.payrollObj.Modified_By = this.userEmpcode;
  this.payrollObj.Modified_On = this.formatDateWithHr(new Date()).toString()

if(data.Status){
  this.api.del_Payroll_Master(this.payrollObj, data.Payroll_SlNo).subscribe(res =>{
    this.getAllPayroll()
    this.openAlertDialog(`${res}`)
  },(error)=>{
    if (error.status === 400){
      this.openAlertDialog(`${error.error}`);
  }else {
    this.openAlertDialog(`${error.error}`);
  }
  })
}else{
  this.openAlertDialog(`Data Already Deleted`)
}
}

exportExcel() : void{
  const transformedArray:any = this.payrollData.map((data: any) =>{
    const transformedObj:any = {};
    Object.keys(data).forEach(key => {
      const newKey = key.replace(/_/g, ' '); 
      transformedObj[newKey] = data[key];
     
    });
    return transformedObj;
  })
  // console.log(transformedArray);
  var ws = XLSX.utils.json_to_sheet(transformedArray);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payroll Master");
  XLSX.writeFile(wb,"Mst_Payroll.xlsx");

}

// filter payrol by plant
filterPayrollByPlant(){
 const filteredPayrollData = this.payrollData.filter((item:any) => item.Plant_code == this.selectedPlant);
 if(filteredPayrollData.length){
   this.activePayroll = filteredPayrollData;
 }else{
  this.activePayroll = this.payrollData;
  this.messageService.add({severity:'info',summary:`Payroll Not Found For Plant: ${this.selectedPlant}`})
 }
}

log(){
  console.log(this.payroll.value)
}
}