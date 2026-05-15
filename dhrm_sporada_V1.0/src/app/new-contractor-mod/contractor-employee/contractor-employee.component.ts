import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from "@angular/forms";
import { Location } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClamAPIService } from "../clam-api.service";
import { ApiService } from "src/app/home/api.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatVerticalStepper } from "@angular/material/stepper";
import * as XLSX from "xlsx";
import moment from "moment";
import { ContractorEmployee } from "./contractor-employee.model";
import { LoaderserviceService } from "../../loaderservice.service";
import { ToastComponent } from "../toast/toast.component";
import { MatDialog } from "@angular/material/dialog";
import { DelPopupComponent } from "../del-popup/del-popup.component";
import { environment } from "src/environments/environment.prod";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { MessageService, MenuItem } from "primeng/api";
@Component({
  selector: "app-contractor-employee",
  templateUrl: "./contractor-employee.component.html",
  styleUrls: ["./contractor-employee.component.css"],
})
export class ContractorEmployeeComponent implements OnInit {
  @ViewChild(MatVerticalStepper) stepper!: MatVerticalStepper;
  contractEmpBasicDetails: any;
  contractEmpOtherDetails: any;
  contractEmpDetails: any; 
  contractEmpPayscaleDetails: any;
  contractEmpReleavingDetails: any;
  // new
  contractEmpDetails2: any;
  payscaledetails: any;

  searchForm: any;
  /** filter status options */
  statusOption = [
    { value: "PENDING", label: "PENDING" },
    { value: "SUBMITTED", label: "SUBMITTED" },
    { value: "APPOINTED", label: "APPOINTED" },
    { value: "Deleted", label: "DELETED" },
    { value: "REJECTED", label: "REJECTED" },
    { value: "RELIEVED", label: "RELIEVED" },
  ];
  /** form marital status options */
  maritalStatusOptions = [
    { label: "UNMARRIED", value: "UNMARRIED" },
    { label: "MARRIED", value: "MARRIED" },
    { label: "WIDOW", value: "WIDOW" },
    { label: "SINGLE", value: "SINGLE" },
  ];
  /** gender option */
  genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Transgender", value: "Transgender" },
  ];
  /** relation options */
  realtionOptions = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Brother", label: "Brother" },
    { value: "Sister", label: "Sister" },
    { value: "Friend", label: "Friend" },
    { value: "Spouse", label: "Spouse" },
    { value: "Others", label: "Others" },
  ];
  /** blood gruop options */
  bloodGroupOptions = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
  ];
  /** active status options */
  activestatusOptions = [
    { value: "Y", label: "Active" },
    { value: "N", label: "InActive" },
  ];

  /** menu items */
  items: MenuItem[] = [
    {
      icon: "pi pi-plus-circle",
      tooltipOptions: {
        tooltipLabel: "Add Employee",
      },
      command: () => {
        this.showContractorForm();
        this.showUpdateButton();
        this.showApprovebutton();
      },
    },
    {
      icon: "pi pi-download",
      tooltipOptions: {
        tooltipLabel: "Download",
      },
      command: () => {
        this.exportexcel();
        this.messageService.add({
          severity: "info",
          summary: "Data Converted.",
        });
      },
    },
  ];

  form: any;
  filterinfo: any = [];
  colname: any;
  colvalue: any;
  searchfilterinfo: any;
  currentDate: Date;
  Date: any = "Date";
  DOJmaxDate: Date;
  DOJminDate: Date;
  DOJLimit:number;
  lockDate: any;

  DoEminDate: any;
  DoEmaxDate: any;

  selected: any;
  url: any = environment.path + "/";
  fileUrl: SafeUrl | null = null;

  lastId: any;
  contractorData: any;
  pincodeData: any;
  payscaleData: any;
  payrollData: any;
  ClEmployeeData: any;
  reasonData: any;
  plntWise: any;
  selectedPayscale: any;
  selectedPayrollData: any;
  selectedContractorData: any;
  Pay_apln_slno: any;

  contractorEmployee: ContractorEmployee = new ContractorEmployee();
  plant_Code: any = sessionStorage.getItem("plantcode");
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  // new
  plant: any = sessionStorage.getItem("plantcode");
  religionData: any;
  conSubmitData: any;
  ClHRdata: any;
  filteredClHRdata: any[] = [];
  ClHrApprdata: any;
  Searchfilter: any[] = [];
  searchQuery: string;
  /** type changed */
  selectedPhoto: any;
  dolUpdate = false;
  obj: any;
  dept: any;
  line: any;
  Roles: any;
  repTo: any;
  reportingto: any;
  changeline: any;
  isDOJReadOnly = false;
  activeData: any;
  contractorForm = false;
  showRejectFrom = false;
  conEmpEditFlag = false;
  isLinear = true;
  inputDisabled = true;
  selectPayscale = false;
  showUpdate = false;
  showedit = false;
  showApprove = false;
  showRelieving = false;
  editable = false;
  status: any;
  issupervisor: string | null = sessionStorage.getItem("issupervisor");
  ishrappr: string | null = sessionStorage.getItem("ishrappr");
  isadmin: string | null = sessionStorage.getItem("isadmin");
  ishr: string | null = sessionStorage.getItem("ishr");
  maxDate = new Date();
  all: any;
  userDetails: any;
  payscales: any;
  // new changes from RML
  NewPayScaleFormGroup: FormGroup;
  payscaleForm = false;
  payscale_Data: any;
  cont_id: any;
  payrollArea: any = [];
  constructor(
    private fb1: UntypedFormBuilder,
    private location: Location,
    private service: ApiService,
    private fb: FormBuilder,
    public loader: LoaderserviceService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private apiService: ApiService,
    private dialog: MatDialog,
    private api: ClamAPIService,
    private messageService: MessageService,
  ) {
    this.DOJmaxDate = new Date();
    this.DOJminDate = new Date();
    this.DOJminDate.setDate(this.DOJminDate.getDate() - 5);

    this.form = this.fb1.group({
      status: new UntypedFormControl(" "),
      CName: new UntypedFormControl(" "),
      EName: new UntypedFormControl(" "),

      plantcode: [sessionStorage.getItem("plantcode")],
      emp_code: [sessionStorage.getItem("user_name")],
    });
    // this.calculateMinDate();
  }

  ngOnInit(): void {
    /** logged in user data */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails =
        this.all.Emp_Name.toUpperCase() +
        `(${this.all.User_Name})` +
        "-" +
        this.all.dept_name +
        "-" +
        this.all.plant_name;
    }
    /** contractor basic form */
    this.contractEmpBasicDetails = this.fb.group({
      apln_slno: [""],
      plantCode: [""],
      contractorName: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      employeeName: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      spouseName: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      maritalStatus: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      DOB: [
        "",
        {
          validators: [Validators.required],
          // updateOn: "blur",
          disabled: false,
        },
      ],
      EmpMobileNo: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]\\d{9}")],
          updateOn: "blur",
        },
      ],
      gender: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      adhaarNo: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{12}")],
          updateOn: "blur",
          disabled: false,
        },
      ],
      religion: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      Caste: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      // adhaarNo: ['', [Validators.required, Validators.pattern("[0-9]{12}")], { updateOn: 'blur' }],
      Photo_Name: [""],
      Photo_File: [""],
    });
    /** contractor other details */
    this.contractEmpOtherDetails = this.fb.group({
      addressCheckBox: [false, { disabled: false }],
      address: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      pincode: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{6}")],
          updateOn: "blur",
          disabled: false,
        },
      ],
      city: [
        "",
        { validators: [Validators.required], updateOn: "blur", disabled: true },
      ],
      state: [
        "",
        { validators: [Validators.required], updateOn: "blur", disabled: true },
      ],
      TempAddress: ["", { disabled: false }],
      TempPincode: ["", { disabled: false }],
      TempCity: ["", { disabled: false }],
      TempState: ["", { disabled: false }],
      emergencyContactNo: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]\\d{9}")],
          updateOn: "blur",
        },
      ],
      emergencyContactPerson: [
        "",
        { validators: [Validators.required], updateOn: "blur" },
      ],
      emergencyContactRelation: [
        "",
        { validators: [Validators.required], updateOn: "blur" },
      ],
      bloodGroup: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      Van_Eligible: ["No", Validators.required],
      PF_UAN: [""],
      ESI_No: [""],
      transporter: [{ value: "", disabled: false }],
      village: [{ value: "", disabled: false }],
    });
    /** contract employee details */
    this.contractEmpDetails = this.fb.group({
      empId: [{ value: "", disabled: true }],
      bioMiD: [{ value: "", disabled: true }],
      DorInD: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      dept: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      line: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      Role: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      reToPerson: [
        "",
        {
          validators: [Validators.required],
          updateOn: "blur",
          disabled: false,
        },
      ],
      DOJ: [
        "",
        {
          validators: [Validators.required],
          // updateOn: "blur",
          disabled: false,
        },
      ],
      payrollArea: ["", Validators.required],
      costCenter: [""],
      legacyNumberOne: [""],
      legacyNumberTwo: [""],
    });
    /** employee payscale details */
    this.contractEmpPayscaleDetails = this.fb.group({
      payscaleCode: [""],
    });
    /** contract employee reliving details */
    this.contractEmpReleavingDetails = this.fb.group({
      actOrInAct: ["Yes"],
      servicePeriod: [{ value: "", disabled: true }],
      DOJ: [{ value: this.contractEmpDetails.get("DOJ")?.value }],
      DOE: [
        { value: this.contractEmpDetails.get("DOJ")?.value, disabled: true },
      ],
      reasonForReleaving: [{ value: "", disabled: true }],
      status: ["Y"],
      apln_status: ["PENDING"],
      rejectionReason: [""],
    });
    // new chages from RML
    this.payscaledetails = this.fb.group({
      payscaledetails: ["", Validators.required],
    });
    this.contractEmpDetails2 = this.fb.group({
      pay: ["", Validators.required],
      // other controls if needed
    });

    this.currentDate = new Date();
    if (this.ishrappr == "true") {
      /** set filter default status if HR Approver*/
      this.form.controls["status"].setValue("SUBMITTED");
    } else {
      /** set filter status */
      this.form.controls["status"].setValue("PENDING");
    }
    this.form.controls["CName"].setValue("");
    this.form.controls["EName"].setValue("");
    this.searchfilter();
    /**
     * detect value changes @property {*} contractEmpReleavingDetails
     * add validations and enable input fields
     *  */
    this.contractEmpReleavingDetails
      .get("status")
      .valueChanges.subscribe((value: string) => {
        if (value === "N") {
          this.contractEmpReleavingDetails.get("DOE").enable();
          this.contractEmpReleavingDetails.get("reasonForReleaving").enable();
          this.contractEmpReleavingDetails.get("servicePeriod").enable();
          this.contractEmpReleavingDetails
            .get("DOE")
            .setValidators([Validators.required]);
          this.contractEmpReleavingDetails
            .get("reasonForReleaving")
            .setValidators([Validators.required]);
          // this.calculateServicePeriod(); -- by sporada
        } else {
          this.contractEmpReleavingDetails.get("DOE").disable();
          this.contractEmpReleavingDetails.get("DOE").reset();
          this.contractEmpReleavingDetails.get("reasonForReleaving").disable();
          this.contractEmpReleavingDetails.get("reasonForReleaving").reset();
          this.contractEmpReleavingDetails.get("servicePeriod").disable();
          this.contractEmpReleavingDetails.get("servicePeriod").reset();
          this.contractEmpReleavingDetails.get("DOE").clearValidators();
          this.contractEmpReleavingDetails
            .get("reasonForReleaving")
            .clearValidators();
        }
      });

    this.getContractorDetails();
    // new
    // this.getPayscale()
    // this.getPayroll()
    this.getPincode();
    this.getReligion();
    this.getAllClEmployees();
    this.getClHrAppr();
    // new
    // this.applySearch()
    this.get_Last_EmpID();
    // new
    this.getReligion();
    this.get_dept();
    this.getReason();
    /**
     * register observable to find dept_slno on value changes
     * update @property {*} contracEmpDetails line and reporting authority
     */
    this.contractEmpDetails
      .get("dept")
      .valueChanges.subscribe((deptSlno: any) => {
        const selectedDept = this.dept.find(
          (d: any) => d.dept_slno === deptSlno,
        );
        /** check and patchvalue */
        if (selectedDept) {
          this.contractEmpDetails.patchValue({
            line: selectedDept.Line_code,
            reToPerson: selectedDept.empl_slno,
          });
        }
      });
     // new payscale form
    this.NewPayScaleFormGroup = this.fb.group({
      PayScale_ID: [null],
      Plant_Code: [null],
      Cont_ID: [null],
      PayScale_Name: [null],
      Stipend: [null],
      Basic: [null],
      DA: [null],
      HRA: [null],
      Leave_Salary: [null],
      Washing_allow: [null],
      Monthly_Bonus: [null],
      Sat_and_Mon_Incentive: [null],
      Monthly_Attn_Incentive: [null],
      Retention_Incentive: [null],
      Spl_allow: [null],
      Night_shift_allowance: [null],
      Skilled_allow_P3: [null],
      Amenities_Allow: [null],
      Other_allowance_1: [null],
      Other_allowance_2: [null],
      Other_allowance_3: [null],
      Other_allowance_4: [null],
      Gross_Earning: [null],
      Canteen: [null],
      Transport: [null],
      Professional_Tax: [null],
      WC_Policy: [null],
      Insurance: [null],
      Shoe_FirstTime: [null],
      Glass_FirstTime: [null],
      Uniform_FirstTime: [null],
      Coat_FirstTime: [null],
      Other_deduction_1: [null],
      Other_deduction_2: [null],
      Other_deduction_3: [null],
      Other_deduction_4: [null],
      Gross_Deduction: [null],
      Service_Charge_Fixed: [null],
      Service_charges_Percentage: [null],
      SC_Base: [null],
      NSDC_Contribution: [null],
      Uniform_Charges: [null],
      Labour_Welfare_Fund: [null],
      Insurance_Premium: [null],
      Learning_Fees: [null],
      Workmen_Compensation: [null],
      Emp_Comp_Ins: [null],
      Higher_Education_Fee: [null],
      EM_ESI_Cal_Val: [null],
      EM_PF_Cal_Val: [null],
      EMP_PF_Cal_Val: [null],
      EMP_ESI_Cal_Val: [null],
      EM_PF_Percent: [null],
      EM_ESI_Percent: [null],
      EMP_PF_Percent: [null],
      EMP_ESI_Percent: [null],
      Service_Tax_Val: [null],
      Servive_Charge_Val: [null],
      Effective_Date: [null],
      Effective_Date1: [null],
      CTC: [null],
      ToTal_Base_Value: [null],
      Net_Take_Home: [null],
    })
  }

  /** #new */
 onOptionSelected(selectedData: any) {
    console.log("Selected data:", selectedData);
    this.selectedPayscale = selectedData;
    this.payscaleForm = true;
    this.get_Payscale(selectedData);   // Pass selected pay scale ID
    // Do not patch the form here anymore
  }
  /** 
   * get payscale by payscale ID #new
   * @param payId
   */
   get_Payscale(payId: any) {
    console.log('user selected Pay scale ID:',payId);
    /** payload */
    const data = {
      plant_Code: this.plant,
      con_id: this.cont_id,
      PayScale_ID: payId
    };

    this.api.getSinglePayscale(data).subscribe({
      next: (res: any) => {
        this.payscale_Data = res;
        console.log('Seleceted Payscale Data:',res);
        if (Array.isArray(res) && res.length > 0) {
          this.payscaleForm = true;
          this.NewPayScaleFormGroup.patchValue(res[0]);
        } else {
          console.warn("No payscale data found or invalid format.");
          this.messageService.add({severity:'info',summary:'Payscale Not Found!'})
        }
      },
      error: (error) => {
        console.error("Error fetching payscale:", error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }
  /**
   *  change payscal form value #new
   * @param event
   * @param controlName
   */
   onInputChanged(event: any, controlName: string) {
    const newValue = event.target.value;
    const numericValue = parseFloat(newValue);
    this.NewPayScaleFormGroup.get(controlName)?.patchValue(numericValue);
  }
  log() {
    console.log(this.contractEmpBasicDetails.value);
    console.log(this.contractEmpDetails.value);
    console.log(this.contractEmpOtherDetails.value);
  }

  /**
   * handle transport if selected
   */
  handletransport() {
    this.contractEmpOtherDetails
      .get("Van_Eligible")
      .valueChanges.subscribe((value: any) => {
        const transporterControl =
          this.contractEmpOtherDetails.get("transporter");
        const villageControl = this.contractEmpOtherDetails.get("village");

        if (value === "Yes") {
          transporterControl.setValidators([Validators.required]);
          villageControl.setValidators([Validators.required]);
        } else {
          transporterControl.clearValidators();
          villageControl.clearValidators();
        }

        transporterControl.updateValueAndValidity();
        villageControl.updateValueAndValidity();
      });
  }

  formatDateWithHr(inputDate: Date): String {
    const parsedDate = moment(inputDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedDate = parsedDate.format("YYYY-MM-DD HH:mm:ss.SSS");
    return formattedDate;
  }

  formatDate(inputDate: Date): String {
    const parsedDate = moment(inputDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedDate = parsedDate.format("YYYY-MM-DD");
    console.log(formattedDate);

    return formattedDate;
  }

  /** calculate DOL min date and DOJmin date based on last lock date 
   * @param dateDoj
  */
  calculateMinDate(dateDoj: any) {
    this.service.getlockdateByCategory("T").subscribe((response: any) => {
      console.log("lock date", new Date(response.date));
      console.log("DOJ", dateDoj);

      this.lockDate = new Date(response.date);
      this.DoEminDate = this.lockDate > dateDoj ? this.lockDate : new Date(dateDoj);
      console.log(this.DoEminDate);
      /** calculate DOJ MIN & MAX DATE */
      if(this.DOJLimit){
       console.log('DOJ LIMIT:',this.DOJLimit);
       console.log('LOCK DATE:',this.lockDate);
       this.DOJminDate = moment(this.lockDate).subtract(this.DOJLimit, 'days').toDate();
       this.DOJmaxDate = moment().toDate(); // current date
       console.log('DOJ MIN,MAX DATE:',this.DOJminDate,this.DOJmaxDate)
      }
    });

    const currentDate = new Date();
    // this.DoEminDate = new Date(currentDate.setDate(currentDate.getDate() - 60));
    this.DoEmaxDate = new Date();
    // console.log(currentDate);

    //  this.DoEmaxDate = new Date(currentDate.setDate(currentDate.getDate() ))
  }

  /** get back date DOJ */
  getDOJBackDate(){
    this.apiService.getbackdate().subscribe({
      next:(response:any) => {
        if(response?.status == 'success'){
          this.DOJLimit = response.data.doj_limit
        }
      },
      error: (error:any) => {
      console.log('DOJ BACKDATE API ERROR:',error);
      this.messageService.add({severity:'error',summary:error?.message})
      }
    })
  }

  keyPressAlphaNumeric(event: any) {
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

  /**
   * get contract onboard details based on application status
   * @property {*} filterinfo
   */
  searchfilter() {
    this.api.searchFilter(this.form.value).subscribe({
      next: (res) => {
        this.filterinfo = res;
        console.log("Contractor employee data:", res);
      },
      error: (error) => {
        console.error("SEARCH API ERROR:", error);
        this.messageService.add({
          severity: "error",
          summary: error?.error?.message,
        });
      },
    });
  }

  seletePayscale(event: any) {
    this.selectPayscale = true;
    const selectedPayscaleSlNo = event;
    this.selectedPayscale = this.payscaleData.find(
      (data: any) => data.Payscale_SlNo === selectedPayscaleSlNo,
    );
    // console.log(this.selectedPayscale)
    this.selectedPayrollData = this.payrollData.filter(
      (data: any) =>
        data.Plant_code === this.plant_Code && data.Status === true,
    );
    // console.log(this.selectedPayrollData)
    this.selectedContractorData = this.contractorData.filter(
      (data: any) =>
        data.Con_Id === this.contractEmpBasicDetails.value.contractorName,
    );
    // console.log(this.selectedContractorData)
    // this.apln_slno
  }
  // calculate service years
  onDOESelected(event: MatDatepickerInputEvent<Date>) {
    console.log("DOE date change event:", event);
    if (event) {
      this.calculateServicePeriod();
    }
  }

  mobileNumber(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.length > 10) {
      inputElement.value = value.slice(0, 10);
      this.contractEmpBasicDetails.patchValue({
        [controlName]: value.slice(0, 10),
      });
    }
  }

  adhaarNumber(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.length > 12) {
      inputElement.value = value.slice(0, 12);
      this.contractEmpBasicDetails.patchValue({
        [controlName]: value.slice(0, 12),
      });
    }
  }

  /**
   * calcaulate service period for employee releaving
   */
  calculateServicePeriod() {
    console.log("contract employee details:", this.contractEmpDetails.value);
    const doj = new Date(this.contractEmpDetails.get("DOJ").value);
    const doe = new Date(this.contractEmpReleavingDetails.get("DOE").value);
    console.log("DOJ:", doj);
    console.log("DOE", doe);

    if (isNaN(doj.getTime()) || isNaN(doe.getTime())) {
      this.contractEmpReleavingDetails.get("servicePeriod").setValue("");
    } else {
      const diffInMilliseconds = Math.abs(doe.getTime() - doj.getTime());
      // console.log(diffInMilliseconds)
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const millisecondsPerMonth = millisecondsPerDay * 30.44;
      const millisecondsPerYear = millisecondsPerDay * 365.25;
      const diffInYears = Math.floor(diffInMilliseconds / millisecondsPerYear);
      const diffInMonths = Math.floor(
        (diffInMilliseconds % millisecondsPerYear) / millisecondsPerMonth,
      );
      const diffInDays = Math.floor(
        (diffInMilliseconds % millisecondsPerMonth) / millisecondsPerDay,
      );

      // console.log(`${diffInYears} years, ${diffInMonths} months, ${diffInDays} days`)

      this.contractEmpReleavingDetails
        .get("servicePeriod")
        .setValue(
          this.calculateServiceDuration(
            this.contractEmpDetails.get("DOJ").value,
            this.contractEmpReleavingDetails.get("DOE").value,
          ),
        );
    }

    console.log(
      "service period:",
      this.calculateServiceDuration(
        this.contractEmpDetails.get("DOJ").value,
        this.contractEmpReleavingDetails.get("DOE").value,
      ),
    );
  }

  calculateServiceDuration(doj: string, dol: string): string {
    const startDate = new Date(doj);
    const endDate = new Date(dol);

    if (endDate < startDate) {
      throw new Error("Date of Leaving cannot be before Date of Joining");
    }

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust days
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust months
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} years,${months} months,${days} days`;
  }

  forReleaving(event: any) {
    const selectedStatus = this.contractEmpReleavingDetails.value.status;
    // console.log('Selected Status:', selectedStatus);
  }

  openAlertDialog(message: string, iCon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: iCon,
        message: message,
      },
    });
  }

  throwError(message: string): void {
    throw new Error(message);
  }

  // getPayscale() {
  //   this.api.get_Payscale_Master(this.plant_Code).subscribe(
  //     (res) => {
  //       this.payscaleData = res;
  //       // console.log(this.payscaleData)
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //   );
  // }

  // get playroll data api call function
  getPayroll() {
    this.api.get_Payroll_Master().subscribe({
      next: (res) => {
        this.payrollData = res;
        this.plntWise = this.payrollData.filter(
          (data: any) =>
            data.Plant_code === this.plant_Code && data.Status === true,
        );
      },
      error: (error) => {
        console.log('GET PAYROLL API ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  // function to copy permanant address to temp address
  copyPermanentAddress(event: any) {
    // console.log(this.contractEmpOtherDetails.get('addressCheckBox')?.value)
    // console.log(event)
    // console.log(event.checked)

    if (event.checked) {
      this.contractEmpOtherDetails.patchValue({
        TempAddress: this.contractEmpOtherDetails.get("address").value,
        TempPincode: this.contractEmpOtherDetails.get("pincode").value,
        TempCity: this.contractEmpOtherDetails.get("city").value,
        TempState: this.contractEmpOtherDetails.get("state").value,
      });
      this.contractEmpOtherDetails.get("TempAddress").disable();
      this.contractEmpOtherDetails.get("TempPincode").disable();
      this.contractEmpOtherDetails.get("TempCity").disable();
      this.contractEmpOtherDetails.get("TempState").disable();
    } else {
      this.contractEmpOtherDetails.patchValue({
        TempAddress: "",
        TempPincode: "",
        TempCity: "",
        TempState: "",
      });
      this.contractEmpOtherDetails.get("TempAddress").enable();
      this.contractEmpOtherDetails.get("TempPincode").enable();
      this.contractEmpOtherDetails.get("TempCity").enable();
      this.contractEmpOtherDetails.get("TempState").enable();
    }
  }

  /** get contractors details  */
  getContractorDetails() {
    this.api.getContractor().subscribe({
      next: (res) => {
        this.contractorData = res;
        /** filter active status and plant contractors */
        this.activeData = this.contractorData.filter(
          (item: any) =>
            item.Status === true && item.Plant_code === this.plant_Code,
        );
      },
      error: (error) => {
        console.error("GET CONTRACTOR API ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  /**
   * get pincodes
   * @property {*} pincodeData
   *   */
  getPincode() {
    this.api.get_pincode().subscribe({
      next: (res) => {
        this.pincodeData = res;
      },
      error: (error) => {
        console.error("GET PINCODE API ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  /**
   * get reliving details
   * @property {*} reasonData
   */
  getReason() {
    this.api.get_ror().subscribe({
      next: (res) => {
        this.reasonData = res;
        console.log("Relive resaon", res);
      },
      error: (error) => {
        console.error("GET RELIVE REASON API ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  /**
   * get religion data
   * @property {*} religionData
   */
  getReligion() {
    this.api.get_religion().subscribe({
      next: (res: any) => {
        this.religionData = res;
        console.log("religion data:", res);
      },
      error: (error) => {
        console.error("GET RELIGION API ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  // permanent address state and city by pincode function
  getCity_State_Perm(event: any) {
    const enteredPincode = event.value;
    // console.log(enteredPincode)
    const selectedPincode = this.pincodeData.find(
      (item: any) => item.pincode.toString() === enteredPincode.toString(),
    );
    if (selectedPincode) {
      this.contractEmpOtherDetails.patchValue({
        city: selectedPincode.districtname,
        state: selectedPincode.statename,
      });
    } else {
      this.contractEmpOtherDetails.patchValue({
        city: "",
        state: "",
      });
    }
  }
  // temp address state and city by pincode function
  getCity_State_Temp(event: any) {
    const enteredPincode = event.value;
    const selectedPincode = this.pincodeData.find(
      (item: any) => item.pincode.toString() === enteredPincode.toString(),
    );
    // console.log(selectedPincode)
    if (selectedPincode) {
      this.contractEmpOtherDetails.patchValue({
        TempCity: selectedPincode.districtname,
        TempState: selectedPincode.statename,
      });
    } else {
      this.contractEmpOtherDetails.patchValue({
        TempCity: "",
        TempState: "",
      });
    }
  }

  // get dept api call function
  get_dept() {
    this.api.getDepList(this.plant_Code).subscribe({
      next:(res) => {
        this.dept = res;
        console.log('department res:',res)
      },
      error: (error) => {
        console.log('DEPT API ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  // get line and role
  getline_Role_1(event: any) {
    this.getLineName(event);
    this.getRoleMaster(event);
  }
  // get line and role
  getline_Role(event: any) {
    console.log("vent", event.value);
    console.log("vent", event);

    this.getLineName(event.value);
    this.getRoleMaster(event.value);
  }
  // get line api call function
  getLineName(event: any) {
    this.api.getLine(event).subscribe({
      next:(res: any) => {
        this.line = res[0];
        this.repTo = res[1];
      },
      error: (error) => {
        console.log('GET LINE API ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  /** 
   * get payscales #integrate API
   * @param event
   * @param selectedPayScaleId
   */
  getPayScales(event: any, selectedPayScaleId?: number) {
    console.log('get payscale event: ', event);
    this.api.getContPayscale(event).subscribe({
      next:(res: any) => {
        this.payscales = res;

        // Set the selected payscale if provided and the control exists
        if (selectedPayScaleId != null) {
          this.contractEmpDetails2.controls['pay'].setValue(selectedPayScaleId);
        }
      },
      error: (error:any) => {
        console.log('GET PAYSCALES ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
    });
  }

  // get  role master api call function
  getRoleMaster(event: any) {
    console.log("Role event", event);
    this.api.getRoleName(event).subscribe({
      next: (res: any) => {
        this.Roles = res[0];
        console.log('ROLE RES:',res);
      },
      error: (error) => {
        console.error('GET ROLE MASTER API ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }
  /**
   * dropdown role change handle function
   * @param event 
   */
  onRoleChange_1(event: any) {
    console.log("Selected Role ID:", event.value);

    const selectedRoleId = Number(event.value); // Access value directly from the event
    const selectedRole = this.Roles.find(
      (role: any) => role.Role_Id === selectedRoleId,
    );

    if (selectedRole) {
      this.contractEmpDetails
        .get("DorInD")
        ?.setValue(selectedRole.Category_Name);
    } else {
      this.contractEmpDetails.get("DorInD")?.setValue("");
    }
  }

  /**
   * line and report to handle function
   * @param deptSlno
   */
  populateLineAndRepTo(deptSlno: number) {
    const selectedDept = this.dept.find((d: any) => d.dept_slno === deptSlno);
    this.contractEmpDetails.patchValue({
      line: selectedDept.Line_code,
      reToPerson: selectedDept.empl_slno,
    });
  }

  /**
   * to Get All CL Employee Details
   * 
   */
  getAllClEmployees() {
    this.api.get_Cl_Emp_Hr().subscribe({
      next: (res) => {
        this.ClHRdata = res;
        this.ClHRdata = this.ClHRdata.filter(
          (data: any) => data.plant_code === this.plant_Code,
        );
        // console.log(this.ClHRdata)
        // this.filteredClHRdata = this.ClHRdata

        // console.log(this.ClHRdata)
        // if (this.ishr === 'true' || this.issupervisor === 'true') {
        //   this.filteredClHRdata = this.ClHRdata.filter(
        //     (data: any) => data.plant_code === this.plant_Code );
        //     // console.log(this.ClHRdata)
        // }
        // else if (this.isadmin === 'true') {
        //   this.ClHRdata = this.ClHRdata;
        // }
      },
      error: (error) => {
        if (error.status === 400) {
          this.messageService.add({severity:'warn',summary:'Error while retreiving Data'})
        } else {
          this.messageService.add({severity:'error',summary:error?.message})
        }
        console.error('GET ALL CL EMPLOYEES ERROR:',error?.message)
      },
    });
  }

  getClHrAppr() {
    // console.log(plant_code)
    //   this.api.get_Cl_Emp_Hrappr(this.plant_Code).subscribe(res=>{
    // this.ClHrApprdata = res
    // this.Searchfilter = this.ClHrApprdata
    // // console.log(this.Searchfilter)
    //   },(error)=>{
    //     if(error.status === 400){
    //       alert("Error while retreiving Data ")
    //     }else{
    //       alert("Something went wrong")
    //     }
    //   })
  }

  /** get last employee id api call function */
  get_Last_EmpID() {
    this.api.get_Last_EmpID().subscribe({
      next: (res) => {
        console.log('LAST EMP ID:',res);
        this.lastId = res;
      },
      error: (error) => {
        console.error('GET LAST EMP ID ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }

  // contract employee temp password
  createTempPassword(dateOfBirth: any) {
    const parts = dateOfBirth.split("-");
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];
    // console.log(day + month + year)
    return day + month + year;
  }

  // file change event
  onFileChange(input: HTMLInputElement) {
    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
      // console.log(this.selectedPhoto);

      this.contractEmpBasicDetails.patchValue({
        Photo_File: this.selectedPhoto,
        Photo_Name: this.selectedPhoto.name,
      });
      
    }
  }

  // view file function
  viewFile(): void {
    const fileName = this.contractEmpBasicDetails.get("Photo_Name")?.value;
    // console.log(fileName);
    if (fileName) {
      const fileUrl = this.url + `Cl_Photo_Upload/${fileName}`;
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      this.contractEmpBasicDetails.controls["Photo_File"].setValue(fileUrl);
    }
  }

  //TO SUBMIT THE FORM
  SubmitBasicDetails(event: any) {
    event.preventDefault();
    if (this.validateStep(1) && this.validateStep(2)) {
      this.contractorEmployee.apln_slno = this.lastId;
      this.contractorEmployee.plant_code = this.plant_Code;
      this.contractorEmployee.Contractor_ID =
        this.contractEmpBasicDetails.value.contractorName;
      this.contractorEmployee.fullname =
        this.contractEmpBasicDetails.value.employeeName;
      this.contractorEmployee.fathername =
        this.contractEmpBasicDetails.value.spouseName;
      this.contractorEmployee.marital_status =
        this.contractEmpBasicDetails.value.maritalStatus;
      this.contractorEmployee.birthdate = this.formatDate(
        this.contractEmpBasicDetails.value.DOB,
      ).toString();
      this.contractorEmployee.gender =
        this.contractEmpBasicDetails.value.gender;
      this.contractorEmployee.mobile_no1 =
        this.contractEmpBasicDetails.value.EmpMobileNo;
      this.contractorEmployee.aadhar_no =
        this.contractEmpBasicDetails.value.adhaarNo;
      this.contractorEmployee.religion =
        this.contractEmpBasicDetails.value.religion;
      this.contractorEmployee.Caste = this.contractEmpBasicDetails.value.Caste;

      this.contractorEmployee.permanent_address =
        this.contractEmpOtherDetails.value.address;
      this.contractorEmployee.city = this.contractEmpOtherDetails.value.city;
      this.contractorEmployee.state_name =
        this.contractEmpOtherDetails.value.state;
      this.contractorEmployee.pincode =
        this.contractEmpOtherDetails.value.pincode;

      if (this.contractEmpOtherDetails.value.addressCheckBox) {
        // Temp Address
        this.contractorEmployee.present_address =
          this.contractEmpOtherDetails.value.address;
        this.contractorEmployee.pres_city =
          this.contractEmpOtherDetails.value.city;
        this.contractorEmployee.pres_state_name =
          this.contractEmpOtherDetails.value.state;
        this.contractorEmployee.pres_pincode =
          this.contractEmpOtherDetails.value.pincode;
      } else {
        // Temp Address
        this.contractorEmployee.present_address =
          this.contractEmpOtherDetails.value.TempAddress;
        this.contractorEmployee.pres_city =
          this.contractEmpOtherDetails.value.TempCity;
        this.contractorEmployee.pres_state_name =
          this.contractEmpOtherDetails.value.TempState;
        this.contractorEmployee.pres_pincode =
          this.contractEmpOtherDetails.value.TempPincode;
      }

      this.contractorEmployee.mobile_no2 =
        this.contractEmpOtherDetails.value.emergencyContactNo;
      this.contractorEmployee.emergency_name =
        this.contractEmpOtherDetails.value.emergencyContactPerson;
      this.contractorEmployee.emergency_rel =
        this.contractEmpOtherDetails.value.emergencyContactRelation;
      this.contractorEmployee.blood_group =
        this.contractEmpOtherDetails.value.bloodGroup;
      this.contractorEmployee.uan_number =
        this.contractEmpOtherDetails.value.PF_UAN;
      this.contractorEmployee.esi_no =
        this.contractEmpOtherDetails.value.ESI_No;
      this.contractorEmployee.Van_Eligible =
        this.contractEmpOtherDetails.value.Van_Eligible;
      this.contractorEmployee.transporter_name =
        this.contractEmpOtherDetails.value.transporter;
      this.contractorEmployee.village_name =
        this.contractEmpOtherDetails.value.village;
      this.contractorEmployee.created_dt = this.formatDate(
        new Date(),
      ).toString();
      // this.contractorEmployee.apln_status = this.contractEmpReleavingDetails.value.actOrInAct

      this.api.add_cl_Emp_ByCon(this.contractorEmployee).subscribe({
        next: (res: any) => {
          const formData = new FormData();
          formData.append("photo", this.selectedPhoto);

          this.api.photo_upload(formData, this.lastId).subscribe({
            next: (res) => {
              console.log("file Uploaded", res);
              this.messageService.add({severity:'info',summary:res?.message})
            },
            error: (error) => {
              console.log("FILE UPLOAD API ERROR:", error);
              this.messageService.add({
                severity: "error",
                summary: error.message,
              });
            },
          });
          //  this.openAlertDialog("Application Submitted succesfully, Waiting For HR to Submit")
          this.openAlertDialog(res, "check");
          this.hideContractorForm();
          //  this.getAllClEmployees()
          this.searchfilter();
          this.reset();
        },
        error:(error) => {
          if (error.status === 400) {
            // this.openAlertDialog(`${error.error}`, "error");
            console.log('FILE UPLOAD ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.message});
          } else {
            this.throwError("Error in connection");
            this.messageService.add({severity:'error',summary:error?.message})
          }
        },
      });
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Please Fill All Fields!",
      });
    }
  }

  /** update contractor details */
  updateByContractor() {
    this.contractorEmployee.plant_code =
      this.contractEmpBasicDetails.value.plantCode;
    this.contractorEmployee.apln_slno =
      this.contractEmpBasicDetails.value.apln_slno;
    this.contractorEmployee.Contractor_ID =
      this.contractEmpBasicDetails.value.contractorName;
    this.contractorEmployee.fullname =
      this.contractEmpBasicDetails.value.employeeName;
    this.contractorEmployee.fathername =
      this.contractEmpBasicDetails.value.spouseName;
    this.contractorEmployee.marital_status =
      this.contractEmpBasicDetails.value.maritalStatus;
    this.contractorEmployee.birthdate = this.contractEmpBasicDetails.value.DOB;
    this.contractorEmployee.gender = this.contractEmpBasicDetails.value.gender;
    this.contractorEmployee.mobile_no1 =
      this.contractEmpBasicDetails.value.EmpMobileNo;
    this.contractorEmployee.aadhar_no =
      this.contractEmpBasicDetails.value.adhaarNo;
    this.contractorEmployee.religion =
      this.contractEmpBasicDetails.value.religion;
    this.contractorEmployee.Caste = this.contractEmpBasicDetails.value.Caste;

    this.contractorEmployee.permanent_address =
      this.contractEmpOtherDetails.value.address;
    this.contractorEmployee.city = this.contractEmpOtherDetails.value.city;
    this.contractorEmployee.state_name =
      this.contractEmpOtherDetails.value.state;
    this.contractorEmployee.pincode =
      this.contractEmpOtherDetails.value.pincode;

    if (this.contractEmpOtherDetails.value.addressCheckBox) {
      // Temp Address
      this.contractorEmployee.present_address =
        this.contractEmpOtherDetails.value.address;
      this.contractorEmployee.pres_city =
        this.contractEmpOtherDetails.value.city;
      this.contractorEmployee.pres_state_name =
        this.contractEmpOtherDetails.value.state;
      this.contractorEmployee.pres_pincode =
        this.contractEmpOtherDetails.value.pincode;
    } else {
      // Temp Address
      this.contractorEmployee.present_address =
        this.contractEmpOtherDetails.value.TempAddress;
      this.contractorEmployee.pres_city =
        this.contractEmpOtherDetails.value.TempCity;
      this.contractorEmployee.pres_state_name =
        this.contractEmpOtherDetails.value.TempState;
      this.contractorEmployee.pres_pincode =
        this.contractEmpOtherDetails.value.TempPincode;
    }
    this.contractorEmployee.mobile_no2 =
      this.contractEmpOtherDetails.value.emergencyContactNo;
    this.contractorEmployee.emergency_name =
      this.contractEmpOtherDetails.value.emergencyContactPerson;
    this.contractorEmployee.emergency_rel =
      this.contractEmpOtherDetails.value.emergencyContactRelation;
    this.contractorEmployee.blood_group =
      this.contractEmpOtherDetails.value.bloodGroup;
    this.contractorEmployee.uan_number =
      this.contractEmpOtherDetails.value.PF_UAN;
    this.contractorEmployee.esi_no = this.contractEmpOtherDetails.value.ESI_No;
    this.contractorEmployee.Van_Eligible =
      this.contractEmpOtherDetails.value.Van_Eligible;
    this.contractorEmployee.transporter_name =
      this.contractEmpOtherDetails.value.transporter;
    this.contractorEmployee.village_name =
      this.contractEmpOtherDetails.value.village;

    // console.log(this.contractorEmployee)
    this.api.edit_Cl_Emp_ByCon(
        this.contractorEmployee,
        this.contractorEmployee.apln_slno,
      ).subscribe({
        next: (res: any) => {
          const formData = new FormData();
          formData.append(
            "photo",
            this.contractEmpBasicDetails.value.Photo_File,
          );
          // photo upload api call
          this.api
            .photo_upload(
              formData,
              this.contractEmpBasicDetails.value.apln_slno,
            )
            .subscribe({
              next:(res) => {
                console.log("file Uploaded", res);
                this.messageService.add({
                  severity: "info",
                  summary: res?.message,
                });
              },
              error: (error) => {
                console.error("FILE UPLOAD API ERROR:", error);
                this.messageService.add({
                  severity: "error",
                  summary: error.message,
                });
              },
            });

          this.openAlertDialog(res, "check");
          // this.getAllClEmployees()
          this.searchfilter();
          this.reset();
          this.hideContractorForm();
        },
        error: (error) => {
          if (error.status === 400) {
            // this.openAlertDialog("Data already exist ", "error");
            console.error('UPDATE CONTRACTOR ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.message})
          } else {
            // this.throwError("Error in connection");
            console.error('UPDATE CONTRACTOR ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.message});
          }
        },
      });
  }

  /**
   * delete contractor employee
   * @param apln_slno 
   * @param reason 
   * @param status 
   */
  delete_Cl_Emp_ByCon(apln_slno: any, reason: string, status: string) {
    // console.log(status)
    this.api.del_cl_Emp_byCon(apln_slno, reason, status).subscribe({
      next:(res: any) => {
        this.openAlertDialog(res, "check");
        // console.log(res);
        this.getAllClEmployees();
        this.searchfilter();
        this.reset();
      },
      error: (error) => {
        if (error.status === 400) {
          console.error('DELETE CL API ERROR:',error);
          // this.openAlertDialog(`${error.error}`, "error");
          this.messageService.add({severity:'error',summary:error?.message})
        } else {
          // this.openAlertDialog("Error in connection", "error");
          console.log('DELETE CL API ERROR:',error);
          this.messageService.add({severity:'error',summary:error?.message});
        }
      },
    });
  }

  openDeleteConfirmationDialog(apln_slno: any): void {
    var status: string;
    if (this.issupervisor === "true" || this.ishr === "true") {
      status = "DELETED";
    } else if (this.ishrappr === "true") {
      status = "REJECTED";
    } else {
      status = "PENDING";
    }
    const dialogRef = this.dialog.open(DelPopupComponent, {
      width: "400px",
      data: { apln_slno: apln_slno },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete_Cl_Emp_ByCon(result.apln_slno, result.reason, status);
      }
    });
  }

  /**
   * show apln delete toast
   * @param data
   */
  showAplnDelete(data: any) {
    // this.openAlertDialog(`${data} Application is Already Deleted`, "error");
    this.messageService.add({severity:'warn',summary:`${data} Application is already DELETED`})
  }

  showRel(value: boolean) {
    this.showRelieving = value;
    // console.log(value)
  }

  allowedit() {
    this.editable = !this.editable;
  }

  /** To view CL Employee Basic Details Details */
  onEditByHr(data: any, showButton: boolean) {
    /** get DOJ back date
     * @property {number} DOJLimit
     */
    this.getDOJBackDate();

    this.Pay_apln_slno = data.apln_slno;
    this.showContractorForm();
    this.status = data.apln_status;
    this.showeditButton(showButton);
    /** new from RML*/
    this.cont_id = data.cont_id;
    this.plant = data.plant_code;
    this.getPayScales(data.cont_id, data.PayScale_ID);
    // this.showApprovebutton(showButton)
    // this.allowedit(showButton)

    console.log("CL EDIT DATA:", data);
    // console.log(this.status)

    if (data.apln_status == "SUBMITTED" && this.ishrappr) {
      this.stepper.selectedIndex = 2;
      // console.log("executed")
    }
    if (data.apln_status == "PENDING" || data.apln_status == "Deleted") {
      this.showeditButton(showButton);
    } else if (
      data.apln_status == "SUBMITTED" ||
      data.apln_status == "RELIEVED" ||
      data.apln_status == "APPOINTED"
    ) {
      this.showeditButton(!showButton);
    }

    if (data.apln_status == "APPOINTED") {
      this.isDOJReadOnly = true;
      this.showRel(showButton);
    } else {
      this.isDOJReadOnly = false;
      this.showRel(!showButton);
    }

    // console.log(data,'view data')

    // const deptSlno = data.dept_slno?data.dept_slno.toString() :'';
    const dolValue = data.dol ? data.dol.toString() : "";
    const isapproved = data.isapproved ? data.isapproved.toString() : "";
    // const line_code= data.line_code?data.line_code.toString() :'';
    const remarks_rejd = data.remarks_rejd ? data.remarks_rejd.toString() : "";
    const reporting_to = data.reporting_to ? data.reporting_to.toString() : "";
    const Van_Eligible = data.Van_Eligible == true ? "Yes" : "No";

    // const workcontract = data.workcontract?data.workcontract.toString() :'';
    const rejectionreason = data.rejectionreason
      ? data.rejectionreason.toString()
      : "";

    this.contractEmpBasicDetails.controls["apln_slno"].setValue(data.apln_slno);
    this.contractEmpBasicDetails.controls["plantCode"].setValue(
      data.plant_code,
    );
    this.contractEmpBasicDetails.controls["contractorName"].setValue(
      data.cont_id,
    );
    // #NEW from RML
    this.getPayScales(data.cont_id, data.PayScale_ID);
    this.cont_id = data.cont_id;
    
    this.contractEmpBasicDetails.controls["employeeName"].setValue(
      data.fullname,
    );
    this.contractEmpBasicDetails.controls["spouseName"].setValue(
      data.fathername,
    );
    this.contractEmpBasicDetails.controls["maritalStatus"].setValue(
      data.marital_status,
    );
    this.contractEmpBasicDetails.controls["DOB"].setValue(data.birthdate);
    this.contractEmpBasicDetails.controls["EmpMobileNo"].setValue(
      data.mobile_no1,
    );
    this.contractEmpBasicDetails.controls["gender"].setValue(data.gender);
    this.contractEmpBasicDetails.controls["adhaarNo"].setValue(data.aadhar_no);
    this.contractEmpBasicDetails.controls["Caste"].setValue(data.caste_name);
    this.contractEmpBasicDetails.controls["religion"].setValue(
      Number(data.religion_sl),
    );
    this.contractEmpBasicDetails.controls["Photo_Name"].setValue(
      data.photo_filename,
    );
    // this.contractEmpBasicDetails.controls['Photo_Name'].setValue(data.photo_filename)

    this.contractEmpOtherDetails.controls["address"].setValue(
      data.permanent_address,
    );
    this.contractEmpOtherDetails.controls["pincode"].setValue(data.pincode);
    // this.contractEmpOtherDetails.controls['empId'].setValue(data.gen_id)

    this.contractEmpOtherDetails.controls["city"].setValue(data.city);

    this.contractEmpOtherDetails.controls["state"].setValue(data.state_name);
    this.contractEmpOtherDetails.controls["TempAddress"].setValue(
      data.present_address,
    );
    this.contractEmpOtherDetails.controls["TempPincode"].setValue(
      data.pres_pincode,
    );
    this.contractEmpOtherDetails.controls["TempCity"].setValue(data.pres_city);
    this.contractEmpOtherDetails.controls["TempState"].setValue(
      data.pres_state_name,
    );
    this.contractEmpOtherDetails.controls["bloodGroup"].setValue(
      data.blood_group,
    );
    this.contractEmpOtherDetails.controls["emergencyContactNo"].setValue(
      data.mobile_no2,
    );
    this.contractEmpOtherDetails.controls["emergencyContactPerson"].setValue(
      data.emergency_name,
    );
    this.contractEmpOtherDetails.controls["emergencyContactRelation"].setValue(
      data.emergency_rel ? data.emergency_rel?.toString() : "",
    );
    this.contractEmpOtherDetails.controls["PF_UAN"].setValue(data.uan_number);
    this.contractEmpOtherDetails.controls["ESI_No"].setValue(data.esi_no);
    this.contractEmpOtherDetails.controls["Van_Eligible"].setValue(
      Van_Eligible,
    );
    this.contractEmpOtherDetails.controls["transporter"].setValue(
      data.transporter_name,
    );
    this.contractEmpOtherDetails.controls["village"].setValue(
      data.village_name,
    );
    // contract employee HR Details
    this.contractEmpDetails.controls["empId"].setValue(data.gen_id);
    this.contractEmpDetails.controls["bioMiD"].setValue(data.biometric_no);
    this.contractEmpDetails.controls["DorInD"].setValue(data.Category_Name);
    this.contractEmpDetails.controls["dept"].setValue(data.dept_slno);
    this.getline_Role_1(data.dept_slno);
    this.contractEmpDetails.controls["line"].setValue(data.line_code);
    this.contractEmpDetails.controls["Role"].setValue(data.Role_Id);
    this.contractEmpDetails.controls["reToPerson"].setValue(data.reporting_to);
    this.contractEmpDetails.controls["DOJ"].setValue(data.doj);
    // new fields
    this.contractEmpDetails.controls["payrollArea"].setValue(data?.payrollArea);
    this.contractEmpDetails.controls["costCenter"].setValue(data?.cost_center);
    this.contractEmpDetails.controls["legacyNumberOne"].setValue(
      data?.legacy_no1,
    );
    this.contractEmpDetails.controls["legacyNumberTwo"].setValue(
      data?.legacy_no2,
    );

    this.contractEmpReleavingDetails.controls["DOE"]?.setValue(data.dol);
    // this.contractEmpReleavingDetails.controls['DOE']?.setValue(dolValue)
    this.contractEmpReleavingDetails.controls["apln_status"]?.setValue(
      data.apln_status,
    );
    this.contractEmpReleavingDetails.controls["status"]?.setValue(
      data.isapproved,
    );
    // this.contractEmpReleavingDetails.controls['status']?.setValue(isapproved)
    this.contractEmpReleavingDetails.controls["reasonForReleaving"]?.setValue(
      data.rejectionreason,
    );

    // this.contractEmpReleavingDetails.controls['rejectionReason']?.setValue(rejectionreason)

    // console.log(this.contractEmpDetails.value)
    /** #NEW FROM RML */
     if (data.PayScale_ID) {
      this.get_Payscale(data.PayScale_ID);
    }
    this.calculateMinDate(data.doj);

    // getpayroll for contract employee based on plant;
    this.getPayrollArea(this.plant_Code);

    if (data.apln_status == "SUBMITTED" && this.ishrappr) {
      this.stepper.selectedIndex = 2;
      // console.log("executed")
    }
    const fileName = data.photo_filename;
    if (fileName) {
      const fileUrl = this.url + `Cl_Photo_Upload/${fileName}`;
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      this.contractEmpBasicDetails.controls["Photo_File"].setValue(fileUrl);

      const licenseFileValue =
        this.contractEmpBasicDetails.controls["Photo_File"].value;
      if (licenseFileValue === fileUrl) {
        console.log("File successfully bound to Photo_File control.");
        this.messageService.add({
          severity: "info",
          summary: "File successfully bound to Photo_File control.",
        });
      } else {
        console.log("File binding failed.");
        this.messageService.add({
          severity: "info",
          summary: "File binding failed.",
        });
      }
    } else {
      console.log("No file provided.");
      this.messageService.add({
        severity: "warn",
        summary: "No file provided.",
      });
    }
  }

  // get payroll for contract employee onboard.#3B82F6
  getPayrollArea(plantcode: any) {
    this.service.getPayrollAreaByPlantcode(plantcode).subscribe({
      next: (response: any) => {
        if (response?.message) {
          this.messageService.add({
            severity: "info",
            summary: response.message,
          });
        }
        this.payrollArea = response;
        console.log(response);
      },
      error: (error) => {
        console.error('PAYROLL AREA API ERROR:',error);
        this.messageService.add({
          severity: "error",
          summary: error?.error?.message,
        });
      },
    });
  }

  // submit for approval function
  submitEmployeeDetails() {
    if (
      this.validateStep(1) &&
      this.validateStep(2) &&
      this.validateStep(3) &&
      this.validateStep(4) &&
      this.validateStep(5) &&
      this.validateStep(6) // #NEW FROM RML
    ) {
      this.contractorEmployee.apln_slno =
        this.contractEmpBasicDetails.value.apln_slno;

      this.contractorEmployee.plant_code =
        this.contractEmpBasicDetails.value.plantCode;
      this.contractorEmployee.Contractor_ID =
        this.contractEmpBasicDetails.value.contractorName;
      this.contractorEmployee.fullname =
        this.contractEmpBasicDetails.value.employeeName;
      this.contractorEmployee.fathername =
        this.contractEmpBasicDetails.value.spouseName;
      this.contractorEmployee.marital_status =
        this.contractEmpBasicDetails.value.maritalStatus;
      this.contractorEmployee.birthdate = this.formatDate(
        this.contractEmpBasicDetails.value.DOB,
      ).toString();
      this.contractorEmployee.gender =
        this.contractEmpBasicDetails.value.gender;
      this.contractorEmployee.mobile_no1 =
        this.contractEmpBasicDetails.value.EmpMobileNo;
      this.contractorEmployee.aadhar_no =
        this.contractEmpBasicDetails.value.adhaarNo;
      this.contractorEmployee.religion =
        this.contractEmpBasicDetails.value.religion;
      this.contractorEmployee.Caste = this.contractEmpBasicDetails.value.Caste;

      this.contractorEmployee.permanent_address =
        this.contractEmpOtherDetails.value.address;
      this.contractorEmployee.city = this.contractEmpOtherDetails.value.city;
      this.contractorEmployee.state_name =
        this.contractEmpOtherDetails.value.state;
      this.contractorEmployee.pincode =
        this.contractEmpOtherDetails.value.pincode;
      if (this.contractEmpOtherDetails.value.addressCheckBox) {
        // Temp Address
        this.contractorEmployee.present_address =
          this.contractEmpOtherDetails.value.address;
        this.contractorEmployee.pres_city =
          this.contractEmpOtherDetails.value.city;
        this.contractorEmployee.pres_state_name =
          this.contractEmpOtherDetails.value.state;
        this.contractorEmployee.pres_pincode =
          this.contractEmpOtherDetails.value.pincode;
      } else {
        // Temp Address
        this.contractorEmployee.present_address =
          this.contractEmpOtherDetails.value.TempAddress;
        this.contractorEmployee.pres_city =
          this.contractEmpOtherDetails.value.TempCity;
        this.contractorEmployee.pres_state_name =
          this.contractEmpOtherDetails.value.TempState;
        this.contractorEmployee.pres_pincode =
          this.contractEmpOtherDetails.value.TempPincode;
      }

      this.contractorEmployee.mobile_no2 =
        this.contractEmpOtherDetails.value.emergencyContactNo;
      this.contractorEmployee.emergency_name =
        this.contractEmpOtherDetails.value.emergencyContactPerson;
      this.contractorEmployee.emergency_rel =
        this.contractEmpOtherDetails.value.emergencyContactRelation;
      this.contractorEmployee.blood_group =
        this.contractEmpOtherDetails.value.bloodGroup;
      this.contractorEmployee.uan_number =
        this.contractEmpOtherDetails.value.PF_UAN;
      this.contractorEmployee.esi_no =
        this.contractEmpOtherDetails.value.ESI_No;

      this.contractorEmployee.Van_Eligible =
        this.contractEmpOtherDetails.value.Van_Eligible;
      this.contractorEmployee.transporter_name =
        this.contractEmpOtherDetails.value.transporter;
      this.contractorEmployee.village_name =
        this.contractEmpOtherDetails.value.village;

      this.contractorEmployee.workcontract =
        this.contractEmpDetails.value.DorInD;
      // contract empoyee HR APPROVER details
      this.contractorEmployee.dept_slno = this.contractEmpDetails.value.dept;
      this.contractorEmployee.line_code = this.contractEmpDetails.value.line;
      this.contractorEmployee.Role_ID = this.contractEmpDetails.value.Role;
      // new fields
      this.contractorEmployee.payrollArea =
        this.contractEmpDetails.value.payrollArea;
      this.contractorEmployee.costCenter =
        this.contractEmpDetails.value.costCenter;
      this.contractorEmployee.legacyNumberOne =
        this.contractEmpDetails.value.legacyNumberOne;
      this.contractorEmployee.legacyNumberTwo =
        this.contractEmpDetails.value.legacyNumberTwo;
      this.contractorEmployee.reporting_to =
        this.contractEmpDetails.value.reToPerson;
      this.contractorEmployee.doj = this.formatDate(
        this.contractEmpDetails.value.DOJ,
      ).toString();
      this.contractorEmployee.apln_status =
        this.contractEmpReleavingDetails.value.apln_status;

      if (this.contractEmpReleavingDetails.value.status === "N") {
        this.contractorEmployee.dol = this.formatDate(
          this.contractEmpReleavingDetails.value.DOE,
        ).toString();
        this.contractorEmployee.remarks_rejd =
          this.contractEmpReleavingDetails.value.reasonForReleaving;
      } else {
        this.contractorEmployee.dol = "";
        this.contractorEmployee.remarks_rejd = "";
      }
      this.contractorEmployee.status =
        this.contractEmpReleavingDetails.value.status;

      //  console.log(this.contractEmpReleavingDetails.value.apln_status)
      //  console.log(this.contractEmpReleavingDetails.value.plant_code)
      console.log("CONTRACT EMPLOYEE HR APPROVAL:", this.contractorEmployee);
      /** #NEW FROM RML */
      console.log('Selected PayScale:', this.selectedPayscale);
      const submissionData = {
        ...this.contractorEmployee,
        PayScale_ID: this.selectedPayscale,
        Created: this.userEmpcode
      };

    /** submit for HR approval */
      this.api
        .submit_cl_Emp_ByHR(
          submissionData, // NEW FROM RML
          this.contractorEmployee.apln_slno,
        )
        .subscribe({
          next:(res: any) => {
            const formData = new FormData();
            formData.append(
              "photo",
              this.contractEmpBasicDetails.value.Photo_File,
            );
            // photo api call
            this.api
              .photo_upload(
                formData,
                this.contractEmpBasicDetails.value.apln_slno,
              )
              .subscribe({
                next:(res) => {
                  console.log("file Uploaded", res);
                  this.messageService.add({ severity: "info", summary: res?.message });
                },
                error: (error) => {
                  this.messageService.add({
                    severity: "error",
                    summary: error.message,
                  });
                  console.error('FILE UPLOAD ERROR:',error);
                },
              });
            this.messageService.add({severity:'info',summary:res});
            this.searchfilter();
            this.reset();
            this.hideContractorForm();
          },
          error: (error) => {
            if (error.status === 400) {
              console.error('SUBMIT CL TRAINEE API ERROR:',error);
              this.messageService.add({severity:'error',summary:error?.message})
            } else {
              console.error('SUBMIT CL TRAINE API ERROR:',error)
              this.messageService.add({severity:'error',summary:error?.message})
            }
          },
        });
    }
  }

  // update HR
  update_By_HR() {
    this.contractorEmployee.apln_slno =
      this.contractEmpBasicDetails.value.apln_slno;
    this.contractorEmployee.marital_status =
      this.contractEmpBasicDetails.value.maritalStatus;
    this.contractorEmployee.fullname =
      this.contractEmpBasicDetails.value.employeeName;
    // this.contractEmpDetails.controls['empId'].setValue(data.gen_id)
    // this.contractEmpDetails.controls['bioMiD'].setValue(data.biometric_no)
    this.contractorEmployee.mobile_no1 =
      this.contractEmpBasicDetails.value.EmpMobileNo;
    this.contractorEmployee.mobile_no2 =
      this.contractEmpOtherDetails.value.emergencyContactNo;
    this.contractorEmployee.emergency_name =
      this.contractEmpOtherDetails.value.emergencyContactPerson;
    this.contractorEmployee.emergency_rel =
      this.contractEmpOtherDetails.value.emergencyContactRelation;
    this.contractorEmployee.uan_number =
      this.contractEmpOtherDetails.value.PF_UAN;
    this.contractorEmployee.esi_no = this.contractEmpOtherDetails.value.ESI_No;

    this.contractorEmployee.Van_Eligible =
      this.contractEmpOtherDetails.value.Van_Eligible;

    this.contractorEmployee.transporter_name =
      this.contractEmpOtherDetails.value.transporter;
    this.contractorEmployee.village_name =
      this.contractEmpOtherDetails.value.village;
    this.contractorEmployee.apln_status =
      this.contractEmpReleavingDetails.value.apln_status;
    this.contractorEmployee.status =
      this.contractEmpReleavingDetails.value.status;
    this.contractorEmployee.gen_id = this.contractEmpDetails.value.empId;
    this.contractorEmployee.biometric_no = this.contractEmpDetails.value.bioMiD;
    this.contractorEmployee.doj = this.contractEmpDetails.value.DOJ;

    if (this.contractEmpReleavingDetails.value.status === "N") {
      // this.validateStep(5)
      if (
        this.contractEmpReleavingDetails.value.DOE.length <= 0 ||
        this.contractEmpReleavingDetails.value.reasonForReleaving.length <= 0
      ) {
        //  aalow  updated buttonthi

        this.dolUpdate = true;
      } else {
        this.contractorEmployee.dol = this.formatDate(
          this.contractEmpReleavingDetails.value.DOE,
        ).toString();
        this.contractorEmployee.remarks_rejd =
          this.contractEmpReleavingDetails.value.reasonForReleaving;

        this.dolUpdate = false;
      }
    } else {
      this.contractorEmployee.dol = null;
      this.contractorEmployee.remarks_rejd = null;
      this.dolUpdate = false;
    }
    // console.log(this.contractorEmployee)

    this.api
      .edit_cl_Emp_ByHR(
        this.contractorEmployee,
        this.contractorEmployee.apln_slno,
      )
      .subscribe({
        next:(res: any) => {
          const formData = new FormData();
          formData.append(
            "photo",
            this.contractEmpBasicDetails.value.Photo_File,
          );
          // photo upload api call
          this.api
            .photo_upload(
              formData,
              this.contractEmpBasicDetails.value.apln_slno,
            )
            .subscribe({
              next: (res) => {
                console.log("file Uploaded", res);
                this.messageService.add({ severity: "info", summary: res?.message });
              },
              error: (error) => {
                console.error("FILE UPLOAD API ERROR:", error);
                this.messageService.add({
                  severity: "error",
                  summary: error.message,
                });
              },
            });
          this.openAlertDialog(res, "check");
          this.searchfilter();
          this.reset();
          this.hideContractorForm();
        },
        error: (error) => {
          if (error.status === 400) {
            console.error('HR UPDATE API ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.message})
          } else {
            console.error('HR UPDATE API ERROR:',error);
            this.messageService.add({severity:'error',summary:error?.message})
          }
        },
      });
  }

  // approve contract employee
  approveByHrAppr() {
    console.log("ApproveByHrAppr");
    // gen id generation for contract employee
    const genId = "C" + this.contractEmpBasicDetails.value.apln_slno;

    // new extra fields
    this.contractorEmployee.payrollArea =
      this.contractEmpDetails.value.payrollArea;
    this.contractorEmployee.costCenter =
      this.contractEmpDetails.value.costCenter;
    this.contractorEmployee.legacyNumberOne =
      this.contractEmpDetails.value.legacyNumberOne;
    this.contractorEmployee.legacyNumberTwo =
      this.contractEmpDetails.value.legacyNumberTwo;

    this.contractorEmployee.apln_slno =
      this.contractEmpBasicDetails.value.apln_slno;
    // set employee form value from gen id
    this.contractorEmployee.gen_id = genId;
    this.contractorEmployee.biometric_no =
      this.contractEmpBasicDetails.value.apln_slno;
    this.contractorEmployee.marital_status =
      this.contractEmpBasicDetails.value.maritalStatus;
    this.contractorEmployee.mobile_no1 =
      this.contractEmpBasicDetails.value.EmpMobileNo;

    this.contractorEmployee.mobile_no2 =
      this.contractEmpOtherDetails.value.emergencyContactNo;
    this.contractorEmployee.emergency_name =
      this.contractEmpOtherDetails.value.emergencyContactPerson;
    this.contractorEmployee.emergency_rel =
      this.contractEmpOtherDetails.value.emergencyContactRelation;

    this.contractorEmployee.uan_number =
      this.contractEmpOtherDetails.value.PF_UAN;
    this.contractorEmployee.esi_no = this.contractEmpOtherDetails.value.ESI_No;
    this.contractorEmployee.transporter_name =
      this.contractEmpOtherDetails.value.transporter;
    this.contractorEmployee.village_name =
      this.contractEmpOtherDetails.value.village;

    // temp passowrd for contract employee
    this.contractorEmployee.TempPassword = this.createTempPassword(
      this.formatDate(this.contractEmpBasicDetails.value.DOB).toString(),
    );
    this.contractorEmployee.approved_dt = this.formatDate(
      new Date(),
    ).toString();
    this.contractorEmployee.apln_status =
      this.contractEmpReleavingDetails.value.apln_status;
    console.log("CONTRACT APPROVE DATA:", this.contractorEmployee);
    /** sumbit payload */
    const SubmitData = {
      ...this.contractorEmployee,
      Created: this.userEmpcode
    }
   console.log('HR APPROVE PAYLOAD:',SubmitData)
    this.api
      .app_cl_Emp_By_HRappr(
        SubmitData, // #NEW FROM RMl
        this.contractorEmployee.apln_slno,
      )
      .subscribe(
        (res: any) => {
          const formData = new FormData();
          formData.append(
            "photo",
            this.contractEmpBasicDetails.value.Photo_File,
          );
          // photo upload api call
          this.api
            .photo_upload(
              formData,
              this.contractEmpBasicDetails.value.apln_slno,
            )
            .subscribe(
              (res) => {
                console.log("file Uploaded", res);
                this.messageService.add({ severity: "info", summary: res?.message});
              },
              (error) => {
                console.log("file not Uploaded", error);
                this.messageService.add({
                  severity: "error",
                  summary: error.message,
                });
              },
            );
          this.searchfilter();
          this.getAllClEmployees();
          this.reset();
          this.hideContractorForm();
          // this.openAlertDialog(` ${this.contractorEmployee.apln_slno} - ${this.contractorEmployee.fullname}  Appointed  `)
          this.openAlertDialog(res, "check");
        },
        (error) => {
          if (error.status === 400) {
            // this.openAlertDialog(`${error.error}`, "error");
            this.messageService.add({severity:'error',summary:error?.error});
            console.log('APPROVE BY HR API ERROR',error)
          } else {
            this.openAlertDialog(`Error in connection`, "error");
            this.messageService.add({severity:'error',summary:'Oops! something went wrong.'})
          }
        },
      );
  }

  // reject by hr
  rejectByHrAppr(apln_slno: any, reason: any) {
    this.api.rej_by_Hrappr(apln_slno, reason).subscribe(
      (res) => {
        this.hideContractorForm();
        this.getAllClEmployees();
        this.reset();
        // this.openAlertDialog(`${apln_slno} is Application Rejected  `, "error");
        this.messageService.add({severity:'info',summary:`Application No: ${apln_slno} is rejected.`})

        // this.getConSubmittedData()
      },
      (error) => {
        if (error.status === 400) {
          // this.openAlertDialog(`${error.error}`, "error");
          this.messageService.add({severity:'error',summary:error?.error});
        } else {
          // this.openAlertDialog("Error in connection", "error");
          this.messageService.add({severity:'error',summary:'Oops! something went wrong'})
          this.getAllClEmployees();
          this.searchfilter();
          this.reset();
          this.hideContractorForm();
        }
      },
    );
  }

  // open popup for reject
  openPopupForRej() {
    const apln_slno = this.contractEmpBasicDetails.value.apln_slno;
    const apln_status = this.contractEmpReleavingDetails.value.apln_status;
    // console.log(apln_status)
    if (apln_status === "Deleted") {
      this.throwError("Application Already Deleted");
    } else {
      const dialogRef = this.dialog.open(DelPopupComponent, {
        width: "400px",
        data: { apln_slno: apln_slno },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // console.log(result);
          this.rejectByHrAppr(result.apln_slno, result.reason);
        }
      });
    }
  }
  // validate steps
  validateStep(stepNumber: number): boolean {
    switch (stepNumber) {
      case 1:
        if (this.contractEmpBasicDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.contractEmpBasicDetails);
          this.stepper.selectedIndex = 0;
          return false;
        }
      case 2:
        if (this.contractEmpOtherDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.contractEmpOtherDetails);
          this.stepper.selectedIndex = 1;
          return false;
        }
      case 3:
        if (this.contractEmpDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.contractEmpDetails);
          this.stepper.selectedIndex = 2;
          return false;
        }
      case 4:
        if (this.contractEmpPayscaleDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.contractEmpPayscaleDetails);
          this.stepper.selectedIndex = 3;
          return false;
        }
      case 5:
        if (this.contractEmpReleavingDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.contractEmpReleavingDetails);
          this.stepper.selectedIndex = 4;
          return false;
        }
	// NEW FROM RML
        case 6:
        if (this.contractEmpDetails2.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.contractEmpDetails2);
          this.stepper.selectedIndex = 5;
          return false;
        }
      default:
        return false;
    }
  }
  // mark from group as touched
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

  // TO CLOSE FORM
  closeAllForms() {
    this.hideContractorForm();
    this.reset();
    this.stepper.selectedIndex = 0;
    // #NEW FOMR RML
    this.payscaleForm = false;
  }

  //TO Reject the Application
  reject_Apln() {
    this.showRejectFrom = true;
    this.contractorEmployee.doj = this.contractEmpDetails.value.DOJ;
  }

  showPayscale() {
    this.selectPayscale = true;
  }

  hidePayscale() {
    this.selectPayscale = false;
  }
  // showApprovebutton(value:boolean){
  // this.showApprove=value
  // }

  // TO CONTRACTOR FORM
  showContractorForm() {
    this.reset();
    this.contractorForm = true;
  }
  hideContractorForm() {
    this.contractorForm = false;
  }
  showUpdateButton() {
    this.showUpdate = true;
  }
  showApprovebutton() {
    this.showApprove = true;
  }
  showeditButton(value: boolean) {
    this.showedit = value;
    console.log(this.showedit);
  }
  // form reset
  reset() {
    this.contractEmpBasicDetails.reset();
    this.contractEmpOtherDetails.reset();
    this.contractEmpDetails.reset();
    this.contractEmpPayscaleDetails.reset();
    this.contractEmpReleavingDetails.reset();
    this.stepper.selectedIndex = 0;
    // event.currentTarget.reset()
  }
  // export to excel
  exportexcel(): void {
    // console.log("hai")
    const newKeys: any = {
      apln_slno: "Apln_Slno",
      plant_code: "Plant",
      Cont_company_name: "Contractor Company",
      fullname: "Employee_Name",
      fathername: "Father_Name",
      birthdate: "DOB",
      marital_status: "Marital_Status",
      gender: "Gender",
      gen_id: "Gen_Id",
      biometric_no: "Punch_Id",
      mobile_no1: "Employee_Mobile_No",
      aadhar_no: "Adhaar_Number",
      permanent_address: "Permanent_Address",
      state_name: "Permanent_State",
      workcontract: "WorkContract",
      doj: "DOJ",
      dept_name: "Department",
      Line_Name: "Line",
      Emp_Name: "Reporting_To",
      esi_no: "ESI_No",
      apln_status: "Application_Status",
      dol: "DOL",
    };

    const transformedArray: any = this.ClHRdata.map((obj: any) => {
      const transformedObj: any = {};
      Object.keys(newKeys).forEach((key) => {
        const newKey = newKeys[key] || key;

        // Handle special case for "workcontract"
        if (key === "workcontract") {
          transformedObj[newKey] = obj[key] === "02" ? "INDIRECT" : "DIRECT";
        } else if (
          key === "biometric_no" &&
          Array.isArray(obj[key]) &&
          obj[key].length > 0
        ) {
          transformedObj[newKey] = obj[key][0];
        } else {
          transformedObj[newKey] = obj[key];
        }
      });
      return transformedObj;
    });

    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CL Employee Master");
    XLSX.writeFile(wb, "CL_Employee.xlsx");
  }
}
