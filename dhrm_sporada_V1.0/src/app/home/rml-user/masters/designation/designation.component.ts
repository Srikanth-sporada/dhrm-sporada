import {Component,OnInit,ViewEncapsulation,ViewChild,TemplateRef} from "@angular/core";
import {UntypedFormBuilder,Validators} from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import * as XLSX from "xlsx";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { environment } from "src/environments/environment.prod";
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';


const material = [
  MatSidenav,
  MatTableModule
];

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DesignationComponent implements OnInit {
  closeResult: string;
  form: any
  plantname: any
  temp_a: any
  sample: any = environment.path
  array: any = []
  index: any = -1
  designation: any = []
  selectedPlant:any = 'all';
  designationData:any=[]
  editing_flag: any;
  // material modal template ref
    @ViewChild('content', {read: TemplateRef}) addDepartmentTemplateRef: TemplateRef<unknown> | undefined;
  // Speed Dial items
    items: MenuItem[] = [
              {
                  icon: 'pi pi-plus-circle',
                  tooltipOptions:{
                    tooltipLabel: 'Add Designation',
                  },
                  command: () => {
                      this.open(this.addDepartmentTemplateRef);
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
  constructor(private fb: UntypedFormBuilder, private modalService: NgbModal, private service: ApiService, public loader: LoaderserviceService,private messageService:MessageService,private confirmationService:ConfirmationService) {
    this.form = this.fb.group({
      slno: ['', ],
      desig_name: ['',Validators.required],
      plant_name: ['',Validators.required],
      names: [''],
      plant_code: ['']
    })
  }
  // ng lifecycle 
  ngOnInit(): void {
    this.getplantcode();
    this.getDesignation();
  }

  /** get designation api call */
  getDesignation() {
     this.service.getdesignation().
      subscribe({
        next: (response) => { 
          console.log(response);
          this.designation = response;
          this.designationData = response;
          /** filter function */
          this.filterDesignationByPlant();
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })
  }
  // export to excel function DOWNLOAD
  exportexcel(): void {
        // Define the new key names
        const newKeys:any = {
          desig_name: 'Designation Name',
          plant_code: 'Plant Code',
          plant_name: 'Plant Name',
        };
    
        // Map the array and transform each object
        const transformedArray:any = this.designation.map((obj:any) => {
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
    XLSX.writeFile(wb, 'designation.xlsx');
  }

  getplantcode() {
    var company = { 'company_name': sessionStorage.getItem('companycode') }
    this.service.plantcodelist(company)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.plantname = response;
          this.plantname.unshift({plant_name:'All',plant_code:'all'});
        },
        error: (error) => this.messageService.add({severity:'error',summary:error.message}),
      });
  }

  get_slno(event: any) {
    console.log(this.form.value);
  }

  open(content: any) {
    this.form.reset();
    this.editing_flag = false
    console.log("opening")
    this.modalService.open(content, { centered: true })
  }

  opentoedit(content: any) {
    console.log("opening")
    this.modalService.open(content, { centered: true })
  }

  edit(a: any) {
    this.temp_a = a
    this.editing_flag = true
    this.form.controls['slno'].setValue(this.designation[a].slno)
    this.form.controls['desig_name'].setValue(this.designation[a].desig_name)
    this.form.controls['names'].setValue(this.designation[a]?.plant_name)
    this.form.controls['plant_name'].setValue(this.designation[a]?.plant_code)
    this.form.get('plant_name').disable()
  }

  // add new designation
  save() {
    console.log(this.form.value)
    this.service.adddesignation(this.form.value)
      .subscribe({
        next: (response: any) => {
          if(response.message != 'failure'){
            console.log(response);
          const index = this.plantname.findIndex((obj: any) => obj.plant_code === this.form.get('plant_name').value);
          this.form.get('plant_code').setValue(this.form.get('plant_name').value)
          this.form.get('plant_name').setValue(this.plantname[index].plant_name);
          this.getDesignation();
          this.form.reset()
          this.messageService.add({severity:'info',summary:'Designation Added.'})
          }else{
            this.messageService.add({severity:'error',summary:'cannot Add Designation!'})
          }
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })

  }
  // update designation
  editSave() {
    this.form.get('plant_name').enable()
    this.service.updatedesignation(this.form.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message == 'updated') {
            const index = this.plantname.findIndex((obj: any) => obj.plant_code === this.form.get('plant_name').value);
            this.form.get('plant_code').setValue(this.form.get('plant_name').value)
            this.form.get('plant_name').setValue(this.plantname[index].plant_name)
            this.getDesignation(); 
            this.messageService.add({severity:'info',summary:'Designation Updated!'})
          }else{
            this.messageService.add({severity:'error',summary:'Cannot Update Designation!'})
          }
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })
  }
// delete designation
  delete(event:Event,a: any, slno: any) {
  console.log(slno)
  this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteDesignationAPICall(a,slno)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
  }
// delete designation api call
  deleteDesignationAPICall(a: any, slno: any){
    this.service.deletedesignation({ slno: slno })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message == 'success')
            this.designation.splice(a, 1);
            this.messageService.add({severity:'info',summary:'Designation Deleted.'})
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })
  }

  reset() {
    this.form.reset()
  }

  // filterDesignation by plant
  filterDesignationByPlant(){
   if(this.selectedPlant == 'all'){
      this.designation = this.designationData;
   }else{
     const filteredDeptDataByPlant=this.designationData.filter((designation:any) => {
      if(designation.plant_code == this.selectedPlant){
        return designation;
      }
    });

    if(filteredDeptDataByPlant.length){
      this.designation = filteredDeptDataByPlant;
    }else{
      this.designation = this.designationData;
      this.messageService.add({severity:'info',summary:`Designation Not Found For Plant: ${this.selectedPlant}`})
    }
   }
  }
}
