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
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class LineComponent implements OnInit {
  closeResult: string;
  form: any
  sample: any = environment.path
  array: any = []
  array2: any = []
  line: any = []
  editing_flag: any;
  plantname: any;
  dept: any
  all_details: any
  selectedPlant = sessionStorage.getItem('plantcode')
  departmentData:any=[]
  lineData:any= []
  temp_a: any;
  index: any = -1;
// material modal template ref
  @ViewChild('content', {read: TemplateRef}) addDepartmentTemplateRef: TemplateRef<unknown> | undefined;
      // Speed Dial items
  items: MenuItem[] = [
            {
                icon: 'pi pi-plus-circle',
                tooltipOptions:{
                  tooltipLabel: 'Add Line',
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
  constructor(private fb: UntypedFormBuilder, private modalService: NgbModal, private service: ApiService, public loader: LoaderserviceService,private messageService:MessageService, private confirmationService:ConfirmationService) {
    this.form = this.fb.group({
      plant_code: ['',],
      plant_name: ['',Validators.required],
      dept_name: ['',Validators.required],
      Line_Name: ['',Validators.required],
      Line_code: ['',],
      personal_subarea: ['',Validators.required],
      modified_by: ['',],
      created_by: ['',],
      module_code: ['',]
    })
  }

  // ng lifecycle
  ngOnInit(): void {
    // get all plants
    this.getplantcode()
    this.service.getline().
      subscribe({
        next: (response) => {
          console.log(response);
          this.line = response;
          this.lineData=response;
          // filter line by plant
          this.filterLineByPlant()
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      });
    // get all departments
    this.getDepartment();
  }

//  export to excel function
  exportexcel(): void {
    // Define the new key names
    const newKeys: any = {
      Line_code: 'Line Code',
      Line_Name: 'Line Name',
      shop_code: 'Shop Code',
      module_code: 'Module Code',
      plant_code: 'Plant Code',
      plant_name:'Plant Name',
      dept_name: 'Department Name',
      Created_By: 'Created by',
      Created_Date: 'Created Date',
      modifiedby: 'modified by',
      Modified_Date: 'Modified Date',
      personal_subarea: 'Personal Subarea'
    };

    // Map the array and transform each object
    const transformedArray: any = this.line.map((obj: any) => {
      const transformedObj: any = {};
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
    XLSX.writeFile(wb, 'line.xlsx');
  }

  // getplant code 
  getplantcode() {
    var company = { 'company_name': sessionStorage.getItem('companycode') }
    this.service.plantcodelist(company)
      .subscribe({
        next: (response) => { 
          console.log(response); 
          this.plantname = response
          this.plantname.push({plant_name:'All',plant_code:''})
         },
        error: (error) => this.messageService.add({severity:'error',summary:error.message}),
      });
  }

  // get all information about plant
  getall(event: any) {
    console.log(event.value)
    this.index = event.value
    var plantcode = { plantcode: event.value}
    this.service.line_dept_design(plantcode)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.all_details = response;
          this.dept = this.all_details[1]
        },
        error: (error) => this.messageService.add({severity:'error',summary:error.message}),
      });
  }

  open(content: any) {
    this.form.get('plant_name').enable()
    this.form.get('dept_name').enable()
    this.editing_flag = false
    this.form.reset();
    console.log("opening")
    this.modalService.open(content, { centered: true })
  }

  opentoedit(content: any) {
    console.log("editing")
    this.modalService.open(content, { centered: true })
  }

  get(event: any) {
    console.log(event.target.value)
  }

  edit(a: any, slno: any) {
    this.editing_flag = true
    this.temp_a = a
    this.form.controls['Line_code'].setValue(slno)
    this.form.controls['plant_name'].setValue(this.line[a].plant_code)
    this.form.controls['Line_Name'].setValue(this.line[a].Line_Name)
    this.form.controls['personal_subarea'].setValue(this.line[a].personal_subarea)
    this.form.controls['plant_code'].setValue(this.line[a].plant_code)

    this.form.controls['modified_by'].setValue(sessionStorage.getItem('user_name'))
    this.form.get('plant_name').disable()
    this.form.get('dept_name').disable()

    var plantcode = { plantcode: this.line[a].plant_code }

    this.service.line_dept_design(plantcode)
      .subscribe({
        next: (response) => {
          console.log(response); 
          this.all_details = response;
          this.dept = this.all_details[1]
        },
        error: (error) => console.log(error),
      });
    this.form.controls['dept_name'].setValue(Number(this.line[a].module_code))

  }

  // add new line
  save() {
    // this.form.get('plant_name').setValue(this.plantname[this.index].plant_code)
    this.form.controls['created_by'].setValue(sessionStorage.getItem('user_name'))
    this.form.controls['module_code'].setValue(this.form.controls['dept_name'].value)

    const maxLineCode = this.line.reduce((prev: any, current: any) => {
      return (Number(prev.Line_code) > Number(current.Line_code)) ? prev : current;
    });


    this.form.controls['Line_code'].setValue(Number(maxLineCode.Line_code) + 1)
    console.log(this.form.value)
    this.service.addline(this.form.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message != 'failure') {
            const index = this.plantname.findIndex((obj: any) => obj.plant_code === this.form.get('plant_name').value);
            this.form.get('plant_name').setValue(this.plantname[index].plant_name)
            const index2 = this.dept.findIndex((obj: any) => obj.dept_slno === this.form.get('dept_name').value);
            this.form.get('dept_name').setValue(this.dept[index2].dept_name)
            this.messageService.add({severity:'info',summary:'Line Added'})
            this.service.getline().
              subscribe({
                next: (response) => {
                  console.log(response); 
                  this.line = response;
                },
                error:(err) => this.messageService.add({severity:'error',summary:err.message})
              })
            this.form.reset()
          }else{
            this.messageService.add({severity:'error',summary:'Cannot Add Line!'})
          }

        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })

  }

  // update line
  editSave() {
    this.form.get('plant_name').enable()
    this.form.get('dept_name').enable()
    this.form.controls['module_code'].setValue(this.form.controls['dept_name'].value)

    this.service.updateline(this.form.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message != 'failure') {
            const index = this.plantname.findIndex((obj: any) => obj.plant_code === this.form.get('plant_name').value);
            this.form.get('plant_name').setValue(this.plantname[index].plant_name)

            const index2 = this.dept.findIndex((obj: any) => obj.dept_slno === this.form.get('dept_name').value);
            this.form.get('dept_name').setValue(this.dept[index2].dept_name)
            this.form.get('dept_name')
            this.line[this.temp_a] = this.form.value
            this.messageService.add({severity:'info',summary:'Line Updated'})
          }else{
            this.messageService.add({severity:'error',summary:'Cannot Update Line!'})
          }
          console.log(this.form.value);
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })
  }
// delete line
  deleteLine(event:Event,a: any, slno: any) {
  console.log(slno)
  this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteLineAPICall(a,slno)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
  }

  deleteLineAPICall(a: any, slno: any){
      this.service.deleteline({ slno: slno })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message == 'success')
            this.line.splice(a, 1);
            this.messageService.add({severity:'info',summary:'Line Deleted.'})
        },
        error:(err) => this.messageService.add({severity:'error',summary:err.message})
      })
  }
  // reset line form
  reset() {
    this.form.reset()
  }

  // get department By plant
  getDepartment(){
    this.service.getdepartment().subscribe({
      next:(response:any) => {
        this.departmentData = this.removeDuplicateValues(response);
        this.departmentData.push({dept_name:'All'})
      },
      error:(err) => this.messageService.add({severity:'error',summary:err.message})
    })
  }

  // filter line by plant
  filterLineByPlant(){
   if(this.selectedPlant == ''){
     this.line = this.lineData;
   }else{
    const filteredLineDataByPlant = this.lineData.filter((line:any) => {
    if(line.plant_code == this.selectedPlant){
      return line;
    }
   })
   if(filteredLineDataByPlant.length){
    this.line = filteredLineDataByPlant
   }else{
    this.line = this.lineData
   }
  }
   }

  // filter line by department

  filterLineByDepartment(event:any){
    const department = event.value;
    if(department == 'All'){
     this.line = this.lineData;
    }else{
       const filteredLineDataByDepartment = this.lineData.filter((line:any) => {
      if(this.selectedPlant){
        if(line.dept_name == department && line.plant_code == this.selectedPlant){
          return line;
        }
      }
    });

    if(filteredLineDataByDepartment.length){
      this.line = filteredLineDataByDepartment;
    }else{
      this.line = this.lineData;
      this.messageService.add({severity:'info',summary:`Line Not Found For Plant:${this.selectedPlant}`})
    }
    }
  }

  // function to remove duplicate values of array of object
  removeDuplicateValues(arrayOfValue:any){
     const uniqueValues = arrayOfValue.reduce((acc:any, current:any) => {
     const x = acc.find((item:any) => item.dept_name === current.dept_name);
     if (!x) {
      return acc.concat([current]);
     } else {
    return acc;
    }
   }, []);

   return uniqueValues;
  }
}
