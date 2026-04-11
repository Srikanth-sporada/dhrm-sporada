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
import { LoaderserviceService } from "../../loaderservice.service";
import { ToastComponent } from "../toast/toast.component";
import { MatDialog } from "@angular/material/dialog";
import { DelPopupComponent } from "../del-popup/del-popup.component";
import { environment } from "src/environments/environment.prod";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { PieceRateEmployee } from "./pr-employee.model";

@Component({
  selector: 'app-pr-employee',
  templateUrl: './pr-employee.component.html',
  styleUrls: ['./pr-employee.component.css']
})
export class PrEmployeeComponent implements OnInit {
  @ViewChild(MatVerticalStepper) stepper!: MatVerticalStepper;
  form: any;
  url: any = environment.path + "/";
  fileUrl: SafeUrl | null = null;
  ishrappr: string | null = sessionStorage.getItem("ishrappr");
  isadmin: string | null = sessionStorage.getItem("isadmin");
  ishr: string | null = sessionStorage.getItem("ishr");
  plant_Code: any = sessionStorage.getItem("plantcode");
  basicDetails: any;
  addresssDetails: any;
  ContractDetails: any;
  releiveDetails: any;
  currentDate: Date;
  Date: any = "Date";
  DOJmaxDate: Date;
  DOJminDate: Date;
  lockDate: any;
  DoEminDate: any;
  DoEmaxDate: any;
  pincodeData: any;
  contractorData: any;
  activeData: any;
  reasonData: any;
  religionData: any;
  dept: any;
  lastId: any;
  ClHRdata: any;
  filterinfo: any;
  line: any;
  Roles: any;
  repTo: any;
  contractorForm = false;
  showUpdate = false;
  showedit = false;
  showApprove = false;
  showRelieving = false;
  status: any;
  isDOJReadOnly = false;
  maxDate = new Date();
  selectedPhoto: File | null;
  conEmpEditFlag = false;
  dolUpdate = false;
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  PieceRateEmployee: PieceRateEmployee = new PieceRateEmployee();

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
    private api: ClamAPIService
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
  }

  ngOnInit(): void {

    this.form.patchValue({
      CName: '',
      EName: '',
      status: this.ishrappr === 'true' ? 'SUBMITTED' : 'PENDING',
    });

    this.basicDetails = this.fb.group({
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
          updateOn: "blur",
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

    this.addresssDetails = this.fb.group({
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

    this.ContractDetails = this.fb.group({
      empId: [{ value: "", disabled: true }],
      bioMiD: [{ value: "", disabled: true }],
      // pay: ['', Validators.required],
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
          updateOn: "blur",
          disabled: false,
        },
      ],
    });


this.releiveDetails = this.fb.group({
  actOrInAct: ["Yes"],
  servicePeriod: [{ value: "", disabled: true }],
  DOJ: [{ value: this.ContractDetails.get("DOJ")?.value }],
  DOE: ["", Validators.required],               // keep enabled
  reasonForReleaving: ["", Validators.required], // keep enabled
  status: ["Y"],
  apln_status: ["PENDING"],
  rejectionReason: [""],
});

// enable/disable dynamically
this.releiveDetails.get("status")?.valueChanges.subscribe((val:any) => {
  if (val === "N") {
    this.releiveDetails.get("DOE")?.enable();
    this.releiveDetails.get("reasonForReleaving")?.enable();
  } else {
    this.releiveDetails.get("DOE")?.disable();
    this.releiveDetails.get("reasonForReleaving")?.disable();
  }
});

    this.currentDate = new Date();
    if (this.ishrappr == "true") {
      this.form.controls["status"].setValue("SUBMITTED");
    } else {
      this.form.controls["status"].setValue("PENDING");
    }
    this.form.controls["CName"].setValue("");
    this.form.controls["EName"].setValue("");

    this.getContractorDetails();
    this.getPincode();
    this.getReligion();
    this.getAllClEmployees();
    this.get_Last_EmpID();
    this.getReligion();
    this.get_dept();
    this.getReason();
    this.searchfilter();
  };


  getContractorDetails() {
    this.api.getContractor().subscribe(
      (res) => {
        this.contractorData = res;
        this.activeData = this.contractorData.filter(
          (item: any) =>
            item.Status === true && item.Plant_code === this.plant_Code
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPincode() {
    this.api.get_pincode().subscribe(
      (res) => {
        this.pincodeData = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getReason() {
    this.api.get_ror().subscribe(
      (res) => {
        console.log('releving reasons', res)
        this.reasonData = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getReligion() {
    this.api.get_religion().subscribe(
      (res) => {
        this.religionData = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCity_State_Perm(event: any) {
    const enteredPincode = event.target.value;
    // console.log(enteredPincode)
    const selectedPincode = this.pincodeData.find(
      (item: any) => item.pincode.toString() === enteredPincode.toString()
    );
    if (selectedPincode) {
      this.addresssDetails.patchValue({
        city: selectedPincode.districtname,
        state: selectedPincode.statename,
      });
    } else {
      this.addresssDetails.patchValue({
        city: "",
        state: "",
      });
    }
  }
  getCity_State_Temp(event: any) {
    const enteredPincode = event.target.value;
    const selectedPincode = this.pincodeData.find(
      (item: any) => item.pincode.toString() === enteredPincode.toString()
    );
    // console.log(selectedPincode)
    if (selectedPincode) {
      this.addresssDetails.patchValue({
        TempCity: selectedPincode.districtname,
        TempState: selectedPincode.statename,
      });
    } else {
      this.addresssDetails.patchValue({
        TempCity: "",
        TempState: "",
      });
    }
  }

  get_dept() {
    this.api.getDepList(this.plant_Code).subscribe(
      (res) => {
        this.dept = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllClEmployees() {
    this.api.get_Cl_Emp_Hr().subscribe(
      (res) => {
        this.ClHRdata = res;
        this.ClHRdata = this.ClHRdata.filter(
          (data: any) => data.plant_code === this.plant_Code
        );
      },
      (error) => {
        if (error.status === 400) {
          alert("Error while retreiving Data ");
        } else {
          alert("Something went wrong");
        }
      }
    );
  }

  get_Last_EmpID() {
    this.api.get_Last_EmpID().subscribe((res) => {
      this.lastId = res;
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

  calculateMinDate(dateDoj: any) {

    this.service.getlockdateByCategory('T').subscribe((response: any) => {
      console.log('loack date', response.date.split('T')[0]);
      console.log('loack DOJ', dateDoj);

      this.lockDate = response.date.split('T')[0]
      this.DoEminDate = this.lockDate > dateDoj ? moment(this.lockDate).format('yyyy-MM-DD') : dateDoj
    })

    const currentDate = new Date();
    this.DoEmaxDate = new Date();
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

  searchfilter() {
    this.api.PrsearchFilter(this.form.value).subscribe(
      (res) => {
        this.filterinfo = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDOESelected(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    if (event.value) {
      this.calculateServicePeriod();
    }
  }

  mobileNumber(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.length > 10) {
      inputElement.value = value.slice(0, 10);
      this.basicDetails.patchValue({
        [controlName]: value.slice(0, 10),
      });
    }
  }
  adhaarNumber(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value.length > 12) {
      inputElement.value = value.slice(0, 12);
      this.basicDetails.patchValue({
        [controlName]: value.slice(0, 12),
      });
    }
  }

  calculateServicePeriod() {
    const doj = new Date(this.ContractDetails.get("DOJ").value);
    const doe = new Date(this.releiveDetails.get("DOE").value);
    //  console.log(doj, doe);
    if (isNaN(doj.getTime()) || isNaN(doe.getTime())) {
      // console.log('hai')
      this.releiveDetails.get("servicePeriod").setValue("");
    } else {
      const diffInMilliseconds = Math.abs(doe.getTime() - doj.getTime());
      // console.log(diffInMilliseconds)
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const millisecondsPerMonth = millisecondsPerDay * 30.44;
      const millisecondsPerYear = millisecondsPerDay * 365.25;
      const diffInYears = Math.floor(diffInMilliseconds / millisecondsPerYear);
      const diffInMonths = Math.floor(
        (diffInMilliseconds % millisecondsPerYear) / millisecondsPerMonth
      );
      const diffInDays = Math.floor(
        (diffInMilliseconds % millisecondsPerMonth) / millisecondsPerDay
      );

      // console.log(`${diffInYears} years, ${diffInMonths} months, ${diffInDays} days`)

      this.releiveDetails
        .get("servicePeriod")
        .setValue(
          `${diffInYears} years, ${diffInMonths} months, ${diffInDays} days`
        );
    }
  }
  forReleaving(event: any) {
    const selectedStatus = this.releiveDetails.value.status;
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

  copyPermanentAddress(event: any) {
    // console.log(this.addresssDetails.get('addressCheckBox')?.value)
    // console.log(event)
    // console.log(event.checked)

    if (event.checked) {
      this.addresssDetails.patchValue({
        TempAddress: this.addresssDetails.get("address").value,
        TempPincode: this.addresssDetails.get("pincode").value,
        TempCity: this.addresssDetails.get("city").value,
        TempState: this.addresssDetails.get("state").value,
      });
      this.addresssDetails.get("TempAddress").disable();
      this.addresssDetails.get("TempPincode").disable();
      this.addresssDetails.get("TempCity").disable();
      this.addresssDetails.get("TempState").disable();
    } else {
      this.addresssDetails.patchValue({
        TempAddress: "",
        TempPincode: "",
        TempCity: "",
        TempState: "",
      });
      this.addresssDetails.get("TempAddress").enable();
      this.addresssDetails.get("TempPincode").enable();
      this.addresssDetails.get("TempCity").enable();
      this.addresssDetails.get("TempState").enable();
    }
  }

  getline_Role_1(event: any) {


    this.getLineName(event)
    this.getRoleMaster(event)
  }
  getline_Role(event: any) {
    console.log('vent', event.value);
    console.log('vent', event);

    this.getLineName(event.value)
    this.getRoleMaster(event.value)
  }
  getLineName(event: any) {
    this.api.getLine(event).subscribe(
      (res: any) => {
        this.line = res[0];
        this.repTo = res[1];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getRoleMaster(event: any) {

    console.log('Roelevent', event);


    this.api.getRoleName(event).subscribe(
      (res: any) => {
        this.Roles = res[0];

      },
      (error) => {
        console.log(error);
      }
    );
  }

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
  }

  // TO CLOSE FORM
  closeAllForms() {
    this.hideContractorForm();
    this.reset();
    this.stepper.selectedIndex = 0;
  }

  reset() {
    this.basicDetails.reset();
    this.addresssDetails.reset();
    this.ContractDetails.reset();
    this.releiveDetails.reset();
    this.stepper.selectedIndex = 0;
    // event.currentTarget.reset()
  }

  onFileChange(input: HTMLInputElement) {
    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
      // console.log(this.selectedPhoto);

      this.basicDetails.patchValue({
        Photo_File: this.selectedPhoto,
        Photo_Name: this.selectedPhoto.name,
      });
    }
  }

  viewFile(): void {
    const fileName = this.basicDetails.get("Photo_Name")?.value;
    // console.log(fileName);
    if (fileName) {
      const fileUrl = this.url + `Cl_Photo_Upload/${fileName}`;
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      this.basicDetails.controls["Photo_File"].setValue(fileUrl);
    }
  }

  handletransport() {
    this.addresssDetails.get('Van_Eligible').valueChanges.subscribe((value: any) => {
      const transporterControl = this.addresssDetails.get('transporter');
      const villageControl = this.addresssDetails.get('village');

      if (value === 'Yes') {
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

  SubmitBasicDetails(event: any) {
    event.preventDefault();
    if (this.validateStep(1) && this.validateStep(2)) {
      this.PieceRateEmployee.apln_slno = this.lastId;
      this.PieceRateEmployee.plant_code = this.plant_Code;
      this.PieceRateEmployee.Contractor_ID =
        this.basicDetails.value.contractorName;
      this.PieceRateEmployee.fullname =
        this.basicDetails.value.employeeName;
      this.PieceRateEmployee.fathername =
        this.basicDetails.value.spouseName;
      this.PieceRateEmployee.marital_status =
        this.basicDetails.value.maritalStatus;
      this.PieceRateEmployee.birthdate = this.formatDate(
        this.basicDetails.value.DOB
      ).toString();
      this.PieceRateEmployee.gender =
        this.basicDetails.value.gender;
      this.PieceRateEmployee.mobile_no1 =
        this.basicDetails.value.EmpMobileNo;
      this.PieceRateEmployee.aadhar_no =
        this.basicDetails.value.adhaarNo;
      this.PieceRateEmployee.religion =
        this.basicDetails.value.religion;
      this.PieceRateEmployee.Caste =
        this.basicDetails.value.Caste;

      this.PieceRateEmployee.permanent_address =
        this.addresssDetails.value.address;
      this.PieceRateEmployee.city = this.addresssDetails.value.city;
      this.PieceRateEmployee.state_name =
        this.addresssDetails.value.state;
      this.PieceRateEmployee.pincode =
        this.addresssDetails.value.pincode;

      if (this.addresssDetails.value.addressCheckBox) {
        // Temp Address
        this.PieceRateEmployee.present_address =
          this.addresssDetails.value.address;
        this.PieceRateEmployee.pres_city =
          this.addresssDetails.value.city;
        this.PieceRateEmployee.pres_state_name =
          this.addresssDetails.value.state;
        this.PieceRateEmployee.pres_pincode =
          this.addresssDetails.value.pincode;
      } else {
        // Temp Address
        this.PieceRateEmployee.present_address =
          this.addresssDetails.value.TempAddress;
        this.PieceRateEmployee.pres_city =
          this.addresssDetails.value.TempCity;
        this.PieceRateEmployee.pres_state_name =
          this.addresssDetails.value.TempState;
        this.PieceRateEmployee.pres_pincode =
          this.addresssDetails.value.TempPincode;
      }

      this.PieceRateEmployee.mobile_no2 =
        this.addresssDetails.value.emergencyContactNo;
      this.PieceRateEmployee.emergency_name =
        this.addresssDetails.value.emergencyContactPerson;
      this.PieceRateEmployee.emergency_rel =
        this.addresssDetails.value.emergencyContactRelation;
      this.PieceRateEmployee.blood_group =
        this.addresssDetails.value.bloodGroup;
      this.PieceRateEmployee.uan_number =
        this.addresssDetails.value.PF_UAN;
      this.PieceRateEmployee.esi_no =
        this.addresssDetails.value.ESI_No;
      this.PieceRateEmployee.Van_Eligible =
        this.addresssDetails.value.Van_Eligible;
      this.PieceRateEmployee.transporter_name =
        this.addresssDetails.value.transporter;
      this.PieceRateEmployee.village_name =
        this.addresssDetails.value.village;
      this.PieceRateEmployee.created_dt = this.formatDate(
        new Date()
      ).toString();
    }
  }


  onRoleChange_1(event: any) {
    console.log('Selected Role ID:', event.value);

    const selectedRoleId = Number(event.value); // Access value directly from the event
    const selectedRole = this.Roles.find((role: any) => role.Role_Id === selectedRoleId);

    if (selectedRole) {
      this.ContractDetails.get('DorInD')?.setValue(selectedRole.Category_Name);
    } else {
      this.ContractDetails.get('DorInD')?.setValue('');
    }
  }

  submitEmployeeDetails() {

    if (
      this.validateStep(1) &&
      this.validateStep(2) &&
      this.validateStep(3) &&
      this.validateStep(5)
    ) {
      this.PieceRateEmployee.apln_slno =
        this.basicDetails.value.apln_slno;

      this.PieceRateEmployee.plant_code =
        this.basicDetails.value.plantCode;
      this.PieceRateEmployee.Contractor_ID =
        this.basicDetails.value.contractorName;
      this.PieceRateEmployee.fullname =
        this.basicDetails.value.employeeName;
      this.PieceRateEmployee.fathername =
        this.basicDetails.value.spouseName;
      this.PieceRateEmployee.marital_status =
        this.basicDetails.value.maritalStatus;
      this.PieceRateEmployee.birthdate = this.formatDate(
        this.basicDetails.value.DOB
      ).toString();
      this.PieceRateEmployee.gender =
        this.basicDetails.value.gender;
      this.PieceRateEmployee.mobile_no1 =
        this.basicDetails.value.EmpMobileNo;
      this.PieceRateEmployee.aadhar_no =
        this.basicDetails.value.adhaarNo;
      this.PieceRateEmployee.religion =
        this.basicDetails.value.religion;
      this.PieceRateEmployee.Caste =
        this.basicDetails.value.Caste;

      this.PieceRateEmployee.permanent_address =
        this.addresssDetails.value.address;
      this.PieceRateEmployee.city = this.addresssDetails.value.city;
      this.PieceRateEmployee.state_name =
        this.addresssDetails.value.state;
      this.PieceRateEmployee.pincode =
        this.addresssDetails.value.pincode;
      if (this.addresssDetails.value.addressCheckBox) {
        // Temp Address
        this.PieceRateEmployee.present_address =
          this.addresssDetails.value.address;
        this.PieceRateEmployee.pres_city =
          this.addresssDetails.value.city;
        this.PieceRateEmployee.pres_state_name =
          this.addresssDetails.value.state;
        this.PieceRateEmployee.pres_pincode =
          this.addresssDetails.value.pincode;
      } else {
        // Temp Address
        this.PieceRateEmployee.present_address =
          this.addresssDetails.value.TempAddress;
        this.PieceRateEmployee.pres_city =
          this.addresssDetails.value.TempCity;
        this.PieceRateEmployee.pres_state_name =
          this.addresssDetails.value.TempState;
        this.PieceRateEmployee.pres_pincode =
          this.addresssDetails.value.TempPincode;
      }

      this.PieceRateEmployee.mobile_no2 =
        this.addresssDetails.value.emergencyContactNo;
      this.PieceRateEmployee.emergency_name =
        this.addresssDetails.value.emergencyContactPerson;
      this.PieceRateEmployee.emergency_rel =
        this.addresssDetails.value.emergencyContactRelation;
      this.PieceRateEmployee.blood_group =
        this.addresssDetails.value.bloodGroup;
      this.PieceRateEmployee.uan_number =
        this.addresssDetails.value.PF_UAN;
      this.PieceRateEmployee.esi_no =
        this.addresssDetails.value.ESI_No;

      this.PieceRateEmployee.Van_Eligible =
        this.addresssDetails.value.Van_Eligible;
      this.PieceRateEmployee.transporter_name =
        this.addresssDetails.value.transporter;
      this.PieceRateEmployee.village_name =
        this.addresssDetails.value.village;

      this.PieceRateEmployee.workcontract =
        this.ContractDetails.value.DorInD;
      this.PieceRateEmployee.dept_slno = this.ContractDetails.value.dept;
      this.PieceRateEmployee.line_code = this.ContractDetails.value.line;
      this.PieceRateEmployee.Role_ID = this.ContractDetails.value.Role;
      this.PieceRateEmployee.reporting_to =
        this.ContractDetails.value.reToPerson;
      this.PieceRateEmployee.doj = this.formatDate(
        this.ContractDetails.value.DOJ
      ).toString();
      this.PieceRateEmployee.apln_status =
        this.releiveDetails.value.apln_status;

      if (this.releiveDetails.value.status === "N") {
        this.PieceRateEmployee.dol = this.formatDate(
          this.releiveDetails.value.DOE
        ).toString();
        this.PieceRateEmployee.remarks_rejd =
          this.releiveDetails.value.reasonForReleaving;
      } else {
        this.PieceRateEmployee.dol = "";
        this.PieceRateEmployee.remarks_rejd = "";
      }
      this.PieceRateEmployee.status =
        this.releiveDetails.value.status;

      //  console.log(this.releiveDetails.value.apln_status)
      //  console.log(this.releiveDetails.value.plant_code)
      console.log(this.PieceRateEmployee);

      console.log('submitEmployeeDetails clicked', this.PieceRateEmployee)

      const submissionData = {
        ...this.PieceRateEmployee,
        Created: this.userEmpcode
      };

      this.api
        .submit_Pr_Emp_ByHR(
          submissionData,
          this.PieceRateEmployee.apln_slno
        )
        .subscribe(
          (res: any) => {
            const formData = new FormData();
            formData.append(
              "photo",
              this.basicDetails.value.Photo_File
            );
            this.api
              .photo_upload(
                formData,
                this.basicDetails.value.apln_slno
              )
              .subscribe(
                (res) => {
                  console.log("file Uploaded", res);
                },
                (error) => {
                  console.log("file not Uploaded", error);
                }
              );

            this.openAlertDialog(`${res}`, "check");
            this.searchfilter();
            this.reset();
            this.hideContractorForm();
          },
          (error) => {
            if (error.status === 400) {
              this.openAlertDialog(`${error.error}`, "error");
            } else {
              this.openAlertDialog(`Error in connection`, "error");
            }
          }
        );
    }
  }

  update_By_HR() {
    this.PieceRateEmployee.apln_slno =
      this.basicDetails.value.apln_slno;
    this.PieceRateEmployee.marital_status =
      this.basicDetails.value.maritalStatus;
    this.PieceRateEmployee.fullname =
      this.basicDetails.value.employeeName;
    // this.ContractDetails.controls['empId'].setValue(data.gen_id)
    // this.ContractDetails.controls['bioMiD'].setValue(data.biometric_no)
    this.PieceRateEmployee.mobile_no1 =
      this.basicDetails.value.EmpMobileNo;
    this.PieceRateEmployee.mobile_no2 =
      this.addresssDetails.value.emergencyContactNo;
    this.PieceRateEmployee.emergency_name =
      this.addresssDetails.value.emergencyContactPerson;
    this.PieceRateEmployee.emergency_rel =
      this.addresssDetails.value.emergencyContactRelation;
    this.PieceRateEmployee.uan_number =
      this.addresssDetails.value.PF_UAN;
    this.PieceRateEmployee.esi_no = this.addresssDetails.value.ESI_No;

    this.PieceRateEmployee.Van_Eligible =
      this.addresssDetails.value.Van_Eligible;

    this.PieceRateEmployee.transporter_name =
      this.addresssDetails.value.transporter;
    this.PieceRateEmployee.village_name =
      this.addresssDetails.value.village;
    this.PieceRateEmployee.apln_status =
      this.releiveDetails.value.apln_status;
    this.PieceRateEmployee.status =
      this.releiveDetails.value.status;
    this.PieceRateEmployee.gen_id = this.ContractDetails.value.empId;
    this.PieceRateEmployee.biometric_no = this.ContractDetails.value.bioMiD;
    this.PieceRateEmployee.doj = this.ContractDetails.value.DOJ;

    if (this.releiveDetails.value.status === "N") {
      // this.validateStep(5)
      if (
        this.releiveDetails.value.DOE.length <= 0 ||
        this.releiveDetails.value.reasonForReleaving.length <= 0
      ) {
        //  aalow  updated buttonthi

        this.dolUpdate = true;
      } else {
        this.PieceRateEmployee.dol = this.formatDate(
          this.releiveDetails.value.DOE
        ).toString();
        this.PieceRateEmployee.remarks_rejd =
          this.releiveDetails.value.reasonForReleaving;

        this.dolUpdate = false;
      }
    } else {
      this.PieceRateEmployee.dol = null;
      this.PieceRateEmployee.remarks_rejd = null;
      this.dolUpdate = false;
    }
    // console.log(this.PieceRateEmployee)

    this.api
      .edit_Pr_Emp_ByHR(
        this.PieceRateEmployee,
        this.PieceRateEmployee.apln_slno
      )
      .subscribe(
        (res: any) => {
          const formData = new FormData();
          formData.append(
            "photo",
            this.basicDetails.value.Photo_File
          );
          this.api
            .photo_upload(
              formData,
              this.basicDetails.value.apln_slno
            )
            .subscribe(
              (res) => {
                console.log("file Uploaded", res);
              },
              (error) => {
                console.log("file not Uploaded", error);
              }
            );
          this.openAlertDialog(res, "check");
          this.searchfilter();
          this.reset();
          this.hideContractorForm();
        },
        (error) => {
          if (error.status === 400) {
            this.openAlertDialog(`${error.error}`, "error");
          } else {
            this.openAlertDialog(`Error in connection`, "error");
          }
        }
      );
  }

  createTempPassword(dateOfBirth: any) {
    const parts = dateOfBirth.split("-");
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];
    // console.log(day + month + year)
    return day + month + year;
  }

  approveByHrAppr() {
    console.log("ApproveByHrAppr");
    const genId = "C" + this.basicDetails.value.apln_slno;
    this.PieceRateEmployee.apln_slno =
      this.basicDetails.value.apln_slno;
    this.PieceRateEmployee.gen_id = genId;
    this.PieceRateEmployee.biometric_no =
      this.basicDetails.value.apln_slno;
    this.PieceRateEmployee.marital_status =
      this.basicDetails.value.maritalStatus;
    this.PieceRateEmployee.mobile_no1 =
      this.basicDetails.value.EmpMobileNo;

    this.PieceRateEmployee.mobile_no2 =
      this.addresssDetails.value.emergencyContactNo;
    this.PieceRateEmployee.emergency_name =
      this.addresssDetails.value.emergencyContactPerson;
    this.PieceRateEmployee.emergency_rel =
      this.addresssDetails.value.emergencyContactRelation;

    this.PieceRateEmployee.uan_number =
      this.addresssDetails.value.PF_UAN;
    this.PieceRateEmployee.esi_no = this.addresssDetails.value.ESI_No;
    this.PieceRateEmployee.transporter_name =
      this.addresssDetails.value.transporter;
    this.PieceRateEmployee.village_name =
      this.addresssDetails.value.village;

    this.PieceRateEmployee.TempPassword = this.createTempPassword(
      this.formatDate(this.basicDetails.value.DOB).toString()
    );
    this.PieceRateEmployee.approved_dt = this.formatDate(
      new Date()
    ).toString();
    this.PieceRateEmployee.apln_status =
      this.releiveDetails.value.apln_status;
    // console.log(this.PieceRateEmployee)

    const SubmitData = {
      ...this.PieceRateEmployee,
      Created: this.userEmpcode
    }
    this.api
      .app_pr_Emp_By_HRappr(
        SubmitData,
        this.PieceRateEmployee.apln_slno
      )
      .subscribe(
        (res: any) => {
          const formData = new FormData();
          formData.append(
            "photo",
            this.basicDetails.value.Photo_File
          );
          this.api
            .photo_upload(
              formData,
              this.basicDetails.value.apln_slno
            )
            .subscribe(
              (res) => {
                console.log("file Uploaded", res);
              },
              (error) => {
                console.log("file not Uploaded", error);
              }
            );
          this.searchfilter();
          this.getAllClEmployees();
          this.reset();
          this.hideContractorForm();
          // this.openAlertDialog(` ${this.PieceRateEmployee.apln_slno} - ${this.PieceRateEmployee.fullname}  Appointed  `)
          this.openAlertDialog(res, "check");
        },
        (error) => {
          if (error.status === 400) {
            this.openAlertDialog(`${error.error}`, "error");
          } else {
            this.openAlertDialog(`Error in connection`, "error");
          }
        }
      );
  }

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

  showRel(value: boolean) {
    this.showRelieving = value;
    // console.log(value)
  }

  onEditByHr(data: any, showButton: boolean) {
    this.showContractorForm();
    this.status = data.apln_status;
    this.showeditButton(showButton);

    console.log('data', data)

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

    const dolValue = data.dol ? data.dol.toString() : "";
    const isapproved = data.isapproved ? data.isapproved.toString() : "";
    const remarks_rejd = data.remarks_rejd ? data.remarks_rejd.toString() : "";
    const reporting_to = data.reporting_to ? data.reporting_to.toString() : "";
    const Van_Eligible = data.Van_Eligible == true ? "Yes" : "No";

    const rejectionreason = data.rejectionreason
      ? data.rejectionreason.toString()
      : "";

    this.basicDetails.controls["apln_slno"].setValue(data.apln_slno);
    this.basicDetails.controls["plantCode"].setValue(
      data.plant_code
    );
    this.basicDetails.controls["contractorName"].setValue(
      data.cont_id
    );
    this.basicDetails.controls["employeeName"].setValue(
      data.fullname
    );
    this.basicDetails.controls["spouseName"].setValue(
      data.fathername
    );
    this.basicDetails.controls["maritalStatus"].setValue(
      data.marital_status
    );
    this.basicDetails.controls["DOB"].setValue(data.birthdate);
    this.basicDetails.controls["EmpMobileNo"].setValue(
      data.mobile_no1
    );
    this.basicDetails.controls["gender"].setValue(data.gender);
    this.basicDetails.controls["adhaarNo"].setValue(data.aadhar_no);
    this.basicDetails.controls["Caste"].setValue(data.caste_name);
    this.basicDetails.controls["religion"].setValue(
      Number(data.religion_sl)
    );
    this.basicDetails.controls["Photo_Name"].setValue(
      data.photo_filename
    );

    this.addresssDetails.controls["address"].setValue(
      data.permanent_address
    );
    this.addresssDetails.controls["pincode"].setValue(data.pincode);

    this.addresssDetails.controls["city"].setValue(data.city);

    this.addresssDetails.controls["state"].setValue(data.state_name);
    this.addresssDetails.controls["TempAddress"].setValue(
      data.present_address
    );
    this.addresssDetails.controls["TempPincode"].setValue(
      data.pres_pincode
    );
    this.addresssDetails.controls["TempCity"].setValue(data.pres_city);
    this.addresssDetails.controls["TempState"].setValue(
      data.pres_state_name
    );
    this.addresssDetails.controls["bloodGroup"].setValue(
      data.blood_group
    );
    this.addresssDetails.controls["emergencyContactNo"].setValue(
      data.mobile_no2
    );
    this.addresssDetails.controls["emergencyContactPerson"].setValue(
      data.emergency_name
    );
    this.addresssDetails.controls["emergencyContactRelation"].setValue(
      data.emergency_rel.toString()
    );
    this.addresssDetails.controls["PF_UAN"].setValue(data.uan_number);
    this.addresssDetails.controls["ESI_No"].setValue(data.esi_no);
    this.addresssDetails.controls["Van_Eligible"].setValue(Van_Eligible);
    this.addresssDetails.controls["transporter"].setValue(
      data.transporter_name
    );
    this.addresssDetails.controls["village"].setValue(
      data.village_name
    );

    this.ContractDetails.controls["empId"].setValue(data.gen_id);
    this.ContractDetails.controls["bioMiD"].setValue(data.biometric_no);
    this.ContractDetails.controls["DorInD"].setValue(data.Category_Name);
    this.ContractDetails.controls["dept"].setValue(data.dept_slno);
    this.getline_Role_1(data.dept_slno);
    this.ContractDetails.controls["line"].setValue(data.line_code);
    this.ContractDetails.controls["Role"].setValue(data.Role_Id);
    this.ContractDetails.controls["reToPerson"].setValue(data.reporting_to);
    this.ContractDetails.controls["DOJ"].setValue(data.doj);

    this.releiveDetails.controls["DOE"]?.setValue(data.dol);
    // this.releiveDetails.controls['DOE']?.setValue(dolValue)
    this.releiveDetails.controls["apln_status"]?.setValue(
      data.apln_status
    );
    this.releiveDetails.controls["status"]?.setValue(
      data.isapproved
    );
    // this.releiveDetails.controls['status']?.setValue(isapproved)
    this.releiveDetails.controls["reasonForReleaving"]?.setValue(
      data.rejectionreason
    );

    this.calculateMinDate(data.doj)

    if (data.apln_status == "SUBMITTED" && this.ishrappr) {
      this.stepper.selectedIndex = 2;
      // console.log("executed")
    }
    const fileName = data.photo_filename;
    if (fileName) {
      const fileUrl = this.url + `Cl_Photo_Upload/${fileName}`;
      this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      this.basicDetails.controls["Photo_File"].setValue(fileUrl);

      const licenseFileValue =
        this.basicDetails.controls["Photo_File"].value;
      if (licenseFileValue === fileUrl) {
        console.log("File successfully bound to Photo_File control.");
      } else {
        console.log("File binding failed.");
      }
    } else {
      console.log("No file provided.");
    }
  }

  openDeleteConfirmationDialog(apln_slno: any): void {
    var status: string;
    if (this.ishr === "true") {
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

  delete_Cl_Emp_ByCon(apln_slno: any, reason: string, status: string) {
    // console.log(status)
    this.api.del_cl_Emp_byCon(apln_slno, reason, status).subscribe(
      (res: any) => {
        this.openAlertDialog(res, "check");
        // console.log(res);
        this.getAllClEmployees();
        this.searchfilter();
        this.reset();
      },
      (error) => {
        if (error.status === 400) {
          console.log(error);
          this.openAlertDialog(`${error.error}`, "error");
        } else {
          this.openAlertDialog("Error in connection", "error");
        }
      }
    );
  }

  validateStep(stepNumber: number): boolean {
    switch (stepNumber) {
      case 1:
        if (this.basicDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.basicDetails);
          this.stepper.selectedIndex = 0;
          return false;
        }
      case 2:
        if (this.addresssDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.addresssDetails);
          this.stepper.selectedIndex = 1;
          return false;
        }
      case 3:
        if (this.ContractDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.ContractDetails);
          this.stepper.selectedIndex = 2;
          return false;
        }
      case 5:
        if (this.releiveDetails.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.releiveDetails);
          this.stepper.selectedIndex = 4;
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

}