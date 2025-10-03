import { Component, OnInit, ViewEncapsulation,ViewChild,TemplateRef} from '@angular/core';
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { log } from 'console';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from "src/environments/environment.prod";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-payroll-area',
  templateUrl: './payroll-area.component.html',
  styleUrls: ['./payroll-area.component.css']
})
export class PayrollAreaComponent implements OnInit {
  closeResult: string;
  payrollAreaForm:any
  file:any
  new:any
  company:any
  companylist:any
  sample : any = environment.path+'/plant/'
  uploadUrl = environment.path+'/plantupload'
  plantList: any = []
  plantData:any=[];
  payrollAreaList:any = [];
  payrollAreaCopy:any = [];
  companyData:any = []
  editing_flag: any;
  sign:any = null
  inx: any;
  userDetails:any;
  all:any;
  // material modal template ref
  @ViewChild('content', {read: TemplateRef}) addPayrollAreaTemplateRef: TemplateRef<unknown> | undefined;
    // Speed Dial items
  items: MenuItem[] = [
            {
                icon: 'pi pi-plus-circle',
                tooltipOptions:{
                  tooltipLabel: 'Add Payroll Area',
                },
                command: () => {
                    this.open(this.addPayrollAreaTemplateRef);
                }
            },
            {
              icon: 'pi pi-download',
              tooltipOptions:{
                tooltipLabel: 'Download',
              },
              command: () => {
                this.exportexcel();
                this.messageService.add({ severity: 'info', summary: 'Data Converted.' });
              }
            }
  ];
  constructor(
    private fb : UntypedFormBuilder, 
    private modalService : NgbModal, 
    private service : ApiService,
    public loader: LoaderserviceService, 
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
  ) { 
     this.payrollAreaForm = this.fb.group({
      PlantCode:['',Validators.required],
      PayrollArea:['',Validators.required],
      StartDay:['',Validators.required],
      EndDay:['',Validators.required],
      Grace_minutes: ['',Validators.required],
      InsertBy:[],
      UpdateBy:[],
    })
  }

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    // get plant data
    this.service.getplant().
    subscribe({
      next: (response)=>{
        this.plantList = response;
        this.plantList.push({plant_code:'all',plant_name:'All'})
        this.plantData= response;
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    });
    this.getPayrollArea();
  }
  
  // open material modal function for add plant
  open(content:any){
    this.sign = null
    this.payrollAreaForm.reset();
    this.editing_flag = false
    console.log("opening")
    this.modalService.open(content, {centered: true})
  }
  
  // getpayroll area
  getPayrollArea(){
    this.service.getPayrollArea().subscribe({
      next:(response:any) => {
        console.log(response);
        this.payrollAreaList = response;
        this.payrollAreaCopy = response;
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }
  // add plant function
  addPayrollArea(){
    // adding insertBY gen ID
    this.payrollAreaForm.controls['InsertBy'].setValue(this.all?.gen_id || 'null');
    // converting payroll area number to string
    this.payrollAreaForm.controls['PayrollArea'].setValue(String(this.payrollAreaForm.value.PayrollArea));

    console.log(this.payrollAreaForm.value);
    this.service.addNewPayrollArea(this.payrollAreaForm.value).subscribe({
      next: (response:any) => {
        console.log(response);
        this.messageService.add({severity:'info',summary:response.message})
        this.getPayrollArea();
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }

  getValue(event:any){
    console.log(this.payrollAreaForm.value);
  }
   // open material modal for update plant
  opentoedit(content:any){
    console.log("opening")
    this.modalService.open(content, {centered: true})
  }
   // edit plant function
  patchUpdateValue(a:any){      
    this.editing_flag = true
    this.payrollAreaForm.controls['PlantCode'].setValue(this.payrollAreaList[a]?.PlantCode)    
    this.payrollAreaForm.controls['PayrollArea'].setValue(this.payrollAreaList[a].PayrollArea)
    this.payrollAreaForm.controls['StartDay'].setValue(this.payrollAreaList[a].StartDay)
    this.payrollAreaForm.controls['EndDay'].setValue(this.payrollAreaList[a].EndDay);
    this.payrollAreaForm.controls['InsertBy'].setValue(this.payrollAreaList[a].InsertBy)
    this.payrollAreaForm.controls['Grace_minutes'].setValue(this.payrollAreaList[a].Grace_minutes);
    this.payrollAreaForm.controls['UpdateBy'].setValue(this.all?.gen_id);
    console.log(this.payrollAreaForm.value);

  }
  // update plant api call function
  updatepayrollArea(){
    this.payrollAreaForm.controls['PayrollArea'].setValue(String(this.payrollAreaForm.value.PayrollArea));
    this.payrollAreaForm.controls['Grace_minutes'].setValue(String(this.payrollAreaForm.value.Grace_minutes));
    this.payrollAreaForm.controls['UpdateBy'].setValue(this.all?.gen_id || 'null');
    console.log(this.payrollAreaForm.value);
    this.service.updatePayrollArea(this.payrollAreaForm.value).subscribe({
      next: (response:any) => {
        console.log(response);
         this.messageService.add({severity:'info',summary:response.message});
         this.getPayrollArea();
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }
    // delete plant confirmation
  deletePayrollArea(event:Event,a:any){
    this.confirmationService.confirm({
          target: event.target as EventTarget,
              message: 'Are you sure you want to Delete?',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {this.deletePayrollAreaAPICall(a)},
              reject: () => {
                  this.messageService.add({ severity: 'error', summary: 'Rejected'});
              }
        })
  }
  // delete plant api call
  deletePayrollAreaAPICall(a:any){
    const deleteData = {
      PlantCode:this.payrollAreaList[a].PlantCode,
      PayrollArea:this.payrollAreaList[a].PayrollArea
    };
    console.log(deleteData)
    this.service.deletePayrollArea(deleteData).subscribe({
      next: (response:any) => {
        console.log(response);
         this.messageService.add({severity:'info',summary:response.message});
         this.getPayrollArea();
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }
  // download payroll area in excel
  exportexcel(): void
  {
  
    const newKeys:any = {
      PlantCode: 'Plant Code',
      PayrolArea: 'Plant Name',
      StartDay: 'Start Day',
      EndDay: 'End Day',
      Grace_minutes: 'Grace Minutes',
      InsertBy: 'Created By',
      InsertDate: 'Created On',
      UpdateBy: 'Modified By',
      UpdateDate: 'Modified On',
    };
  
    // Map the array and transform each object
    const transformedArray:any = this.payrollAreaList.map((obj:any) => {
      const transformedObj:any = {};
      Object.keys(obj).forEach(key => {
        const newKey = newKeys[key] || key;
        transformedObj[newKey] = obj[key];
      });
      return transformedObj;
    });
    console.log(transformedArray);
    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'payroll_master.xlsx');
  }
  reset(){
  this.payrollAreaForm.reset()
  }
  // filter by company
  filterPayrollAreaByPlant(event:any){
    const plantCode = event.value;
    if(plantCode == 'all'){
      this.payrollAreaList = this.payrollAreaCopy;
    }else{
      const filteredPayrollAreaData = this.payrollAreaCopy.filter((payrollArea:any) => {
      if(payrollArea.PlantCode == plantCode){
        return payrollArea;
      }
    })
    if(filteredPayrollAreaData.length){
      this.payrollAreaList= filteredPayrollAreaData;
    }else{
      this.payrollAreaList = this.payrollAreaCopy;
      this.messageService.add({severity:'info',summary:'Payroll Area Not Found!'})
    }
    }
  }
  // filter by personal area
  filterPlantByPersonalArea(event:any){
    const personalArea = event.value;
    const filteredDataBypersonalArea = this.plantData.filter((plant:any) => {
      if(plant.personal_area == personalArea){
        return plant;
      }
    })
    if(filteredDataBypersonalArea.length){
      this.plantList = filteredDataBypersonalArea;
    }else{
      this.plantList = this.plantData;
      this.messageService.add({severity:'info', summary:"Data Not Found!"})
    }
  }
  // search plat by code | shortname | plant name
  searchPayrollArea(event:any){
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm)
    const foundPayrollArea = this.payrollAreaCopy.filter((payrollArea:any) => {
      if(payrollArea.PlantCode.toLowerCase() == searchTerm || payrollArea.PayrollArea.toLowerCase() == searchTerm){
        return payrollArea;
      }
    });
    console.log(foundPayrollArea)
    if(foundPayrollArea.length){
      this.payrollAreaList = foundPayrollArea;
    }else{
      this.payrollAreaList = this.payrollAreaCopy;
    }
  }
}
