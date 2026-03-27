import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { MessageService } from "primeng/api";
import { Location } from "@angular/common";
import { environment } from "src/environments/environment.prod";
@Component({
  selector: "app-transfer-form",
  templateUrl: "./transfer-form.component.html",
  styleUrls: ["./transfer-form.component.css"],
})
export class TransferFormComponent implements OnInit {
  form: any;
  gen_id: any;
  changedepartment: any;
  payrollAreaList:any = [];
  costCenterList:any = [];
  changeline: any;
  changeRole: any;
  reportingto: any;
  obj: any;
  flag: any = true;
  state: boolean;
  slno: any;
  fullname: any;
  genID: any;
  apprenticeType:any;
  /** trainee type */
  traineeType:any = [
    {value:1 , label:'DIRECT'},
    {value:2, label:'IN-DIRECT'}
  ]
   /** contractor list
   * used to seperate contract trainee & company trainee
   */
  contractorsList:any = environment?.contractorsList || []

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private active: ActivatedRoute,
    private service: ApiService,
    private router: Router,
    private messageService: MessageService,
    private location: Location
  ) {
    this.form = this.fb.group({
      apln_slno: [""],
      currentCC:[''],
      currentPA:[],
      current_department: [""],
      current_line: [""],
      emp_name: [""],
      current_Role: [""],
      current_trainee_type:[''],
      changedepartment: ["", Validators.required],
      payrollArea:['',Validators.required],
      costCenter:['',Validators.required],
      changeline: ["", Validators.required],
      change_Role: ["", Validators.required],
      reportingto: ["", Validators.required],
      changeworkcat: [""],
      change_trainee_type:['',Validators.required],
      fullname: [""],
      idno: [""],
      plantcode: [sessionStorage.getItem("plantcode")],
      workcat: [""],
      apprentice_type:[''],
    });
  }

  ngOnInit(): void {
    this.form.controls["apln_slno"].setValue(
      this.active.snapshot.paramMap.get("apln_slno")
    );

    var object = {
      apln_slno: this.active.snapshot.paramMap.get("apln_slno"),
      dept_slno: this.active.snapshot.paramMap.get("dept"),
      line_code: this.active.snapshot.paramMap.get("line"),
    };
    /** get trainee current data */
    this.getTraineeData();
    /** get change data */
    this.getDeptTransferData();
  }

  
  /** get trainee current data */
  getTraineeData(){
    var object = {
      apln_slno: this.active.snapshot.paramMap.get("apln_slno"),
      dept_slno: this.active.snapshot.paramMap.get("dept"),
      line_code: this.active.snapshot.paramMap.get("line"),
    };
     this.service.dept_line(object).subscribe({
      next: (response:any) => {
        console.log('RESPONSE:',response);
        /** 
         * response[0]dept 
         * response[1] line 
         * response[2] emp 
         * response[3] traineeData 
         * response[4] cat & role */
        this.obj = response;
        /** set apprentice type */
        this.apprenticeType = response[3]?.apprentice_type
        console.log('apprentice type:',this.apprenticeType);
        /** 
         * call function to enable or disable cost center
         */
        this.checkEnableCostCenter(this.apprenticeType);

        this.fullname = this.obj[3]?.fullname;
        this.genID = this.obj[3]?.gen_id;
        console.log(this.obj);

        const data = this.obj[3];

        this.form.controls["current_department"].setValue(this.obj[0]?.dept_name);
        this.form.controls["current_line"].setValue(this.obj[1]?.line_name);
        /** obj[2] report auth */
        this.form.controls["emp_name"].setValue(this.obj[2]?.emp_name);
        /** set apprentice type */
        this.form.controls['apprentice_type'].setValue(this.apprenticeType);
        /** obj[3] trainee data */
        this.form.controls["fullname"].setValue(this.obj[3]?.fullname);
        this.form.controls["idno"].setValue(this.obj[3]?.gen_id);
        this.form.controls["currentPA"].setValue(this.obj[3].payrollArea);
        this.form.controls["currentCC"].setValue(this.obj[3].cost_center);
        /** obj[4] cat & role */
        this.form.controls["workcat"].setValue(this.obj[4].Category_Name);
        this.form.controls["current_trainee_type"].setValue(this.obj[3].trainee_type == 1 ? 'DIRECT': 'IN-DIRECT');
        this.form.controls["current_Role"].setValue(this.obj[4].Role_Name);
        this.obj = [];
      },
      error: (err) => {
        console.log('ERROR:',err);
         this.messageService.add({ severity: "error", summary: err.message })
      }
    });
  }
 
  /** 
   * on category select based on the category disable costcenter
   */
  checkEnableCostCenter(category:any){
    console.log('category:',category);
    console.log('contractor list from evnironment',this.contractorsList)
    const isSelectedCategory = this.contractorsList.includes(category);
    console.log('is selected category:',isSelectedCategory);
    if(isSelectedCategory){
      this.form.get('costCenter')?.disable();
     this.form.get('costCenter')?.setValue(null);
    }else{
      this.form.get('costCenter')?.enable();
    this.form.get('costCenter')?.setValue('');
    }
  }
  /** get transfer data */
  getDeptTransferData(){
     this.service
      .dept_line_report({ plantcode: sessionStorage.getItem("plantcode") })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.obj = response;
          // this.reportingto = this.obj[0]
          this.changedepartment = this.obj[1];
          this.payrollAreaList = this.obj[4];
          this.costCenterList = this.obj[3];
          // this.changeline = this.obj[2]
        },
        error: (err) => {
          console.error('ERROR:',err);
          this.messageService.add({ severity: "error", summary: err.message });
        }
      });
  }

  /** change department API */
  submit() {
    console.log('CHANGE DEPT DATA:',this.form.getRawValue());
    /** department transfer form API call */
    this.service.transfer(this.form.getRawValue()).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.status == "success") {
          this.messageService.add({
            severity: "info",
            summary: response.message,
          });
          /** route to dept transfer afte 3s */
          setTimeout(() => {
            this.router.navigate(["/rhrm/new_joiners/dept_transfer"]);
          },2200)
        }
      },
      error: (err:any) => {
        console.error('ERROR:',err);
        if(err.status == 400){
          this.messageService.add({severity:'warn', summary:err?.error})
        }else{
         this.messageService.add({ severity: "error", summary: err.message });
        }
      },
    });
  }

  emp_slno(event: any) {
    const func = this.reportingto.findIndex(
      (obj: any) => obj["emp_name"] === event.target.value
    );
    this.slno = this.reportingto[func].empl_slno;
    console.log(this.slno);
  }

  getLineName_1(event: any) {
    var x = event.value;
    this.service
      .getLineName({ dept_slno: this.changedepartment[x].dept_slno })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.changeline = response[0];
          this.reportingto = response[1];
        },
        error: (err) => {
          console.error('ERROR:',err);
          this.messageService.add({ severity: "error", summary: err.message })
        }
      });
  }

  /** 
   * dept change event
   * get line , reporting auth , role data , filter cc based on selected dept
   * @param event dept
   *  */
  getline_Role(event: any) {
    this.getLineName(event);
    this.getRoleMaster(event);
    if(environment.enableCCFilter){
      this.filterCostCenter(event.value)
    }
  }

  /** 
   * filter cost center based on selected dept
   * @property {*} costCenterList
   * @param dept
   */
   filterCostCenter(dept:any){
    console.log('DEPT:',dept);
    // console.log('CC:',this.costCenterList);
     const filteredCC = this.costCenterList.filter((costcenter:any) => costcenter.DepartmentCode == dept);
     console.log('FILTERED CC:',filteredCC);
    /** set filtered CC */
     this.costCenterList =  filteredCC;
   }

  /** 
   * get line and reporting auth data
   * @param event dept
   *  */
  getLineName(event: any) {
    var x = event.value;
    this.service.getLineName({ dept_slno: x }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.changeline = response[0];
        this.reportingto = response[1];
      },
      error: (err) =>  {
          console.error('ERROR:',err);
          this.messageService.add({ severity: "error", summary: err.message })
        }
    });
  }

  /**
   * get role data
   * @param event dept
   */
  getRoleMaster(event: any) {
    var x = event.value;
    this.service.getRoleName({ dept_slno: x }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.changeRole = response[0];
      },
      error: (err) =>  {
          console.error('ERROR:',err);
          this.messageService.add({ severity: "error", summary: err.message })
        }
    });
  }

  /**
   * change work category based on role
   */
  onRoleChange(event: any) {
    console.log(event.value);
    const selectedRoleId = Number(event.value);

    const selectedRole = this.changeRole.find(
      (role: any) => role.Role_Id === selectedRoleId
    );

    if (selectedRole) {
      this.form.controls["changeworkcat"].setValue(selectedRole.Category_Name);
      console.log(this.form.value.changeworkcat);
    } else {
      this.form.controls["changeworkcat"].setValue("");
    }
  }

  goBack() {
    this.location.back();
  }

  log() {
    console.log(this.form.value);
  }
}
