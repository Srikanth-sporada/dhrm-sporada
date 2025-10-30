import { Component, OnInit, ViewEncapsulation,ViewChild,TemplateRef } from '@angular/core';
import { UntypedFormBuilder,Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from "src/environments/environment.prod";
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';
import moment from 'moment';

const material = [
  MatSidenav,
  MatTableModule
];
@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShiftComponent implements OnInit {
  closeResult: string;
  form: any
  sample: any = environment.path
  plant_name: any
  plant: any
  shift: any = []
  editing_flag: any;
  temp_a: any;
  type: any = [{value:'S'},{value:'R'}]
  security_shift: any = [{value:'Y'},{value:'N'}]
  shiftData:any = []
  selectedPlant:any = 'all';
  // material modal template ref
    @ViewChild('content', {read: TemplateRef}) addShiftTemplateRef: TemplateRef<unknown> | undefined;
  // Speed Dial items
    items: MenuItem[] = [
              {
                  icon: 'pi pi-plus-circle',
                  tooltipOptions:{
                    tooltipLabel: 'Add Shift',
                  },
                  command: () => {
                      this.open(this.addShiftTemplateRef);
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
      shift_id: [''],
      shift_desc: ['',Validators.required],
      plant_desc: [''],
      plant_code: ['',Validators.required],
      act_tm_from: ['',Validators.required],
      in_tm_max: ['',Validators.required],
      in_tm_min: ['',Validators.required],
      act_tm_to: ['',Validators.required],
      type: ['',Validators.required],
      shift_group: ['',Validators.required],
      security_shift: ['',Validators.required],
      coff_eligible_hours: ['',Validators.required]
    })
  }

  // ng lifecyclehook
  ngOnInit(): void {
    this.getPlantData();
    this.getShiftData();
  }

  /** get shift data api call */
  getShiftData(){
    this.service.getshift().
      subscribe({
        next: (response: any) => {
          this.shift = response;
          this.shiftData = response; 
          console.log(response);
          /** filter function */
          this.filterShiftByPlant();
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })
  }
  /** get plant data api call */
  getPlantData(){
     this.service.getplant().
      subscribe({
        next: (response: any) => {
          this.plant = response;
          this.plant.unshift({plant_name:'All',plant_code:'all'})
        },
        error: (err) => this.messageService.add({severity:'error',summary:err.messaage})
      })
  }
  // setting plant decription to form value
  pp(event: any) {
    console.log(event.value)
    const plant = this.plant.filter((plant:any) => {
      if(plant.plant_code == event.value){
        return plant;
      }
    })
    this.form.controls['plant_desc'].setValue(plant[0].plant_name)
    console.log(this.form.value);
  }

  open(content: any) {
    this.form.reset()
    this.editing_flag = false
    console.log("opening")
    this.modalService.open(content, { centered: true })
  }

  // add shift function
  save() {
    // date object to time format using moment
    this.form.controls['act_tm_from'].setValue(moment(this.form.controls['act_tm_from'].value).format("HH:mm:ss"));
    this.form.controls['act_tm_to'].setValue(moment(this.form.controls['act_tm_to'].value).format("HH:mm:ss"));
    this.form.controls['in_tm_min'].setValue(moment(this.form.controls['in_tm_min'].value).format("HH:mm:ss"));
    this.form.controls['in_tm_max'].setValue(moment(this.form.controls['in_tm_max'].value).format("HH:mm:ss"));
    console.log(this.form.value)
    this.service.addshift(this.form.value)
      .subscribe({
        next: (response: any) => {
          if(response.message == 'inserted'){
            console.log(response);
          this.service.getshift().
            subscribe({
              next: (response: any) => {
                this.shift = response;
                this.shiftData= response; 
                console.log(response);
                this.filterShiftByPlant();
              },
              error:(err) => this.messageService.add({severity:'error',summary:err.message})
            })
          this.form.reset();
          this.messageService.add({severity:'info',summary:'Shift Added!'})
          }else{
            this.messageService.add({severity:'info',summary:'Cannot Add Shift!'})
          }
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })

  }

  opentoedit(content: any) {
    console.log("opening")
    this.modalService.open(content, { centered: true })
  }

  edit(a: any, slno: any) {
    this.form.reset()
    this.temp_a = a
    this.editing_flag = true
    this.form.controls['plant_desc'].setValue(this.shift[a].plant_desc)
    this.form.controls['shift_id'].setValue(slno)
    this.form.controls['plant_code'].setValue(String(this.shift[a].plant_code))
    this.form.controls['shift_desc'].setValue(this.shift[a].shift_desc)
    this.form.controls['act_tm_from'].setValue(this.shift[a].Shift_Start)
    this.form.controls['act_tm_to'].setValue(this.shift[a].Shift_End)
    this.form.controls['in_tm_max'].setValue(this.shift[a].Max_Time)
    this.form.controls['in_tm_min'].setValue(this.shift[a].Min_Time)
    this.form.controls['shift_group'].setValue(this.shift[a].shift_group)
    this.form.controls['type'].setValue(this.shift[a].type)
    this.form.controls['security_shift'].setValue(this.shift[a].security_shift)
    this.form.controls['coff_eligible_hours'].setValue(this.shift[a].coff_eligible_hours)
    console.log(this.form.value)
    // this.form.get('plant_code').disable()
  }

  // update function
  editSave() {
    // date object to time format using moment
    if(this.form.get('act_tm_from')?.dirty){
      this.form.controls['act_tm_from'].setValue(moment(this.form.controls['act_tm_from'].value).format("HH:mm:ss"));
    }
    if(this.form.get('act_tm_to')?.dirty){
      this.form.controls['act_tm_to'].setValue(moment(this.form.controls['act_tm_to'].value).format("HH:mm:ss"));
    }
    if(this.form.get('in_tm_min')?.dirty){
      this.form.controls['in_tm_min'].setValue(moment(this.form.controls['in_tm_min'].value).format("HH:mm:ss"));
    }
    if(this.form.get('in_tm_max')?.dirty){
      this.form.controls['in_tm_max'].setValue(moment(this.form.controls['in_tm_max'].value).format("HH:mm:ss"));
    }
    console.log(this.form.value);
    this.service.updateshift(this.form.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message == 'updated') {
            this.form.controls['act_tm_from'].setValue('T' + this.form.controls['act_tm_from'].value + '.')
            this.form.controls['act_tm_to'].setValue('T' + this.form.controls['act_tm_to'].value + '.')
            this.form.controls['in_tm_max'].setValue('T' + this.form.controls['in_tm_max'].value + '.')
            this.form.controls['in_tm_min'].setValue('T' + this.form.controls['in_tm_min'].value + '.')
            this.service.getshift().
              subscribe({
                next: (response: any) => {
                  this.shift = response;
                  this.shiftData=response; 
                  console.log(response);
                  this.filterShiftByPlant();
                },
                error:(err) => this.messageService.add({severity:'error',summary:err.message})
              });
              this.messageService.add({severity:'info',summary:'Shift Updated!'})
          }else{
            this.messageService.add({severity:'error',summary:'cannot Update Shift!'})
          }
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })
  }
 
  // delete function
  deleteShift(event:Event,a: any, slno: any) {
    console.log(slno)
    this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteShiftAPICall(a,slno)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
  }

  // delete shift api call
  deleteShiftAPICall(a: any, slno: any){
     this.service.deleteshift({ slno: slno })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message == 'success')
            this.shift.splice(a, 1);
            this.messageService.add({severity:'info',summary:'Shift Deleted.'})
        }
      })
  }
  // export to excel function
  exportexcel(): void {
    const newKeys:any = {
      shift_id: 'Shift ID',
      plant_code: 'Plant Code',
      plant_desc: 'Plant Name',
      shift_desc: 'Shift Description',
      Shift_Start: 'Shift Start Time',
      Shift_End: 'Shift End Time',
      Min_Time: 'Minimum Time',
      Max_Time: 'Maximum Time',
      type: 'Shift Type',
      shift_group: 'Shift Group',
      security_shift: 'Security Shift',
      coff_eligible_hours: 'Comp Off Eligible Hours',
    };

    // Map the array and transform each object
    const transformedArray:any = this.shift.map((obj:any) => {
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
    XLSX.writeFile(wb, 'shift.xlsx');
  }

  reset() {
    this.form.reset()
  }
  // filter shift by plant
  filterShiftByPlant(){
   if(this.selectedPlant == 'all'){
    this.shift = this.shiftData;
   }else{
     const filteredShiftDataByPlant = this.shiftData.filter((shift:any) => {
       if(shift.plant_code == this.selectedPlant){
        return shift;
       }
    })
    if(filteredShiftDataByPlant.length){
      this.shift = filteredShiftDataByPlant;
    }else{
      this.shift = this.shiftData;
      this.messageService.add({severity:'info',summary:`Shift Not Found For Plant: ${this.selectedPlant}`})
    }
   }
  }
}
