/**
 * costCenterComponent - Component for managing cost centers
 *
 * This component handles the creation, reading, updating, and deletion of cost centers.
 * It provides functionality to filter, search, and export cost center data.
 *
 * @component
 * @selector app-cost-center
 * @templateUrl ./cost-center.component.html
 * @styleUrls ./cost-center.component.css
 * @method getCostCenter 
 * @method updateCostCenter 
 * @method searchCostCenter
 * @method filterCostCenterByPlant
 * @method deleteCostCenter
 * @method deleteCostCenterAPICall
 * @method addNewCostCenter
 * @method patchUpdateValue
 * 
 */

import { Component, OnInit,ViewChild,TemplateRef} from '@angular/core';
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from "src/environments/environment.prod";
import * as XLSX from 'xlsx';
@Component({
   selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.css']
})
export class CostCenterComponent implements OnInit {
  /**
   * closeResult - Stores the result of modal closing
   * @type {string}
   */
  closeResult: string;

  /**
   * costCenterForm - Form group for cost center data
   * @type {any}
   */
  costCenterForm:any;
  costCenterList:any = [];
  costCenterCopy:any = this.costCenterList;
  companyList:any = [];
  companyListCopy:any = [];
  selectedCompany:any = JSON.parse(sessionStorage.getItem('companyCode') || '');
  selectedPlant:any= sessionStorage.getItem('plantcode');
  selectedDepartment:any = sessionStorage.getItem('dept_slno');
  plantList: any = [];
  plantData:any=[]; 
  departmentList:any[];

  /**
   * editing_flag - Flag to indicate if the form is in edit mode
   * @type {boolean}
   */
  editing_flag: boolean;
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
  @ViewChild('content', {read: TemplateRef}) addCostCenterTemplateRef: TemplateRef<unknown> | undefined;
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
                  tooltipLabel: 'Add Cost Center',
                },
                command: () => {
                    this.open(this.addCostCenterTemplateRef);
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
     this.costCenterForm = this.fb.group({
      companyCode:['',Validators.required],
      plantCode:['',Validators.required],
      departmentCode:['',Validators.required],
      costCenter:['',[Validators.pattern(/\S+/),Validators.required]],
      InsertBy:[],
      UpdateBy:[],
    })
  }

  ngOnInit(): void {
    /** logged in user details */
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    /** get cost center and filter data */
    this.getCompanyList();
    this.getcostCenter();
    this.getPlantDataByCompanyCode(this.selectedCompany);
    this.getDepartmentByPlantCode(this.selectedPlant);
  }
  
  // open material modal function for add plant
  open(content:any){
    this.costCenterForm.reset();
    this.editing_flag = false
    console.log("opening")
    this.modalService.open(content, {centered: true})
  }
  
  /**
   * Retrieves cost center data from the server
   * @function getCostCenter
   * @description
   * 1. Calls the API service to get cost center data
   * 2. On success, stores the response in costCenterList and costCenterCopy
   * 3. On error, displays an error message to the user
   * @returns {void}
   */
  getcostCenter(): void {
    const data = {
      companyCode:this.selectedCompany,
      plantCode:this.selectedPlant,
      departmentCode:this.selectedDepartment
    }
    this.service.getCostCenter(data).subscribe({
      next:(response:any) => {
        console.log(response);
        this.costCenterList = response;
        this.costCenterCopy = response;
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }

  /**
   * Adds a new cost center to the system
   *
   * This function:
   * 1. Sets the InsertBy field with the current user's ID
   * 2. Converts the costCenter value to a string
   * 3. Logs the form values for debugging
   * 4. Calls the API service to add the new cost center
   * 5. Handles success and error responses
   *
   * @returns {void}
   */
  addcostCenter():void{
    this.costCenterForm.controls['InsertBy'].setValue(this.all?.gen_id || 'null');
    // converting cost center to uppercase
    this.costCenterForm.controls['costCenter'].setValue(this.costCenterForm.value.costCenter.toUpperCase());
    // converting string into number
    this.costCenterForm.controls['companyCode'].setValue(Number(this.costCenterForm.value.companyCode))
    this.costCenterForm.controls['plantCode'].setValue(Number(this.costCenterForm.value.plantCode))

    console.log(this.costCenterForm.value);
    // this.service.addNewPayrollArea(this.costCenterForm.value).subscribe({
    //   next: (response:any) => {
    //     console.log(response);
    //     this.messageService.add({severity:'info',summary:response.message})
    //     this.getcostCenter();
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     this.messageService.add({severity:'error',summary:error.message})
    //   }
    // })
  }

  getValue(event:any){
    console.log(this.costCenterForm.value);
  }
   // open material modal for update plant
  opentoedit(content:any){
    console.log("opening")
    this.modalService.open(content, {centered: true});
  }

  /** 
   * Patch the form value to update the cost center
   * @param a user selected data index 
   * @var costCenterForm
   * @var costCenterList
   * 1. patching user selected data to the update form
   **/
    patchUpdateValue(a:any){      
      this.editing_flag = true
      this.costCenterForm.controls['companyCode'].setValue(this.costCenterList[a]?.CompanyCode)    
      this.costCenterForm.controls['costCenter'].setValue(this.costCenterList[a]?.CostCenter)
      this.costCenterForm.controls['departmentCode'].setValue(this.costCenterList[a].DepartmentCode)
      this.costCenterForm.controls['plantCode'].setValue(this.costCenterList[a].PlantCode);
      this.costCenterForm.controls['InsertBy'].setValue(this.costCenterList[a].InsertBy);
      // while updating setting update use gen id
      this.costCenterForm.controls['UpdateBy'].setValue(this.all?.gen_id);
      console.log(this.costCenterForm.value);
      /** get department & plant */
      this.getPlantDataByCompanyCode(this.costCenterList[a].CompanyCode);
      this.getDepartmentByPlantCode(this.costCenterList[a].PlantCode);
    }


  /**
   * Updates the cost center with the current form values
   *
   * This function:
   * 1. Converts costCenter and Grace_minutes to string  
   * 2. Sets the UpdateBy field with the current user's ID
   * 3. Logs the form values for debugging
   * 4. Calls the API service to update the cost center
   * 5. Handles success and error responses
   *
   * @returns {void}
   */
  updatecostCenter(): void{
    this.costCenterForm.controls['costCenter'].setValue(String(this.costCenterForm.value.costCenter));
    this.costCenterForm.controls['Grace_minutes'].setValue(String(this.costCenterForm.value.Grace_minutes));
    this.costCenterForm.controls['UpdateBy'].setValue(this.all?.gen_id || 'null');
    console.log(this.costCenterForm.value);
    this.service.updatePayrollArea(this.costCenterForm.value).subscribe({
      next: (response:any) => {
        console.log(response);
         this.messageService.add({severity:'info',summary:response.message});
         this.getcostCenter();
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }
  /**
   * Deletes a Cost Center after user confirmation
   *
   * This function:
   * 1. Shows a confirmation dialog to the user
   * 2. If confirmed, calls the API to delete the Cost Center
   * 3. If rejected, shows an error message
   *
   * @param {Event} event - The event that triggered the deletion
   * @param {any} a - The index of the Cost Center to delete in the costCenterList array
   * @returns {void}
   */
  deletecostCenter(event:Event,a:any): void{
    this.confirmationService.confirm({
          target: event.target as EventTarget,
              message: 'Are you sure you want to Delete?',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {this.deletecostCenterAPICall(a)},
              reject: () => {
                  this.messageService.add({ severity: 'error', summary: 'Rejected'});
              }
        })
  }

  /**
   * Deletes a Cost Center from the system
   *
   * This function:
   * 1. Creates a deleteData object with PlantCode and costCenter from the specified index
   * 2. Logs the deleteData for debugging purposes
   * 3. Calls the API service to delete the Cost Center
   * 4. Handles success and error responses
   *
   * @param {any} a - The index of the Cost Center to delete in the costCenterList array
   * @returns {void}
   */
  deletecostCenterAPICall(a:any): void{
    const deleteData = {
      PlantCode:this.costCenterList[a].PlantCode,
      costCenter:this.costCenterList[a].costCenter
    };
    console.log(deleteData)
    this.service.deletePayrollArea(deleteData).subscribe({
      next: (response:any) => {
        console.log(response);
         this.messageService.add({severity:'info',summary:response.message});
         this.getcostCenter();
      },
      error: (error) => {
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }
  
  // download cost center in excel
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
    const transformedArray:any = this.costCenterList.map((obj:any) => {
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
    XLSX.utils.book_append_sheet(wb, ws, 'CostCenterMaster');
    XLSX.writeFile(wb, 'cost_center_master.xlsx');
  }

  reset(){
  this.costCenterForm.reset()
  }
  
  /**
   * Filters cost centers by plant code
   *
   * This function:
   * 1. Extracts the plant code from the event
   * 2. If the plant code is 'all', shows all cost centers
   * 3. Otherwise, filters cost centers by the specified plant code
   * 4. If no matching cost centers are found, shows an info message
   *
   * @param {Event} event - The event containing the plant code to filter by
   * @returns {void}
   **/
  filterCostCenterByCompany(): void{
    if(this.selectedCompany == ''){
      this.costCenterList = this.costCenterCopy;
    }else{
      const filteredcostCenterData = this.costCenterCopy.filter((costCenter:any) => {
      if(costCenter.company_code == this.selectedCompany){
        return costCenter;
      }
    })
    if(filteredcostCenterData.length){
      this.costCenterList= filteredcostCenterData;
    }else{
      this.costCenterList = this.costCenterCopy;
      this.messageService.add({severity:'info',summary:'Cost Center Not Found!'})
    }
    }
  }

  
  /**
   * Searches for cost centers based on user input
   *
   * This function:
   * 1. Extracts the search term from the input event
   * 2. Filters the cost center list based on matching PlantCode or costCenter
   * 3. Updates the displayed cost center list with the filtered results
   * 4. If no matches are found, resets to the original list
   *
   * @param {Event} event - The input event containing the search term
   * @returns {void}
   */
  searchCostCenter(event:any): void{
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm)
    const foundcostCenter = this.costCenterCopy.filter((costCenter:any) => {
      if(costCenter?.plant_name.toLowerCase() == searchTerm || costCenter.CostCenter.toLowerCase() == searchTerm){
        return costCenter;
      }
    });
    console.log(foundcostCenter)
    if(foundcostCenter.length){
      this.costCenterList = foundcostCenter;
    }else{
      this.costCenterList = this.costCenterCopy;
    }
  }

  /**
   * @function getCompanyList
   * 
   * This function
   * 1. get the all company list 
   * 2. Data stored in @var companyList
   * @return {void} 
   */

  getCompanyList():void {
    this.service.getCompanyCode().subscribe({
      next: (response:any) => {
        this.companyList = [...response];
        this.companyList.unshift({company_code:'',company_name:'All'});
        this.companyListCopy = response;
      },
      error: (error) => this.messageService.add({severity:'error',summary:error.message})
    })
  }

  /**
   * @function getPlantDataByCompanyCode
   * 
   * This function
   * 1. get the all plant data based on the company 
   * 2. Data stored in @var plantList
   * @return {void} 
   */
  getPlantDataByCompanyCode(companyCode:any):void{
       this.service.getPlantByCompanyCode(companyCode).subscribe({
        next: (response) => {
          this.plantList = response;
        },
        error: (error) => this.messageService.add({severity:'error',summary:error.message})
       })
  }
/**
   * @function getDepartmentByPlantCode
   * 
   * This function
   * 1. get the all department data by plant code
   * 2. Data stored in @var departmentList
   * @return {void} 
   */
  getDepartmentByPlantCode(plantCode:any):void{
     this.service.getDeptForReport(plantCode).subscribe({
      next: (response:any) => {
       this.departmentList = response.data;
      },
      error: (error) => this.messageService.add({severity:'error',summary:error.message})
    })
  }
}
