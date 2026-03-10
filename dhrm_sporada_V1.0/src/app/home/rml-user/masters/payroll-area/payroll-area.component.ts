/**
 * PayrollAreaComponent - Component for managing payroll areas
 *
 * This component handles the creation, reading, updating, and deletion of payroll areas.
 * It provides functionality to filter, search, and export payroll area data.
 *
 * @component
 * @selector app-payroll-area
 * @templateUrl ./payroll-area.component.html
 * @styleUrls ./payroll-area.component.css
 * @method getPayrollArea 
 * @method updatePayrollArea 
 * @method searchPayrollArea
 * @method filterPayrollAreaByPlant
 * @method deletePayrollArea
 * @method deletePayrollAreaAPICall
 * @method addNewPayrollArea
 * @method patchUpdateValue
 */

import { Component, OnInit,ViewChild,TemplateRef} from '@angular/core';
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';
import { FormGroup, UntypedFormBuilder, Validators,FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from "src/environments/environment.prod";
import { PayrollArea } from '../types/payrollArea.type';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-payroll-area',
  templateUrl: './payroll-area.component.html',
  styleUrls: ['./payroll-area.component.css']
})
export class PayrollAreaComponent implements OnInit {
  /**
   * closeResult - Stores the result of modal closing
   * @type {string}
   */
  closeResult: string;

  /**
   * payrollAreaForm - Form group for payroll area data
   * @type {any}
   */
  payrollAreaForm:FormGroup;
  file:any
  new:any
  company:any
  companylist:any
  sample : any = environment.path+'/plant/'
  uploadUrl = environment.path+'/plantupload'
  plantList: any = []
  plantData:any=[];
  payrollAreaList:PayrollArea[] = [];
  payrollAreaCopy:PayrollArea[] = [];
  companyData:any = [];
  selectedPlant:any = '';
  /**
   * editing_flag - Flag to indicate if the form is in edit mode
   * @type {boolean}
   */
  editing_flag: boolean;
  /**
   * sign - Variable to store signature or related data
   * @type {any}
   */
  sign:any = null
  /**
   * inx - Index variable for tracking positions
   * @type {number}
   */
  inx: number;
  /**
   * userDetails - Stores user information
   * @type {any}
   */
  userDetails:any;
  /**
   * all - Stores comprehensive data
   * @type {any}
   */
  all:any;    
  // material modal template ref
  @ViewChild('content', {read: TemplateRef}) addPayrollAreaTemplateRef: TemplateRef<unknown> | undefined;
    /**
   * Speed Dial items configuration
   *
   * This array defines the items for the speed dial component, which provides quick access to common actions.
   * Each item has an icon, tooltip, and command to execute when clicked.
   *
   * @type {MenuItem[]}
   */
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
                this.messageService.add({ severity: 'info', summary: 'Data Exported.' });
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
      PayrollArea:['',[Validators.required,Validators.pattern(/\S+/)]],
      StartDay:['',Validators.required],
      EndDay:['',Validators.required],
      Grace_minutes: ['',Validators.required],
      week_off_eligibility: ['',Validators.required],
      InsertBy:[''],
      UpdateBy:[''],
    })
  }

  ngOnInit(): void {
    /** loged in user data */
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    /** get plants */
    this.service.getplant().
    subscribe({
      next: (response:any) => {
        this.plantList = [...response];
        this.plantList.unshift({plant_code:'',plant_name:'All'})
        this.plantData = response;
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
    /** enable payroll area input */
    this.payrollAreaForm.get('PayrollArea')?.enable();
    this.modalService.open(content, {centered: true})
  }
  
  /**
   * Retrieves payroll area data from the server
   *
   * This function:
   * 1. Calls the API service to get payroll area data
   * 2. On success, stores the response in payrollAreaList and payrollAreaCopy
   * 3. On error, displays an error message to the user
   *
   * @returns {void}
   */
  getPayrollArea(): void {
    this.service.getPayrollArea().subscribe({
      next:(response:any) => {
        console.log(response);
        this.payrollAreaList = response;
        this.payrollAreaCopy = response;
         /** plant filter function */
        this.filterPayrollAreaByPlant();
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }

  /**
   * Adds a new payroll area to the system
   *
   * This function:
   * 1. Sets the InsertBy field with the current user's ID
   * 2. Converts the PayrollArea value to a string
   * 3. Logs the form values for debugging
   * 4. Calls the API service to add the new payroll area
   * 5. Handles success and error responses
   *
   * @returns {void}
   */
  addPayrollArea():void{
    this.payrollAreaForm.controls['InsertBy'].setValue(this.all?.gen_id || 'null');
    // converting payroll area number to string
    this.payrollAreaForm.controls['PayrollArea'].setValue(this.payrollAreaForm.value.PayrollArea.toUpperCase());

    console.log(this.payrollAreaForm.value);
    this.service.addNewPayrollArea(this.payrollAreaForm.value).subscribe({
      next: (response:any) => {
        console.log(response);
        this.messageService.add({severity:'info',summary:response.message})
        this.getPayrollArea();
      },
      error: (error:any) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }

  getValue(event:any){
    console.log(this.payrollAreaForm.value);
  }
   // open material modal for update plant
  opentoedit(content:any){
    console.log("opening")
    const modalRef = this.modalService.open(content, {centered: true});
    
  }

  /** 
   * Patch the form value to update the payroll area
   * @param a user selected data index 
   * @var payrollAreaForm
   * @var payrollAreaList
   * 1. patching user selected data to the update form
   **/
    patchUpdateValue(a:any){
      /** set edititng flag true */
      this.editing_flag = true;
      this.payrollAreaForm.controls['PlantCode'].setValue(this.payrollAreaList[a]?.PlantCode)    
      this.payrollAreaForm.controls['PayrollArea'].setValue(this.payrollAreaList[a]?.PayrollArea)
      this.payrollAreaForm.controls['StartDay'].setValue(this.payrollAreaList[a]?.StartDay)
      this.payrollAreaForm.controls['EndDay'].setValue(this.payrollAreaList[a]?.EndDay);
      this.payrollAreaForm.controls['InsertBy'].setValue(this.payrollAreaList[a]?.InsertBy)
      this.payrollAreaForm.controls['Grace_minutes'].setValue(this.payrollAreaList[a]?.Grace_minutes);
      this.payrollAreaForm.controls['week_off_eligibility'].setValue(this.payrollAreaList[a]?.week_off_eligibility);
      this.payrollAreaForm.controls['UpdateBy'].setValue(this.all?.gen_id);
      console.log(this.payrollAreaForm.value);
      /** disable payroll area */
      this.payrollAreaForm.get('PayrollArea')?.disable();

    }


  /**
   * Updates the payroll area with the current form values
   *
   * This function:
   * 1. Converts PayrollArea and Grace_minutes to string  
   * 2. Sets the UpdateBy field with the current user's ID
   * 3. Logs the form values for debugging
   * 4. Calls the API service to update the payroll area
   * 5. Handles success and error responses
   *
   * @returns {void}
   */
  updatepayrollArea(): void{
    this.payrollAreaForm.controls['Grace_minutes'].setValue(String(this.payrollAreaForm.value.Grace_minutes));
    this.payrollAreaForm.controls['UpdateBy'].setValue(this.all?.gen_id || 'null');
    console.log(this.payrollAreaForm.value);
    this.service.updatePayrollArea(this.payrollAreaForm.getRawValue()).subscribe({
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
  /**
   * Deletes a payroll area after user confirmation
   *
   * This function:
   * 1. Shows a confirmation dialog to the user
   * 2. If confirmed, calls the API to delete the payroll area
   * 3. If rejected, shows an error message
   *
   * @param {Event} event - The event that triggered the deletion
   * @param {any} a - The index of the payroll area to delete in the payrollAreaList array
   * @returns {void}
   */
  deletePayrollArea(event:Event,a:any): void{
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

  /**
   * Deletes a payroll area from the system
   *
   * This function:
   * 1. Creates a deleteData object with PlantCode and PayrollArea from the specified index
   * 2. Logs the deleteData for debugging purposes
   * 3. Calls the API service to delete the payroll area
   * 4. Handles success and error responses
   *
   * @param {any} a - The index of the payroll area to delete in the payrollAreaList array
   * @returns {void}
   */
  deletePayrollAreaAPICall(a:any): void{
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
  /**
   * Filters payroll areas by plant code
   *
   * This function:
   * 1. Extracts the plant code from the event
   * 2. If the plant code is 'all', shows all payroll areas
   * 3. Otherwise, filters payroll areas by the specified plant code
   * 4. If no matching payroll areas are found, shows an info message
   * @property {any} selectedPlant
   * @returns {void}
   **/
  filterPayrollAreaByPlant(): void{
    if(this.selectedPlant == ''){
      this.payrollAreaList = this.payrollAreaCopy;
    }else{
      const filteredPayrollAreaData = this.payrollAreaCopy.filter((payrollArea:any) => {
      if(payrollArea.PlantCode == this.selectedPlant){
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

  
  /**
   * Searches for payroll areas based on user input
   *
   * This function:
   * 1. Extracts the search term from the input event
   * 2. Filters the payroll area list based on matching PlantCode or PayrollArea
   * 3. Updates the displayed payroll area list with the filtered results
   * 4. If no matches are found, resets to the original list
   *
   * @param {Event} event - The input event containing the search term
   * @returns {void}
   */
  searchPayrollArea(event:any): void{
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
