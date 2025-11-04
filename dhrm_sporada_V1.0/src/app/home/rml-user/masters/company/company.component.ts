import { Component, OnInit, ViewEncapsulation,LOCALE_ID,Inject,ViewChild,TemplateRef} from '@angular/core';
import { formatDate } from '@angular/common';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from "src/environments/environment.prod";
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastService } from 'angular-toastify';
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';

const material = [
  MatSidenav,
  MatTableModule
];

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyComponent implements OnInit {
  closeResult: string;
  form:any;
  sample: any = environment.path
  year: any
  month: any
  day: any
  date: any
  dummy: any = []
  userDetails:any;
  all:any;
  // reference variable for company data
  companyData:any = [];
  status = [{label:'Active',value:'Active'},{label:'In-Active',value:null}]
  editing_flag: any;
  // add company template reference
   @ViewChild('content', {read: TemplateRef}) addCompanyTemplateRef: TemplateRef<unknown> | undefined;
  // Speed Dial items
  items: MenuItem[] = [
            {
                icon: 'pi pi-plus-circle',
                tooltipOptions:{
                  tooltipLabel: 'Add Company',
                },
                command: () => {
                    this.open(this.addCompanyTemplateRef);
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
  activeIndex:number = 0;
  constructor(private fb: UntypedFormBuilder, private modalService: NgbModal, private service: ApiService, public loader: LoaderserviceService, public router:Router,@Inject(LOCALE_ID) private locale: string, private toast:ToastService, private messageService: MessageService,private confirmationService: ConfirmationService) {

    this.form = this.fb.group({
      sno: ['',],
      company_code: ['',[Validators.required,Validators.pattern(/\S+/)]],
      company_name: ['',[Validators.required,Validators.pattern(/\S+/)]],
      created_on: ['',],
      created_by: ['',],
      modified_on: ['',],
      modified_by: ['',],
    })
  }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    
    this.getCompanyList();
  }

  /**
   * @function
   * Get the company list
   * response stored in @var dummy
   */

  getCompanyList(){
    this.service.companyshow().
      subscribe({
        next: (response) => { 
          this.dummy = response;
          // assign response to companyData for filter
          this.companyData= response;
        },
        error: (err) => this.messageService.add({severity:'error', summary:err.message})
      })
  }

  /**
   * 
   * @param content material UI modal refernence
   * @description opens the Material Modal UI
   */
  open(content: any) {
    this.form.reset();
    this.editing_flag = false
    console.log("opening")
    this.modalService.open(content, { centered: true })
  }

  /**
   * 1. format date to current date YYYY-MM-DD
   * @property {year}
   * @property {month}
   * @property {year}
   * @property {date} has current date YYYY-MM-DD
   */
  date_format() {
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.day = new Date().getDate();
    this.date = this.year + '-' + this.month + '-' + this.day
  }

/**
 * @property {form}
 * @property {service} has @function companyadd @type {Observable} to add new company
 * @property {messageService} primeng notification service
 * @function getCompanyList refresh the data
 * 1. add company data
 * 2. update created_on value using @property {date}
 * 3. update created_by using @global session storage data 
 */
  save() {
    this.date_format()
    this.form.controls['created_on'].setValue(this.date)
    console.log(this.month)
    this.form.controls['created_by'].setValue(sessionStorage.getItem('emp_name'));

    /** add new company api call */
    this.service.companyadd(this.form.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if(response.message == 'success'){
            this.messageService.add({severity:'info', summary:'Company Added Successfully.'})
          }
          if (response.message == 'already') {
           this.messageService.add({severity:'warn', summary:'Company with same code already exists'})
          }
          else {
            this.getCompanyList() // to get update data
            this.form.reset() // form reset
            console.log(this.form.value)
          }
        },
        error: (err) => this.messageService.add({severity:'error', summary:err.message})
      })

  }

  opentoedit(content: any) {
    console.log("opening")
    this.modalService.open(content, { centered: true })
  }

  /**
   * 
   * @param a user selected data array index
   */
  edit(a: any) {
    console.log("-----------", a)

    this.editing_flag = true
    this.form.controls['sno'].setValue(a)
    this.form.controls['company_code'].setValue(this.dummy[a].company_code)
    this.form.controls['company_name'].setValue(this.dummy[a].company_name)
    console.log(this.editing_flag)
  }

  /**
   * @description used to update company modifided-by and modified on
   * @property {form} @type {any}
   * @function data_format
   */
  editSave() {

    this.date_format()
    this.form.controls['modified_on'].setValue(this.date)
    this.form.controls['modified_by'].setValue(sessionStorage.getItem('emp_name'))
    this.updateCompanyDetails(this.form.value);
  }

  /**
   * 
   * @param updateData updated company data
   * @returns {void}
   */
  updateCompanyDetails(updateData:any):void{
     this.service.companyedit(updateData)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if(response.message == 'success'){
            this.messageService.add({severity:'info', summary:'Company Updated Successfully.'})
          }
          if (response.message == 'already') {
            this.messageService.add({severity:'warn', summary:'Company with same code already exists'})
          }
          else {
            this.form.controls['created_on'].setValue(this.dummy[this.form.controls['sno'].value].created_on)
            this.form.controls['created_by'].setValue(this.dummy[this.form.controls['sno'].value].created_by)

            this.getCompanyList()
          }
        },
        error: (err) => this.messageService.add({severity:'error', summary:err.message})
      })
  }

/**
 * 
 * @param event click eevnt to get the target element for Prime NG confimation service
 * @param a index of user selected data to delete data
 */
  deleteCompany(event:Event,a: any) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteCompanyAPICall(a)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
  }

  /**
   * 
   * @param a index of user selected data
   * @property {dummy} has the company data
   * 1. splice the deleted inde form the array
   */
  deleteCompanyAPICall(a:any){
         this.service.companydel(this.dummy[a])
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message == 'success')
            this.messageService.add({severity:'info', summary:'Company Deleted Successfully.'})
            this.dummy.splice(a, 1)
        },
        error: (err) => this.messageService.add({severity:'error', summary:err.message})
      })
  }
// export compnay details function
  exportexcel(): void {

    // Define the new key names
    const newKeys:any = {
      company_code: 'Company Code',
      company_name: 'Company Name',
      status: 'Active Status',
      created_on: 'Created On',
      created_by: 'Created By',
      modified_on: 'Modified On',
      modified_by: 'Modified By',


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
    XLSX.utils.book_append_sheet(wb, ws, "company");
    XLSX.writeFile(wb, "company.xlsx");

  }

  reset() {
    this.form.reset()
  }

  /** 
   * 1. formatting api company response date [26/20/2025] to [20-Jan-2025] 
   * @param date @type {string} date to format
   * @return {formattedDate} @type {string}
   * 
  */
  formatApiDate(date:string):string{
    const splittedDate = date.split('/');
    const organizedDate = `${splittedDate[1]+'/'+splittedDate[0]+'/'+splittedDate[2]}`
    const jsDate = new Date(organizedDate)
    const formattedDate = formatDate(jsDate,'dd-MMM-YYYY',this.locale)
    return formattedDate;
  }

 /**
  * 
  * @param event change event has the user selected status value
  * @property {companyData} has the copy of the company data
  * @var filteredData has filtered company data 
  */ 
  filterCompanyByStatus(event:any){
    const status = event.value;
    const filteredData = this.companyData.filter((company:any) => {
      if(company.status == status){
        return company
      }
    })
   if(!filteredData.length){
    this.messageService.add({severity:'info',summary:'Data Not Found!'})
    this.dummy = this.companyData;
   }else{
    this.dummy = filteredData;
   }
   
   console.log(filteredData)
  }

  /**
   * 
   * @param event input event has user entered value
   * @var searchTerm has user entered value
   * @var filteredData has filtered data
   * @property {companyData} has company data.
   */
  searchByCompanyOrCode(event:any){
     const searchTerm = event.target.value;
    const filteredData = this.companyData.filter((company:any) => {
      if(company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) 
        || company.company_code === searchTerm){
        return company
      }
    })
   if(!filteredData.length){
    this.dummy = this.companyData;
   }else{
    this.dummy = filteredData;
   }
   
   console.log(filteredData)
  }

}
