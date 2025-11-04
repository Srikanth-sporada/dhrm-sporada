import { Component, OnInit, ViewEncapsulation,ViewChild,TemplateRef} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from "src/environments/environment.prod";
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';

const material = [MatSidenav, MatTableModule];

@Component({
  selector: "app-plant",
  templateUrl: "./plant.component.html",
  styleUrls: ["./plant.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class PlantComponent implements OnInit {
  closeResult: string;
  form:any
  file:any
  new:any
  company:any
  companylist:any
  sample : any = environment.path+'/plant/'
  uploadUrl = environment.path+'/plantupload'
  dummy: any = []
  plantData:any=[]
  companyData:any = []
  editing_flag: any;
  sign:any = null
  inx: any;
  selectedCompany:any = 'all';
  // material modal template ref
  @ViewChild('content', {read: TemplateRef}) addPlantTemplateRef: TemplateRef<unknown> | undefined;
    // Speed Dial items
  items: MenuItem[] = [
            {
                icon: 'pi pi-plus-circle',
                tooltipOptions:{
                  tooltipLabel: 'Add Plant',
                },
                command: () => {
                    this.open(this.addPlantTemplateRef);
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
  constructor(private fb : UntypedFormBuilder, private modalService : NgbModal, private service : ApiService,public loader: LoaderserviceService, private messageService:MessageService,private confirmationService:ConfirmationService) {
    this.form = this.fb.group({
      sno:[''],
      plant_code :['', Validators.required],
      plant_name : ['', [Validators.required,Validators.pattern(/\S+/)]],
      pl : ['',[Validators.required,Validators.pattern(/\S+/)]], 
      addr : ['',[Validators.required,Validators.pattern(/\S+/)]],
      locatn : ['', [Validators.required,Validators.pattern(/\S+/)]],
      plant_sign : [''],
      personal_area : ['', Validators.required],
      payroll_area:['', Validators.required],
      company_code:['', Validators.required]
    })
   }

  ngOnInit(): void {
   this.getPlantData();
   this.getCompanyData();
  }

  /** 
   * @description get the plant dat from API
   * @property {dummy} has the plant data
   * @property {plantData} has copy of plant data for filter purpose
   * */ 
  getPlantData() {
       this.service.getplant().
    subscribe({
      next: (response) => {
        this.dummy = response;
        this.plantData= response;
        this.filterPlantByCompany();
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    })
  }
 /** 
   * @description get the company data for dropdown
   * @property {companyList} has the company data
   * @property {companyData} has copy of company data for filter purpose
   * 1. company data array has the extra data for filter purpose {All}
   * */ 
  getCompanyData() {
    this.service.getCompanyCode()
    .subscribe({
      next: (response:any)=>{
        console.log(response)
        this.companylist = response;
        this.companyData = [...response];
        this.companyData.unshift({company_code:'all',company_name:'All'});
        console.log('cmplist',this.companylist);
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    })
  }
  /**
   * 
   * @param content Material UI Modal ref
   */
  open(content:any)
  {
    this.sign = null
    this.form.reset();
    this.editing_flag = false
    this.form.get('company_code').enable()
    console.log("opening")
    this.modalService.open(content, {centered: true})
  }  
  /**
   * @memberof PlantComponent
   * @property {any} form has plant data
   * 1. plant_sign file name is updated using plant_code_sign.filename
   * 
   */
  save()
  {
    this.form.controls['plant_sign'].setValue(this.form.controls['plant_code'].value+'_sign.'+this.new)
    console.log(this.form.value)

    this.service.addplant(this.form.value)
    .subscribe({
      next : (response:any)=>{console.log(response);
      if(response.message == 'already')
      {
        this.messageService.add({severity:'info',summary:'Plant Code already exists'})
      }else if(response.message == 'inserted'){
        // this.service.getplant().
        // subscribe({
        //   next: (response) => {
        //     this.dummy = response;
            
        //     this.filterPlantByCompany();
        //   },
        //   error: (err) => this.messageService.add({severity:'error',summary:err.message})
        // })
       
        this.getPlantData();
        this.form.reset()
        this.messageService.add({severity:'info',summary:'Plant Added Successfully!'})
      }else if(response.message == 'failure'){
        this.messageService.add({severity:'error', summary:"Can't Add Plant!"})
      }
    },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    })    
  }

  getValue(event:any)
  {
    console.log(this.form.value);
  }

  // open material modal for update plant
  opentoedit(content:any)
  {
    console.log("opening")
    this.modalService.open(content, {centered: true})
  }

  // edit plant function
  edit(a:any)
  {      
    this.editing_flag = true
    this.form.get('company_code').disable()
    this.form.controls['sno'].setValue(a)
    this.form.controls['company_code'].setValue(this.dummy[a]?.company_code)    
    this.form.controls['plant_code'].setValue(this.dummy[a].plant_code)
    this.form.controls['plant_name'].setValue(this.dummy[a].plant_name)
    this.form.controls['pl'].setValue(this.dummy[a].pl)
    this.form.controls['addr'].setValue(this.dummy[a].addr)
    this.form.controls['locatn'].setValue(this.dummy[a].locatn)
    this.form.controls['personal_area'].setValue(this.dummy[a].personal_area)
    this.form.controls['payroll_area'].setValue(this.dummy[a].payroll_area)
    console.log(this.form.value);
    this.sign = this.dummy[a].plant_sign
    console.log(this.sign);
    console.log(this.dummy[a])
  }

  // update plant api call function
  editSave()
  {
    this.form.controls['plant_sign'].setValue(this.form.controls['plant_code'].value+'_sign.'+this.new)
    console.log(this.form.value)
    this.service.updateplant(this.form.value)
    .subscribe({
      next: (response:any)=>{
      console.log(response);
      if(response.message== 'already')
      {
        this.messageService.add({severity:'info',summary:'Plant code already exists!'})
      }else if(response.message == 'updated'){
        this.service.getplant().
        subscribe({
          next: (response) => {
            this.dummy = response;
             // filter function call
            this.filterPlantByCompany();
          },
          error: (err) => this.messageService.add({severity:'error',summary:err.message})
        })
        this.messageService.add({severity:'info',summary:'Plant Updated.'})
      }
    },
      error:(err) => this.messageService.add({severity:'error',summary:err.message})
    })
  }

// delete plant confirmation
deletePlant(event:Event,a:any){
  this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deletePlantAPICall(a)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
}

// delete plant api call
deletePlantAPICall(a:any){
  console.log(this.dummy[a])
  this.service.deleteplant(this.dummy[a])
  .subscribe({
    next: (response:any) =>{console.log(response); 
    if(response.message == 'success'){
      this.dummy.splice(a,1);
      this.messageService.add({severity:'info',summary:'Plant Deleted Successfully'})
    }else{
      this.messageService.add({severity:'error',summary:"Can't Delete Plant"})
    }
  }
  })
}

// download plant function
exportexcel(): void
{

  const newKeys:any = {
    plant_code: 'Plant Code',
    plant_name: 'Plant Name',
    pl: 'Plant Short Name',
    addr: 'Address',
    locatn: 'Location',
    personal_area: 'Personal Area',
    payroll_area: 'Payroll Area',
    company_name: 'Company Name',
    company_code: 'Company Code',
    del_status: 'Del Status',
  };

  // Map the array and transform each object
  const transformedArray:any = this.dummy.map((obj:any) => {
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
  XLSX.writeFile(wb, 'plant_master.xlsx');
}

reset(){
  this.form.reset()
}

// plant sign upload function
upload(event:any)
{
  this.file = event.target.files[0]
	var file_local = this.file?.name.split('.')
	this.new = file_local?.pop()

  var formData = new FormData()

  formData.append("file", event.target.files[0], this.form.controls['plant_code'].value+'_sign.'+this.new )
  this.sign = this.form.controls['plant_code'].value+'_sign.'+this.new
  this.service.plantupload(formData)
  .subscribe(
    {
      next: (res:any)=>{
        if(res.message == 'success'){
          this.messageService.add({severity:'success',summary:'Uploaded Successfully'})
        }
        console.log(res)
      },
      error: (err=>{
        this.messageService.add({severity:'error',summary:err.message})
      }
      )
    }
  )

}

// hr sign upload file
signUpload(event:any){
  console.log(event)
  if(event.originalEvent.body.message == 'success'){
    this.messageService.add({severity:'info',summary:"File Uploaded"})
  }else{
    this.messageService.add({severity:'error',summary:"Can't Upload File!"})
  }
}

/**
 * 
 * @property {selectedCompany} has  @type {string} user selected company code
 * @property {FilteredPlantDataByCompany} has filtered data
 * @property {plantData} has copy data of the plant
 */
filterPlantByCompany(){
  if(this.selectedCompany == 'all'){
    this.dummy = this.plantData;
  }else{
    const FilteredPlantDataByCompany = this.plantData.filter((plant:any) => {
    if(plant.company_code == this.selectedCompany){
       return plant;
    }
  })
  if(FilteredPlantDataByCompany.length){
    this.dummy= FilteredPlantDataByCompany;
  }else{
    this.dummy = this.plantData;
    this.messageService.add({severity:'info',summary:'Plant Not Found!'})
  }
  }
}
/**
 * 
 * @param event change event to get personal area
 * @property {filteredDataBypersonalArea} filtered plant data
 * @property {plantData} has copy data of plant
 */
filterPlantByPersonalArea(event:any){
  const personalArea = event.value;
  const filteredDataBypersonalArea = this.plantData.filter((plant:any) => {
    if(plant.personal_area == personalArea){
      return plant;
    }
  })
  if(filteredDataBypersonalArea.length){
    this.dummy = filteredDataBypersonalArea;
  }else{
    this.dummy = this.plantData;
    this.messageService.add({severity:'info', summary:"Data Not Found!"})
  }
}
/**
 * 
 * @param event input event to get user input
 * @property {userSearchedPlant} has filtered plant
 */
searchPlantByCodeOrName(event:any){
  const searchTerm = event.target.value.toLowerCase();
  const userSearchedPlant = this.plantData.filter((plant:any) => {
    if(plant.plant_name.toLowerCase() == searchTerm || plant.pl.toLowerCase() == searchTerm || plant.plant_code.toLowerCase() == searchTerm){
      return plant;
    }
  });
  if(userSearchedPlant.length){
    this.dummy = userSearchedPlant;
  }else{
    this.dummy = this.plantData;
  }
}

}


