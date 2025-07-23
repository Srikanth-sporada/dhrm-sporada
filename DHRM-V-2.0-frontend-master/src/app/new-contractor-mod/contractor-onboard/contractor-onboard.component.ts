import { Component, OnInit,ViewChild } from '@angular/core';
import { FormArray, FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import {ConBasicDetails} from './contractor-model'
import { MatVerticalStepper } from '@angular/material/stepper';
import {ClamAPIService} from '../clam-api.service'
import { FormService } from '../../home/rml-user/new-joiners/form.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { LoaderComponent } from '../../loader/loader.component';
import {LoaderserviceService} from '../../loaderservice.service'
import { environment } from 'src/environments/environment.prod';
import * as XLSX from'xlsx';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contractor-onboard',
  templateUrl: './contractor-onboard.component.html',
  styleUrls: ['./contractor-onboard.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  ],


})
export class ContractorOnboardComponent implements OnInit {
  @ViewChild(MatVerticalStepper) stepper!: MatVerticalStepper;
  @ViewChild('fileInput') fileInput: any;
  fileName: string | null = null;
  selectedFile: File | null 
  selectedFileName: string | null = null;
  fileUrl: SafeUrl | null = null;
	license_file_name: any = ''
  
	url: any = environment.path+'/'

activeData:any;
  contractorBasicDetails:FormGroup;
  contractorLicenseDetails:FormGroup;
  searchForm: FormGroup;
  contractorForm=false;
  file_list: Array<string> = [];

  file_store: FileList;
  showAdd :boolean;
  showUpdate: boolean;
  submit1:boolean;
  submit2:boolean;
  License_file: File|null = null;
  plantArr:any
  size:any
	flag_for_size:any = false
  isServiceChargePercentEnabled = true;
  isServiceChargeChargeEnabled = true;
  basicDetailsObj: ConBasicDetails = new ConBasicDetails();
  contractorData:any;
  plant_Code: any = sessionStorage.getItem('plantcode');
  plant_Id: any;
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  // IsAdmin:string |null = sessionStorage.getItem('is_admin');
  edit:boolean=true;
  submitted = false;
code:any;
license_file:any=''
searchResults:any;

issupervisor : string |null = sessionStorage.getItem('issupervisor');
ishrappr:string |null= sessionStorage.getItem('ishrappr')
isadmin:string |null= sessionStorage.getItem('isadmin')
ishr:string |null= sessionStorage.getItem('ishr')


  constructor(private fb:FormBuilder ,private dialog: MatDialog, private api:ClamAPIService,private service: FormService, private sanitizer: DomSanitizer,public loader: LoaderserviceService){

}




  ngOnInit(): void {
    this.contractorBasicDetails=this.fb.group({
    
      cont_code:[''],
      plant_Code:[''],
      contraCompName:['',{validators : [Validators.required, Validators.minLength(3)],updateOn: 'blur'}],
      contrOwnerName:['',{validators : [Validators.required, Validators.minLength(3)],updateOn: 'blur'}],
      contraOwnerNumber:['',{validators : [Validators.required, Validators.pattern(("[0-9]\\d{9}"))],updateOn: 'blur'}],
      contraOwnerEmail:['', {validators: [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],updateOn: 'blur'}],
      pocPerson:[''],
      number:['',{validators : [Validators.pattern(("[0-9]\\d{9}"))],updateOn: 'blur'}],
      email:['', {validators: [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],updateOn: 'blur'}],
      address:['',{validators : [Validators.required, ],updateOn: 'blur'}],
    })


    this.contractorLicenseDetails=this.fb.group({
      Sap_vendor_Code:['',{validators : [Validators.required, ],updateOn: 'blur'}],
      panNo:[''],
      gstNo:[''],
      esiEmpCode:[''],
      pFEmpCode:[''],
      License_Attachment:[''],
      License_File:[''],
      status:['',{validators : [Validators.required, ],updateOn: 'blur'}],
      is_Security:['N',{validators : [Validators.required, ],updateOn: 'blur'}],
      MaxHeadLimit:['',{validators : [Validators.required, ],updateOn: 'blur'}],
      L_Number:['',{validators : [Validators.required, ],updateOn: 'blur'}],
      L_Valid_From:['',{validators : [Validators.required, ],updateOn: 'blur'}],
      L_Valid_To:['',{validators : [Validators.required, ],updateOn: 'blur'}],
    EffectIveDate:['',{validators : [Validators.required, ],updateOn: 'blur'}],
    serviceOption:['Y',{validators : [Validators.required, ],updateOn: 'blur'}],
    
    serviceChargePercent:[null,{validators : [Validators.required, ],updateOn: 'blur'}],
    serviceChargeValue:[null,{validators : [Validators.required, ],updateOn: 'blur'}],
    serviceTax:['',{validators : [Validators.required, ],updateOn: 'blur'}]
    })

this.getAllContractor();
this.createConCode()
this.getPlant()


this.searchForm = this.fb.group({
  searchParams: ['']
});


  }

  // onInputKeyDown(event: KeyboardEvent): void {
  //   const value = (event.target as HTMLInputElement).value;
  //   if (value.length === 3) {
  //     event.preventDefault();
  //   }
  // }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.length > 3) {
      inputElement.value = value.slice(0, 3);
      this.contractorLicenseDetails.patchValue({ MaxHeadLimit: value.slice(0, 3) });
    }
  }
  mobileNumber(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.length > 10) {
      inputElement.value = value.slice(0, 10);
      this.contractorBasicDetails.patchValue({ [controlName]: value.slice(0, 10) });
    }
  }
  sapNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.length > 7) {
      inputElement.value = value.slice(0, 7);
      this.contractorLicenseDetails.patchValue({ Sap_vendor_Code: value.slice(0, 7) });
    }
  }

  

  onServiceOptionChange(event: any) {
    const selectedValue = event.value;

    if (selectedValue === 'Y') {
     
      this.contractorLicenseDetails.get('serviceChargeValue').enable();
      this.contractorLicenseDetails.get('serviceChargePercent').disable();
      this.contractorLicenseDetails.get('serviceChargePercent').setValue(null);
    } else if (selectedValue === 'N') {
      
      this.contractorLicenseDetails.get('serviceChargePercent').enable();
      this.contractorLicenseDetails.get('serviceChargeValue').disable();
      this.contractorLicenseDetails.get('serviceChargeValue').setValue(null);
    }
  }

keyPressAlphaNumeric(event:any) {
  var inp = String.fromCharCode(event.keyCode);
  if (/[a-zA-Z0-9]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
keyPressAlpha(event: any) {
  var inp = String.fromCharCode(event.keyCode);
  if (/[a-zA-Z\s]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

getPlant(){
  this.api.getPlant().subscribe(res => {
     console.log(res)
    this.plantArr = res

  },error =>{
    console.log("plant list not getting",error);
  })
  }
  search(): void {
    const searchParams = this.searchForm.get('searchParams')?.value;
    console.log(searchParams)
    const keyParams = this.parseSearchParams(searchParams);
console.log(searchParams)

    this.api.clamSearch(keyParams).subscribe(
      (res) => {
        console.log(res);
        this.searchResults = res;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  parseSearchParams(searchParams: string): { contCode?: string, companyName?: string, sapVendor?: string } {
    const keyParams: { contCode?: string, companyName?: string, sapVendor?: string } = {};
    const paramsArray = searchParams.split(/[ ,]+/);
    paramsArray.forEach((param) => {
      const [key, value] = param.split(':');
      if (key === 'contCode') {
        keyParams.contCode = value;
      } else if (key === 'companyName') {
        keyParams.companyName = value;
      } else if (key === 'sapVendor') {
        keyParams.sapVendor = value;
      }
    });

    return keyParams;
  }






clickAddContractor(){
  this.reset()
  this.showAdd=true;
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


showContractorForm(){
  this.reset()
   this.contractorForm=true;
 }
 hideContractorForm(){
   this.reset()
   this.contractorForm=false;
 }
 selectFile(): void {
  this.fileInput.nativeElement.click();
}

 closeAllForms(event:any){
   this.hideContractorForm() 
 }

 reset(){
this.contractorBasicDetails.reset()
this.contractorLicenseDetails.reset()

this.stepper.selectedIndex=0;
 }

// GET CONTRACTOR CODE Eg: CO01,CO02
createConCode(){
  this.api.getConcode().subscribe(res=>{
    this.code =res
    // console.log(this.code)
  },error=>{
    alert("Last ID was not getting")
  })
}

// GET PLANT ID
getPlantId(plant_Code:any){
  this.api.getPlantCode(plant_Code).subscribe(res=>{
    this.plant_Id = res;
    // console.log(this.plant_Id)
  },error=>{
    alert("Plant ID was not getting")
  })
}

// GET ALL CONTRACTRO
getAllContractor(){
  this.api.getContractor().subscribe(res =>{
    this.contractorData = res
// console.log(res)
    if(this.isadmin === 'true'){
      this.activeData= res
      // console.log('admin', this.activeData)
    }
    else{
      this.activeData = this.contractorData.filter((item:any) => (item.Status === true && item.Plant_code === this.plant_Code))
      // console.log('Not Admin', this.activeData)
    }


// console.log(this.activeData)
    
  },
  error => {
    alert("Something went Wrong")
  })
}


openAlertDialog(message: string): void {
  this.dialog.open(ToastComponent, {
    data: {
      icon: 'Check',
      message: message
    }
  });
}


// EDIT VIEW FORM CONTRACTOR MASTER
OnEdit(data:any){
this.showContractorForm()

console.log(data)

    this.contractorBasicDetails.controls['plant_Code'].setValue(data.Plant_code);
    this.contractorBasicDetails.controls['cont_code'].setValue(data.Cont_code);
    this.contractorBasicDetails.controls['contraCompName'].setValue(data.Cont_company_name);
    this.contractorBasicDetails.controls['contrOwnerName'].setValue(data.Cont_onwer_name);
    this.contractorBasicDetails.controls['contraOwnerNumber'].setValue(data.Cont_Number);
    this.contractorBasicDetails.controls['contraOwnerEmail'].setValue(data.Cont_email);
    this.contractorBasicDetails.controls['pocPerson'].setValue(data.PContact_Person);
    this.contractorBasicDetails.controls['number'].setValue(data.P_Mobile_No);
    this.contractorBasicDetails.controls['email'].setValue(data.P_Email);
    this.contractorBasicDetails.controls['address'].setValue(data.Cont_address);
    this.contractorLicenseDetails.controls['Sap_vendor_Code'].setValue(data.Sap_vendor_Code);
   
    // this.contractorLicenseDetails.controls['License_File'].setValue(this.fileUrl)
    this.contractorLicenseDetails.controls['panNo'].setValue(data.PAN_No)
    this.contractorLicenseDetails.controls['gstNo'].setValue(data.GST_No)
    this.contractorLicenseDetails.controls['esiEmpCode'].setValue(data.Esi_Reg_no)
    this.contractorLicenseDetails.controls['pFEmpCode'].setValue(data.Pf_reg_No)
    this.contractorLicenseDetails.controls['License_Attachment'].setValue(data.Lic_File)
    this.contractorLicenseDetails.controls['MaxHeadLimit'].setValue(data.Max_head_count)
    this.contractorLicenseDetails.controls['L_Number'].setValue(data.Lic_No)
    this.contractorLicenseDetails.controls['L_Valid_From'].setValue(data.Lic_FromDate)
    this.contractorLicenseDetails.controls['L_Valid_To'].setValue(data.Lic_ToDate)
    // this.contractorLicenseDetails.controls['License_File'].setValue(data.Lic_File)
    this.contractorLicenseDetails.controls['EffectIveDate'].setValue(data.Effective_from)

    // this.contractorLicenseDetails.controls['serviceChargePercent'].setValue(data.Service_Charge.toString() || 0)
    // this.contractorLicenseDetails.controls['serviceChargeValue'].setValue(data.Service_Charge_Value.toString() || 0)

    if (data?.Service_Charge !== undefined && data?.Service_Charge !== null) {
      this.contractorLicenseDetails.controls['serviceChargePercent'].setValue(data.Service_Charge.toString());
  }
  
  if (data?.service_Charge_value !== undefined && data?.service_Charge_value !== null) {
      this.contractorLicenseDetails.controls['serviceChargeValue'].setValue(data.service_Charge_value.toString());
  }
  
  if (data?.ServiceOptions !== undefined && data?.ServiceOptions !== null) {
      this.contractorLicenseDetails.controls['serviceOption'].setValue(data.ServiceOptions.toString());
  }
  

    this.contractorLicenseDetails.controls['serviceTax'].setValue(data.Service_Tax)
    this.contractorLicenseDetails.controls['is_Security'].setValue(data.Is_Security.toString())
    this.contractorLicenseDetails.controls['status'].setValue(data.Status.toString())
    
    const fileName = data.Lic_File;
    if (fileName) {
      const fileUrl = this.url + `Licns_Upload/${fileName}`;
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      this.contractorLicenseDetails.controls['License_File'].setValue(fileUrl);

      const licenseFileValue = this.contractorLicenseDetails.controls['License_File'].value;
      if (licenseFileValue === fileUrl) {
        console.log('File successfully bound to License_File control.');
      } else {
        console.log('File binding failed.');
      }

    }else {
      console.log('No file provided.');
    }


    this.edit=true;


  this.showAdd=false;

  }

// UPDATE CONTRACTOR MASTER
updateContractor(){
// basic details

if(this.contractorLicenseDetails.value.status){
this.basicDetailsObj.Cont_code = this.contractorBasicDetails.value.cont_code;
this.basicDetailsObj.Plant_id = this.contractorBasicDetails.value.plant_Code;
this.basicDetailsObj.Cont_Company_name = this.contractorBasicDetails.value.contraCompName;
this.basicDetailsObj.Cont_Onwer_name = this.contractorBasicDetails.value.contrOwnerName;
this.basicDetailsObj.Cont_Number = (this.contractorBasicDetails.value.contraOwnerNumber).toString();
this.basicDetailsObj.Cont_email = this.contractorBasicDetails.value.contraOwnerEmail;
this.basicDetailsObj.PContact_Person = this.contractorBasicDetails.value.pocPerson;
this.basicDetailsObj.P_Mobile_No = (this.contractorBasicDetails.value.number).toString();
this.basicDetailsObj.P_Email = this.contractorBasicDetails.value.email;
this.basicDetailsObj.Cont_address = this.contractorBasicDetails.value.address;

this.basicDetailsObj.Sap_vendor_Code = this.contractorLicenseDetails.value.Sap_vendor_Code;
this.basicDetailsObj.Pan_No = this.contractorLicenseDetails.value.panNo;
this.basicDetailsObj.Gst_No = this.contractorLicenseDetails.value.gstNo;
this.basicDetailsObj.Esi_Reg_no = this.contractorLicenseDetails.value.esiEmpCode;
this.basicDetailsObj.Pf_reg_No = this.contractorLicenseDetails.value.pFEmpCode;
this.basicDetailsObj.Lic_File = this.contractorLicenseDetails.value.License_Attachment;
this.basicDetailsObj.Max_Head_Count = this.contractorLicenseDetails.value.MaxHeadLimit;
this.basicDetailsObj.Lic_No = this.contractorLicenseDetails.value.L_Number;
this.basicDetailsObj.Lic_FromDate = this.formatDate(this.contractorLicenseDetails.value.L_Valid_From).toString();
this.basicDetailsObj.Lic_ToDate = this.formatDate(this.contractorLicenseDetails.value.L_Valid_To).toString();
this.basicDetailsObj.Effective_from = this.formatDate(this.contractorLicenseDetails.value.EffectIveDate).toString();
this.basicDetailsObj.Service_Charge_percent = (this.contractorLicenseDetails.value.serviceChargePercent);
this.basicDetailsObj.Service_Charge_value = (this.contractorLicenseDetails.value.serviceChargeValue);
this.basicDetailsObj.Service_Tax = this.contractorLicenseDetails.value.serviceTax;
this.basicDetailsObj.Is_Security  = this.contractorLicenseDetails.value.is_Security;
this.basicDetailsObj.Status = this.contractorLicenseDetails.value.status;
this.basicDetailsObj.Modified_By = this.userEmpcode;
this.basicDetailsObj.Modified_On = this.formatDateWithHr(new Date())

const file = this.contractorLicenseDetails.value.License_File;

console.log(this.basicDetailsObj)

const formData = new FormData();
formData.append('file',this.selectedFile)
 formData.append('Concode', this.contractorBasicDetails.value.cont_code)

this.api.updateContractor(this.basicDetailsObj, this.basicDetailsObj.Cont_code)
.subscribe( res=>{
  console.log(res);
 
  this.api.license_file(formData,this.basicDetailsObj.Cont_code).subscribe(res =>{
    console.log("file Uploaded",res);
  },error=>{
    // console.log("file not Uploaded",error);
  })
  this.openAlertDialog(`Contractor  successfully updated`)
  // alert("Contractor  successfully updated")
  this.getAllContractor()
this.reset()
this.closeAllForms(event)
},
err =>{
  alert("Something went Wrong")
})
}
else{
  alert("select status Active")
  // this.showContractorForm()

}

}

// DELETE CONTRACTOR
deleteContractor(data:any){

if(data.Status){
  this.api.deleteContractor(data.Cont_code)
  .subscribe(res =>{
    this.getAllContractor()
    // alert("Contractor Deleted successfully")
    this.openAlertDialog('Contractor Deleted successfully')
  })
}else{
  alert('Data already Deleted')
}
}
submitForm() {
  if (this.validateStep(1) && this.validateStep(2)  ) {
  
    console.log('this.contractorLicenseDetails.value.serviceChargePercent',this.contractorLicenseDetails.value.serviceChargePercent);
    
    this.basicDetailsObj.Cont_code = this.code
    this.basicDetailsObj.Plant_id=  this.contractorBasicDetails.value.plant_Code
    this.basicDetailsObj.Cont_Company_name = this.contractorBasicDetails.value.contraCompName;
    this.basicDetailsObj.Cont_Onwer_name = this.contractorBasicDetails.value.contrOwnerName;
    this.basicDetailsObj.Cont_Number = (this.contractorBasicDetails.value.contraOwnerNumber).toString();
    this.basicDetailsObj.Cont_email = this.contractorBasicDetails.value.contraOwnerEmail;
    this.basicDetailsObj.PContact_Person = this.contractorBasicDetails.value.pocPerson;
    // this.basicDetailsObj.P_Mobile_No = (this.contractorBasicDetails.value.number).toString();
    this.basicDetailsObj.P_Mobile_No = (this.contractorBasicDetails?.value?.number ?? "").toString();

    this.basicDetailsObj.P_Email = this.contractorBasicDetails.value.email;
    this.basicDetailsObj.Cont_address = this.contractorBasicDetails.value.address;
  
    this.basicDetailsObj.Sap_vendor_Code = this.contractorLicenseDetails.value.Sap_vendor_Code;
    this.basicDetailsObj.Pan_No = this.contractorLicenseDetails.value.panNo;
  this.basicDetailsObj.Gst_No = this.contractorLicenseDetails.value.gstNo;
  this.basicDetailsObj.Esi_Reg_no = this.contractorLicenseDetails.value.esiEmpCode;
  this.basicDetailsObj.Pf_reg_No = this.contractorLicenseDetails.value.pFEmpCode;

  this.basicDetailsObj.Lic_File =this.contractorLicenseDetails.value.License_Attachment ;
  // this.basicDetailsObj.Lic_File = 'F:/license'+this.code;

  this.basicDetailsObj.Max_Head_Count = this.contractorLicenseDetails.value.MaxHeadLimit;
  this.basicDetailsObj.Lic_No = this.contractorLicenseDetails.value.L_Number;
  this.basicDetailsObj.Lic_FromDate = this.formatDate(this.contractorLicenseDetails.value.L_Valid_From);
  this.basicDetailsObj.Lic_ToDate = this.formatDate(this.contractorLicenseDetails.value.L_Valid_To).toString();
  this.basicDetailsObj.Effective_from = this.formatDate(this.contractorLicenseDetails.value.EffectIveDate).toString();
  this.basicDetailsObj.Service_Charge_percent = (this.contractorLicenseDetails.value.serviceChargePercent ?? 0).toString();
  this.basicDetailsObj.Service_Charge_value = (this.contractorLicenseDetails.value.serviceChargeValue ?? 0).toString();
  this.basicDetailsObj.Service_Tax = this.contractorLicenseDetails.value.serviceTax;
  this.basicDetailsObj.Is_Security  = this.contractorLicenseDetails.value.is_Security;
    this.basicDetailsObj.Status = this.contractorLicenseDetails.value.status;
    this.basicDetailsObj.Created_On= this.formatDateWithHr(new Date()).toString()
    this.basicDetailsObj.Created_By = this.userEmpcode;
  
    console.log(this.basicDetailsObj)
  
    this.api.addContractor(this.basicDetailsObj)
    .subscribe(res =>{
      // console.log(res);
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      // formData.append('Concode', this.code);
        this.api.license_file(formData ,this.code).subscribe(res =>{
          console.log("file Uploaded",res);
        },error=>{
          console.log("file not Uploaded",error);
        })

      // alert("Contractor added successfully")
      this.openAlertDialog("Contractor Added successfully")
      this.getAllContractor()
      this.reset()
      // this.fileupload(this.code)
      this.closeAllForms(event)
    },
    error =>{
      alert("Contractor Not Created ")
    
    })

   
}
}
validateStep(stepNumber: number): boolean {
  switch (stepNumber) {
    case 1:
   
      if (this.contractorBasicDetails.valid) {
        return true;
      } else {
      
        this.markFormGroupAsTouched(this.contractorBasicDetails);
        this.stepper.selectedIndex=0;
        return false;
      }
    case 2:
     
      if (this.contractorLicenseDetails.valid) {
        return true;
      } else {
       
        this.markFormGroupAsTouched(this.contractorLicenseDetails);
        this.stepper.selectedIndex=1;
        return false;
      }
    default:
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

onFileChange(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
    const file= event.target.files[0];
    this.contractorLicenseDetails.patchValue({
      License_File: file,
      License_Attachment: file.name
    });
    // this.fileName = file.name; 
  }
}


viewFile(): void {
  const fileName = this.contractorLicenseDetails.get('License_Attachment')?.value;
  console.log(fileName);
  if (fileName) {
    const fileUrl = this.url+`Licns_Upload/${fileName}`;
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
    this.contractorLicenseDetails.controls['License_File'].setValue(fileUrl);
  }else{
    const fileUrl = this.url;
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
    this.contractorLicenseDetails.controls['License_File'].setValue(fileUrl);
  }
}



exportExcel() : void{

  const transformedArray:any = this.activeData.map((data: any) =>{
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
  XLSX.utils.book_append_sheet(wb, ws, "Contractor Master");
  XLSX.writeFile(wb,"Mst_Contractor.xlsx");

    }


  





}
