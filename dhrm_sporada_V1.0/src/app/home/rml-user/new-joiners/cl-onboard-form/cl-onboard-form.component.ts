import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap,Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/home/api.service';
import moment from 'moment';

@Component({
  selector: 'app-cl-onboard-form',
  templateUrl: './cl-onboard-form.component.html',
  styleUrls: ['./cl-onboard-form.component.css']
})
export class ClOnboardFormComponent implements OnInit {
  aadhar:any;
  mobileNo:any;
  type:any;
  company:any;
  plant:any;
  apln_slno:any;
  clOnboardForm:FormGroup;
  contractorList:any;
  religionList:any = [];
  relationList:any = [];
  maritalStatus:any = [
    {value:'SINGLE'},
    {value:'MARRIED'},
    {value:'WIDOW'}
  ]
  genderList:any = [
    {value:'Male'},
    {value:'Female'},
    {value:'Others'}
  ]
  titleList:any = [
    {value:'Mr'},
    {value:'Mrs'},
    {value:'Ms'}
  ]
  maxDate:Date;
  checkPermanentAddress:boolean = false;
  bloodGroupList = [
  { id: 1, group: "A+" },
  { id: 2, group: "A-" },
  { id: 3, group: "B+" },
  { id: 4, group: "B-" },
  { id: 5, group: "AB+" },
  { id: 6, group: "AB-" },
  { id: 7, group: "O+" },
  { id: 8, group: "O-" }
];

  constructor(
    private router:ActivatedRoute,
    private navigator:Router,
    private messageService:MessageService,
    private apiService:ApiService,
    private formBuilder:FormBuilder,
  ) { 
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  ngOnInit(): void {
    this.aadhar = this.router.snapshot.paramMap.get('aadhar');
    this.mobileNo = this.router.snapshot.paramMap.get('mobileno');
    this.type = this.router.snapshot.paramMap.get('type');
    this.company = this.router.snapshot.paramMap.get('company');
    this.plant = this.router.snapshot.paramMap.get('plant');
    this.apln_slno = this.router.snapshot.paramMap.get('apln_slno');
    /** construct application form */
    this.clOnboardForm = this.formBuilder.group({
      cont_id: ['', Validators.required],
      plant_code: [this.plant, Validators.required],
      marital_status: ['', Validators.required],
      fullname: ['', Validators.required],
      title: ['Mr', Validators.required],
      Van_Eligible: [0, Validators.required],
      aadhar_file: [null, Validators.required], // file input handled separately
      aadhar_no: [this.aadhar, Validators.required],
      apprentice_type: [this.type, Validators.required],
      birthdate: ['', Validators.required],
      blood_group: ['', Validators.required],
      caste_name: ['', Validators.required],
      city: ['', Validators.required],
      emergency_name: ['', Validators.required],
      emergency_rel: ['', Validators.required],
      fathername: ['', Validators.required],
      gender: ['', Validators.required],
      mobile_no1: [this.mobileNo, Validators.required],
      mobile_no2: ['', Validators.required],
      other_files1: ['', Validators.required],
      permanent_address: ['', Validators.required],
      photo_file: [null, Validators.required], // file input handled separately
      photo_filename: ['', Validators.required],
      pincode: ['', Validators.required],
      pres_city: ['', Validators.required],
      pres_pincode: ['', Validators.required],
      pres_state_name: ['', Validators.required],
      present_address: ['', Validators.required],
      religion: ['', Validators.required],
      religion_sl: ['', Validators.required],
      state_name: ['', Validators.required]
    });
    /** get contractors */
    this.getContractors();
    /** get application data */
    this.getApplicationFormData();
  }
  /** 
   * sets file object and file name respective to control name
   * @param event
   * @param controlName
   */
  onFileChange(event: any, controlName: string): void {
  const file: File = event.target.files[0];
  if (file) {
    // Extract extension
    const extension = file.name.split('.').pop();

    // Build new filename based on control
    let newFileName = '';
    if (controlName === 'aadhar_file') {
      newFileName = `${this.apln_slno}_aadhar.${extension}`;
    } else if (controlName === 'photo_file') {
      newFileName = `${this.apln_slno}_photo.${extension}`;
    }
    // Create a new File object with the renamed filename
    const renamedFile = new File([file], newFileName, { type: file.type });
    // Patch into form
    this.clOnboardForm.patchValue({
      [controlName]: renamedFile
    });
    /** patch file name */
    if(controlName === 'aadhar_file'){
      this.clOnboardForm.patchValue({
        ['other_files1']: newFileName
      });
    }else if(controlName === 'photo_file'){
      this.clOnboardForm.patchValue({
        ['photo_filename']: newFileName
      });
    }
    console.log('Renamed file:', renamedFile);
    console.log('form data:',this.clOnboardForm.value)
  }
  }

  /** 
   * get contractors by plant
   */
  getContractors(){
    this.apiService.getContractorsByPlant(this.plant).subscribe({
      next: (response:any) => {
        console.log('contractors:',response?.data);
        this.contractorList = response?.data;
      },
      error: (error:any) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'warn',summary:error?.error?.message})
      }
    })
  }

  /** 
   * get application form data
   */
  getApplicationFormData(){
    this.apiService.getApplicationFormData().subscribe({
      next: (response:any) => {
         this.religionList = response?.data?.religions;
         this.relationList = response?.data?.relationTypes
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }
  /** 
   * set present address form as permenent address 
   * if check box checked
   */
  setPresentAddAsPermanentAddress(){
    if(this.checkPermanentAddress){
      const presentAddress = this.clOnboardForm.get('present_address')?.value;
      const pincode = this.clOnboardForm.get('pres_pincode')?.value;
      const state = this.clOnboardForm.get('pres_state_name')?.value;
      const city = this.clOnboardForm.get('pres_city')?.value;
      this.clOnboardForm.patchValue({
        permanent_address:presentAddress,
        pincode,
        city,
        state_name:state
      })
    }
  }

  /** 
   * get pincode data
   * @param event
   * @param type
   *  */
  getPincodeData(event:any,type:any):any{
   const pincode = event.target.value;
   if(pincode.length == 6){
    this.apiService.getPincodeData(pincode).subscribe({
      next: (response:any) => {
        /** patch form values */
        this.patchPincodeAddress(type,response?.data);
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message});
      }
    })
   }
  }
  /** 
   * patch pincode address data
   * @param event
   * @param pincode
   */
  patchPincodeAddress(type:any,pincode:any){
    if(type === 'present'){
      this.clOnboardForm.patchValue({
        pres_state_name:pincode?.statename,
        pres_city:pincode?.taluk
      })
    }else if(type === 'permanent'){
      this.clOnboardForm.patchValue({
        state_name:pincode?.statename,
        city:pincode?.taluk
      })
    }
  }
  /** 
   * set religion value
   * @param event
   *  */
  setReligion(event:any){
    const {religion_name} = this.religionList.find((religion:any) => religion.slno == event)
    this.clOnboardForm.patchValue({
      religion:religion_name
    })
  }
  /** 
   * sumbit form application
   */
  submitFormData(){
    /** format DOB */
    const formattedDOB = moment(this.clOnboardForm.value.birthdate).format('YYYY-MM-DD')
    this.clOnboardForm.controls['birthdate'].setValue(formattedDOB)
    console.log('form data:',this.clOnboardForm.value);

    this.apiService.submitClNewOnboardForm(this.clOnboardForm.value).subscribe({
      next: (response:any) => {
        console.log('response',response);
        this.navigator.navigateByUrl('/');
      },
      error:(error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
  }
}
