import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import * as XLSX from "xlsx";
import { environment } from "src/environments/environment.prod";
import moment from 'moment'
import { MessageService } from "primeng/api";
import { Input } from "@angular/core";
import { Location } from "@angular/common";
import { FormService } from "../form.service";
import { RejectComponent } from "../hr-view-data/reject/reject.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-onboard-form",
  templateUrl: "./onboard-form.component.html",
  styleUrls: ["./onboard-form.component.css"],
})
export class OnboardFormComponent implements OnInit {
  @Input() applicationNumber:any = 'number';
  @Input() applicationStatus:any= 'status';
  @Input() applicationData:any= [];
  @Input() disbleApproveBtn:any;
  disableApproveBtn:any;
  applicationStatusForBtn = 'PENDING'
  lockDate:any;
  form: any;
  ifsc_code: any;
  grade: any = [
    {value:1,label:1},
    {value:2,label:2},
    {value:3,label:3},
  {value:4,label:4}];
  account_number: any;
  department: any;
  active_status: any = [{value:"ACTIVE",label:"ACTIVE"}, {value:"INACTIVE",label:"INACTIVE"}];
  bank_name: any;
  line: any;
  Role: any;
  b_id: any;
  process_trained: any;
  rfr: any = [];
  b_num: any;
  reporting_to: any;
  uan: any;
  w_contract: any = ["DIRECT", "INDIRECT",'OTHERS'];
  isWContractDisabled: boolean = true;
  trainee_id: any;
  Role_Id: any;
  designation: any;
  basic: any;
  status: any = this.active.snapshot.paramMap.get("apln_status");
  apln_slno: any = this.active.snapshot.paramMap.get("id");
  down: any;
  age:any;
  reason:any;
  DOJ:any
  readonly: boolean = this.status == "APPOINTED" ? true : false;
  obj: any = [];
  OnboardData = [];
  flag: any = true;
  state: boolean;
  category: any;
  cat: any;
  cate: any;
  oprn: any;
  setting: number;
  true: boolean = false;
  onboard: any = true;
  department_: any;
  fullname: any;
  minDate:any;
  today:any
  minDateCal:any;
  backdate:any;
  created_dt:any;
  minlockdate:any;
  dolMinDate:any
  dolMaxDate:any = new Date();
  payrollArea:any = [];
  costCenterData:any = [];
  dojoTrainingOptions:any =  [
    { label: 'YES', value: 'YES' },
    { label: 'NO', value: 'NO' }
  ]
  contractorData:any;
  contractorsList:any = [
    'CL',
    'CL - PIECE RATE',
    'VENDOR-NAPS',
    'VENDOR-LEAP',
    'VENDOR-BVOC',
    'VENDOR-DVOC',
    'VENDOR-NATS',
    'VENDOR LEARN & EARN',
    'VENDOR NEEM']
  constructor(
    private fb: UntypedFormBuilder,
     private formservice: FormService,
    private http: HttpClient,
    private router: Router,
    private active: ActivatedRoute,
    private service: ApiService,
    private messageService:MessageService,
    private location:Location,
     private dailog:MatDialog,
  ) {
    this.form = this.fb.group({
      ifsc_code: ["",],
      grade: [1],
      doj: ["", Validators.required],
      account_number: ["", ],
      department: ["",Validators.required],
      active_status: ["ACTIVE"],
      bank_name: ["", Validators.required],
      line: ["",Validators.required],
      Role_Id: ["",Validators.required],
      dol: new FormControl(""),
      bio_id: [""],
      process_trained: ["",Validators.required],
      rfr: new FormControl(""),
      bnum: ["", Validators.required],
      reportingto: ["", Validators.required],
      uan: ["", Validators.maxLength(12)],
      wcontract: ["",Validators.required],
      trainee_id: [""],
      designation: [""],
      payrollArea:['', Validators.required],
      costCenter: ['', Validators.required],
      legacyNumberOne: [''],
      legacyNumberTwo: [''],
      // dojo training
      dojoTraining: [''],
      plantcode: [sessionStorage.getItem("plantcode")],
      apln_slno: [""],
      category: ["",Validators.required],
      // contractor
      cont_id:['']
    });
  }
  values: any;

  ngOnInit(): void {
    console.log('DATA FROM APPLICATION', this.applicationNumber)
    this.form.get("bnum").setValue(this.active.snapshot.paramMap.get("id"));
    this.form.controls["bio_id"].setValue(false);
    this.service.getonboard({apln_slno: this.active.snapshot.paramMap.get("id") || this.applicationNumber,readonly: this.readonly,})
      .subscribe(
        (response: any) => {
        // console.log('1');
        // console.log(response);
        // console.log(response[0][0])

        /** get payroll area by plant code */
         this.getPayrollArea(response[0][0]?.plant_code);

        /** get cost center by plant code */
         this.getCostcenterByPlantCode(response[0][0]?.plant_code);

        // console.log('Plant code',response[0][0]?.plant_code)
          this.setAge(response[0][0].birthdate);
          this.obj = response;
       //   console.log(response[0][0].doj);
          this.setDOJ(response[0][0].doj)
          this.getbackDate_Doj(response[0][0].created_dt)
       //   console.log('4');
          this.basic = this.obj[0];
          this.designation = this.obj[1];
          this.department = this.obj[2];
          this.line = this.obj[3];
          this.process_trained = this.obj[4]
          this.reporting_to = this.obj[5];
          this.category = this.obj[6];
          this.oprn = this.obj[7]
          this.DOJ = response[0][0].doj

          // this.oprn = this.oprn.map((a: any) => a.oprn_desc);
          // this.cat = this.category.map((a: any) => a.categorynm);
        //  console.log(this.obj[0]);

        // api call for geting roles data for 2nd approver
          this.getRolesFor2ndApporver();
        // contracts api call
        this.getContractors(this.basic[0].mobile_no1)

          this.created_dt= response[0][0].created_dt
          this.form.controls["ifsc_code"].setValue(this.basic[0]?.ifsc_code=='null'?'':this.basic[0]?.ifsc_code);
          this.form.controls["account_number"].setValue(
            this.basic[0]?.bank_account_number=='null'?'':this.basic[0]?.bank_account_number
          );
          this.form.controls["bank_name"].setValue(this.basic[0]?.bank_name=='null'?'':this.basic[0]?.bank_name);
          this.form.controls["apln_slno"].setValue(this.basic[0]?.apln_slno);
          this.fullname = this.basic[0]?.fullname;
          this.trainee_id = this.basic[0]?.trainee_idno;
          //  this.form.controls["grade"].setValue(this.basic[0]?.emp_grade);
            this.form.controls["department"].setValue(this.basic[0]?.dept_slno);
            this.form.controls["cont_id"].setValue(this.basic[0]?.cont_id);
            // if (this.readonly == true) {
            //   this.getLineName(this.form.get("department").value);
            //   this.getline_Role(this.form.get("department").value);
            // }
            this.form.controls["line"].setValue(this.basic[0]?.line_code?.toString());
            // if biometric num is apln num bionum is empty
            this.form.controls["bnum"].setValue(this.basic[0]?.biometric_no == this.basic[0]?.apln_slno ? '' : this.basic[0]?.biometric_no );
            this.form.controls["bio_id"].setValue(true);
            this.form.controls["uan"].setValue(this.basic[0]?.uan_number);
            this.form.controls["Role_Id"].setValue(this.basic[0]?.Role_Id);
            this.form.controls["trainee_id"].setValue(this.basic[0]?.gen_id);
            this.form.controls["reportingto"].setValue(this.basic[0]?.reporting_to);
            // payroll area
            this.form.controls["payrollArea"].setValue(this.basic[0]?.payrollArea);
            // dojo training new extra fields
            this.form.controls['dojoTraining']
            .setValue(this.basic[0]?.skip_training == "YES" ? 'NO' : 'YES'); // setting server response opposite value
            this.form.controls['costCenter'].setValue(this.basic[0]?.cost_center);
            this.form.controls['legacyNumberOne'].setValue(this.basic[0]?.legacy_no1);
            this.form.controls['legacyNumberTwo'].setValue(this.basic[0]?.legacy_no2);
            // mapping operation values to form value
             this.form.controls["process_trained"].setValue(this.oprn.map((operation:any) => {
               return operation.oprn_desc
             }));
            // 
            this.form.controls["wcontract"].setValue("DIRECT");
            this.form.controls["doj"].setValue(this.basic[0]?.doj);
           
          // before trainee onboard
          if (this.readonly == false) {
            this.form.controls["grade"].disable();
             this.form.controls["active_status"].setValue('ACTIVE');
            this.form.controls["active_status"].disable();
            this.form.controls["category"].setValue(
              this.basic[0]?.apprentice_type
            );
            if(this.basic[0]?.apprentice_type==null){
                // console.log('')
            }
            // else{
            //   this.gen_id(this.basic[0]?.apprentice_type)
            // // this.form.controls["category"].disable();
            // }
            
          }

          this.service.getlockdateByCategory(this.category=='OPREATOR'?'O':'T').subscribe((response:any)=>{
            this.lockDate=response.date.split('T')[0]
         //   console.log(this.lockDate)
            this.dolMinDate = this.lockDate > this.DOJ? moment(this.lockDate).format('yyyy-MM-DD') :this.DOJ
            this.dolMinDate = new Date(this.dolMinDate)
            this.calMin_Max_DOL(this.lockDate)
            if(this.DOJ < this.lockDate){
              // this.minDate = this.lockDate
              this.minDateCal= moment(this.lockDate).format('yyyy-MM-DD')
            }
          })
// before trainee appointed
          if (this.readonly == true) {
            this.getRolesFor2ndApporver()
            this.form.controls["grade"].setValue(this.basic[0]?.emp_grade);
            this.form.controls["department"].setValue(this.basic[0]?.dept_slno);
            // if (this.readonly == true) {
            //   this.getLineName(this.form.get("department").value);
            //   this.getline_Role(this.form.get("department").value);
            // }
            this.form.controls["line"].setValue(this.basic[0]?.line_code?.toString());
            this.form.controls["process_trained"].setValue(this.oprn[0]?.oprn_desc);
            this.form.controls["bnum"].setValue(this.basic[0]?.biometric_no);
            this.form.controls["bio_id"].setValue(true);
            this.form.controls["uan"].setValue(this.basic[0]?.uan_number);
            this.form.controls["Role_Id"].setValue(this.basic[0]?.Role_Id);
            this.form.controls["cont_id"].setValue(this.basic[0]?.cont_id);
            this.form.controls["trainee_id"].setValue(this.basic[0]?.gen_id);
            this.form.controls["reportingto"].setValue(this.basic[0]?.reporting_to);
              // payroll area
            this.form.controls["payrollArea"].setValue(
              this.basic[0]?.payrollArea
            );
            // dojo training new extra fields
            this.form.controls['dojoTraining']
            .setValue(this.basic[0]?.skip_training == "YES" ? 'NO' : 'YES'); // setting server response opposite value
            this.form.controls['costCenter'].setValue(this.basic[0]?.cost_center);
            this.form.controls['legacyNumberOne'].setValue(this.basic[0]?.legacy_no1);
            this.form.controls['legacyNumberTwo'].setValue(this.basic[0]?.legacy_no2);

            this.form.controls["wcontract"].setValue("DIRECT");
            this.form.controls["doj"].setValue(this.basic[0]?.doj);
            if (this.form.controls["active_status"].value == "ACTIVE") {
              this.form.controls["rfr"].disable();
              this.form.controls["dol"].disable();
            }

            this.form.controls["category"].setValue(
              this.basic[0]?.apprentice_type
            );
            this.form.controls["department"].disable();
            this.form.controls["designation"].disable();
            this.form.controls["line"].disable();
            this.form.controls["Role_Id"].disable();
            this.form.controls["grade"].disable();
            this.form.controls["reportingto"].disable();
            this.form.controls["wcontract"].disable();
            this.form.controls["designation"].disable();
            this.form.controls["doj"].disable();
            this.form.controls["category"].disable();
            this.form.controls["cont_id"].disable();
          } else {
            this.form.controls["rfr"].disable();
            this.form.controls["dol"].disable();
          }

          // this.line = this.line.map((line_name:any) => line_name.line_name)
          // this.designation = this.designation.map((a:any) => a.desig_name)
          // this.department = this.department_.map((a:any) => a.dept_name)
          // this.process_trained = this.process_trained.map(
          //   (a: any) => a.oprn_desc
          // );
          // this.reporting_to = this.reporting_to.map((a:any) => a.emp_name)
          this.cat = this.category.map((a: any) => a.categorynm);
          this.oprn = this.oprn.map((a: any) => a.oprn_desc);
        },
        (err) => {this.messageService.add({severity:'error',summary:err.message})}
      );
      this.service.getreliveReason().subscribe((res:any)=>{
        this.rfr=res.data
        // console.log(this.rfr)
      },
      (err) => this.messageService.add({severity:'error',summary:err.message}))
    if (this.readonly == true) {
      this.form.controls["dol"].setValidators(Validators.required);
      this.form.controls["rfr"].setValidators(Validators.required);
    } 
    console.log(this.minDate,this.today , "CAL DATE")   
  }

  // goBack
  goBack(){
    this.location.back();
  }


  // get payroll area by plant code
  getPayrollArea(plantcode:any){
    this.service.getPayrollAreaByPlantcode(plantcode).subscribe({
      next: (response:any) => {
        if(response?.message){
          this.messageService.add({severity:'info',summary:response?.message})
        }
        this.payrollArea = response;
        console.log(response);
      }
    })
  }

  getbackDate_Doj(created_dt:any){
    this.service.getbackdate().subscribe((response:any)=>{
      if (response.status=='success'){
      //  console.log(response.data.doj_limit)
        this.backdate = response.data.doj_limit
        this.today= new Date()
      //  console.log('created_dt',created_dt);
      //  console.log('doj limit', moment().subtract(this.backdate, 'days').format('yyyy-MM-DD') );
     const backdate1 = moment().subtract(this.backdate - 1, 'days').format('YYYY-MM-DD');

     this.minDate = moment(created_dt).isAfter(backdate1) ? created_dt : backdate1;
     this.minDate = new Date(this.minDate)
     console.log('Final Min Date:', this.minDate);
      }else{
        this.messageService.add({severity:'warn',summary:response.message})
      }
    },
  (err) => this.messageService.add({severity:'error',summary:err.message}))
  }


  setDOJ(doj:any){
  //  console.log('3');
    this.DOJ = doj
    this.dolMinDate = doj
    this.dolMinDate = new Date(this.dolMinDate)
    // this.calMin_Max_DOL()
  }
  
  calMin_Max_DOL(lockDate:any){
    // console.log('lockDate',lockDate);
    // console.log('doj',this.DOJ);
    
    if(lockDate > this.DOJ){
      // console.log('lockDate > this.DOJ',lockDate);
      
      this.dolMinDate = lockDate

      this.dolMinDate = new Date(this.dolMinDate)
    }
   else if(lockDate < this.DOJ){
    // console.log('lockDate < this.DOJ',this.DOJ);
      this.dolMinDate = this.DOJ
      this.dolMinDate = new Date(this.dolMinDate)
    }

    console.log('MAX DOL',this.dolMinDate)
  }

  get pc() {
    return this.form.controls;
  }

  call(event: any) {
    if (this.form.get("uan").value.toString().length > 12) this.true = true;
    else this.true = false;
  }

  // onboard form submit
  submit(isFirstApprover:any) {
  //   if(this.form.controls["doj"].value<this.lockDate && this.readonly == false){
  //     this.messageService.add({severity:'warn',summary:'`DOJ should be within current payroll period'})
  //     return
  //   }

  //  if(this.form.controls["doj"].value>this.today  && this.readonly == false ){
  //   this.messageService.add({severity:'warn',summary:'DOJ is cannot be future date'})
  //   return 
  //  }
 

  //  if(this.form.controls["doj"].value<this.created_dt && this.readonly == false){
  //   this.messageService.add({severity:'warn',summary:`Application Created  Date is ${this.created_dt} and DOJ cannot be less then applicatin creation date`})
  //   return
  //  }

    if (this.readonly == false) {
      this.form.get("grade").enable();
      this.form.get('category').enable();
      this.form.controls["doj"].setValue(moment(this.form.value.doj).format('YYYY-MM-DD'));
      // setting dojo training value to actual value
      this.form.controls['dojoTraining'].setValue(this.form.value.dojoTraining == "YES" ? 'YES' : 'no');
      // logging onboard form data
      console.log('ONBOARD DATA',this.form.value);
      // trainee onboard api call
      this.service.onboard_form(this.form.value).subscribe({
        next: (response: any) => {
        //  console.log(response);
          if (response) {
            if(isFirstApprover){
              this.messageService.add({severity:'info',summary:'Application Send For Approval'});
            }else{
             this.messageService.add({severity:'info',summary:response})
            }
            if (this.setting == 1) {
              this.form.controls["trainee_id"].setValue();
              this.service
                .getfiledrop({
                  apln_slno: this.active.snapshot.paramMap.get("id"),
                })
                .subscribe({
                  next: (response) => {
                    // console.log("down", response);
                    this.down = response;
                    this.exportexcel();
                  },
                  error:(err) => this.messageService.add({severity:'error',summary:err.message})
                });
            }
            if(isFirstApprover){
              this.router.navigate(["/rhrm/new_joiners/trainee-application-status"])
            }else{
              this.router.navigate(["/rhrm/new_joiners/onboard"]);
            }
          }
        },
        error: (err) => {
          this.messageService.add({severity:'error',summary:err.message})
        },
      });
      // trainee employee relive api call
    } else if (this.readonly == true) {
      /** DOL format */
      // this.form.controls["dol"].setValue(moment(this.form.value.dol).format('YYYY-MM-DD'));
      console.log(this.form.value)

      this.service.relieve({...this.form.value,category:this.basic[0]?.apprentice_type }).subscribe({
        next: (response: any) => {
          // console.log(response);
          if (response.message == "success") {
            this.messageService.add({severity:'info',summary:'The Employee has been Relieve'})
            // alert("The Employee has been Relieved ");
            this.router.navigate(["/rhrm/new_joiners/onboard"]);
          }else if(response.message == "failure"){
            this.messageService.add({severity:'error',summary:`${response.status}`})
            //  alert(`${response.status}`)
          }else{
            this.messageService.add({severity:'error',summary:'An Error Occured!'})
          }
        },
        error: (err) => {
          this.messageService.add({severity:'error',summary:err.message})
        },
      });
    }
  }

  rel() {
    if (this.form.get("dol").value != "" && this.form.get("rfr").value != "")
      this.onboard = false;
    if (this.form.get("active_status").value == "ACTIVE") this.onboard = true;
  }

  change(event: any) {
    // console.log(event.target.value);

    if (event.value == "INACTIVE") {
      this.form.controls["dol"].enable();
      this.form.controls["rfr"].enable();
    } else if (event.value == "ACTIVE") {
      this.form.controls["dol"].disable();
      this.form.controls["rfr"].disable();
    }
  }

  gen_id(value: any) {
    
    var value = this.form.controls['category'].value
    // console.log(value)
    let cat = this.category.filter((cat:any)=>{
      return cat.categorynm == value;
    })
    // console.log(cat[0].file_drop)
    if (cat[0].file_drop == true) {
      // console.log('sap')
      this.setting = 1;
      this.form.controls["trainee_id"].setValue();
    } else if (cat[0].file_drop == false) {
      // console.log('non-sap')
      this.setting = 0;
      this.form.controls["trainee_id"].setValue(
        value.split("")[0] +
          this.active.snapshot.paramMap.get("id")
      );
      console.log(value.split("")[0] +
          this.active.snapshot.paramMap.get("id"))
    }
  }

  exportexcel() {
    const aoa = this.down.map((obj: any) => Object.values(obj));
    var ws = XLSX.utils.aoa_to_sheet(aoa);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "people");
    var buffer = XLSX.write(wb, { type: "buffer", bookType: "csv" });
    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    var formData = new FormData();
    formData.append(
      "file",
      file,
      "CR_" + this.apln_slno + "_" + this.down[0].startdt + ".csv"
    );

    this.service.filedrop(formData).subscribe({
      next: (response) => {
        // console.log(response);
      },
    });
  }


  getline_Role(event :any){
    this.getLineName(event)
    this.getRoleMaster(event)
  }

  getLineName(event: any) {
    var dept = { dept_slno: event.value };
    this.service.getLineName(dept).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.line = response[0];
        // this.line = this.line.map((a:any) => a.line_name)
        this.reporting_to = response[1];
        // this.reporting_to = this.reporting_to.map((a:any) => a.emp_name)
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    });
  }

  getRoleMaster(event: any) {
    var dept = { dept_slno: event.value }
    this.service.getRoleName(dept).subscribe({
      next: (response: any) => {
        // console.log('role',response);
        this.Role = response[0];
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    });
  }

  onRoleChange(event: any) {
    // console.log('Event Value:', event.target.value); // Log to verify the value
  
    // Extract the selected Role_Id and ensure it's a number
    const selectedRoleId = Number(event.value);
  // console.log('this.Role',this.Role);
  
    // Find the selected role from the Role array
    const selectedRole = this.Role.find((role: any) => role.Role_Id == selectedRoleId);
  
    // console.log('Selected Role:', selectedRole); // Log to confirm the role found
  
    // Update w_contract and reset the form field
    if (selectedRole) {
      this.w_contract = [selectedRole.Category_Name];
      this.form.patchValue({ wcontract: selectedRole.Category_Name });
      this.isWContractDisabled = true; 
    } else {
      this.w_contract = [];
      this.isWContractDisabled = true; 
      
    }
  }
  
  setAge(dob:any) {
    console.log('2');
    let date1:any = new Date(dob);
    let date2:any = new Date();
    let diff:any = date2 - date1;
    let miliseconperyaer = 1000 * 60 * 60 * 24 * 365;
    this.age= Math.trunc(diff / miliseconperyaer)
    let age_limit = Math.trunc(diff / miliseconperyaer)
    let validCategory = this.category
  }

  printid() {
    console.log(this.form.value)
    const url = this.router.createUrlTree([
      // `/${environment.prodLink}`,
      "perm-idcard",
      this.apln_slno,
      this.form.controls["category"].value,
    ]);
    window.open(url.toString(), "_blank");
  }

  // send for approval by hr function
  sendForApprovalByHR(){
    const submitData = {
      mobile:this.applicationData.mobile_no1,
      company:this.applicationData.company_code,
    }
    // console.log(this.applicationData)
    // dojo training handling api
    this.formservice.DojoTrainingProcess({
      cat: this.form.value.category,
      mob: this.applicationData.mobile_no1,
      cont: this.applicationData.cont_id || this.form.value.cont_id,
      Bodhi_training: this.form.value.dojoTraining,
      dept_Id: this.form.value.department,
      Role_id: this.form.value.Role_Id,
    }).subscribe({
      next: (response:any) => {
       console.log('category submitted',response);
      // HR APPROVAL API CALL
       this.formservice.submitted(submitData);
      // onboard form submit api call 
      this.submit(true)
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.response})
      }
     })
  }

  // final hr rejection api
  openDailog(){
    const rejectDailog=this.dailog.open(RejectComponent,{disableClose:false,
    width:'600px',
    })
    rejectDailog.afterClosed().subscribe( data =>{
      if(data){
        this.rejected(data)
      }
    })
  }

  rejected(data:any) {
    const rejectData = {
      mobile: this.applicationData?.mobile_no1   || '',
      company:this.applicationData?.company_code || '',
      reason:data
    }
    this.formservice.rejected(rejectData);
    this.messageService.add({severity:'info',summary:'Application has been rejected'})
    // window.alert("Application has been rejected");
    this.router.navigate(["rhrm/new_joiners/hr-approval"]);
  }

  // get Roles for 2nd approver
  getRolesFor2ndApporver(){
    // api call for geting roles data for 2nd approver
         if(this.disbleApproveBtn || this.basic[0].apln_status == 'APPOINTED'){
          this.service.getRoleName({dept_slno: this.basic[0].dept_slno}).subscribe({
            next: (response:any) => {
              this.Role = response[0];
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({severity:'error',summary:error.message})
            }
          })
    }
  }

  // get contractors
  getContractors(mobileNumber:any) {
   this.formservice.getContracts(mobileNumber).subscribe({
    next: (response:any) => {
      this.contractorData = response.data;
      // console.log('CONTRACT:', response.data)
    },
    error: (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    }
   })
  }

  /**
   * 1. get cost center by plant
   * @param {*} plantCode
   * @property {any[]} costCenterData
   * @property {*} service
   */

  getCostcenterByPlantCode(plantCode:any){
    this.service.getCostcenterByPlantcode(plantCode).subscribe({
      next: (response:any) => {
       if(response?.message){
        this.messageService.add({severity:'warn',summary:response?.message});
       }else{
        this.costCenterData = response;
       }
       console.log(response)
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({severity:'error',summary:err.error?.message})
      }
    })
  }
}
