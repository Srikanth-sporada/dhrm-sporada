import { Component, OnInit,ViewChild,TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatVerticalStepper } from "@angular/material/stepper";
import { ApiService } from "src/app/home/api.service";
import { ClamAPIService } from "../clam-api.service";
import {
  PayscaleObj,
  NewPayScaleObj,
  NewEarningAllowance,
  NewDeduction,
  NewPaidToContractor,
  Emp_Payscale,
} from "./payscale.model";
import { LoaderserviceService } from "../../loaderservice.service";
import { ToastComponent } from "../toast/toast.component";
import moment from "moment";
import * as XLSX from "xlsx";
import { MessageService, MenuItem } from "primeng/api";
import {
  MatDialog,
} from "@angular/material/dialog";

@Component({
  selector: "app-payscale-master",
  templateUrl: "./payscale-master.component.html",
  styleUrls: ["./payscale-master.component.css"],
})

export class PayscaleMasterComponent implements OnInit {
  @ViewChild(MatVerticalStepper) stepper!: MatVerticalStepper;
  @ViewChild('viewPayscale', {read: TemplateRef}) viewPayscaleTemplate: TemplateRef<unknown> | undefined;
  @ViewChild('payscaleModal', {read: TemplateRef}) payscaleModalTemplate: TemplateRef<unknown> | undefined;
  PayscaleType = "Latest";
  showPayscaleForm = false;
  viewPayscaleForn = false;
  isFin: any;
  payScale: FormGroup;
  allowance: FormGroup;
  deduction: FormGroup;
  paidToContractor: FormGroup;
  NewPayScaleFormGroup: FormGroup;
  Service_Details: FormGroup;
  payscaleObj: PayscaleObj = new PayscaleObj();
  newPayScaleObj: NewPayScaleObj = new NewPayScaleObj();
  newEarningAllowance: NewEarningAllowance = new NewEarningAllowance();
  newDeduction: NewDeduction = new NewDeduction();
  newPaidToContractor: NewPaidToContractor = new NewPaidToContractor();
  emp_Payscale: Emp_Payscale = new Emp_Payscale();
  payscaleData: any;
  filteredPayscaleData: any;
  filteredPlantArr: any[] = [];
  paycode: any;
  Con_list: any;
  filterconList: any;
  showAdd: boolean;
  plantArr: any;
  PayscaleHeader: any;
  filterPayscaleHeader: any[] = [];
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  plant_Code: any = sessionStorage.getItem("plantcode");
  isadmin: string | null = sessionStorage.getItem("isadmin");
  // isadmin: string | null = sessionStorage.getItem("isadmin");
  Wagetype: string;
  inputPopUp = false;
  plantname: any;
  selectedContrator: any;
  currentNumber = 1;
  userDetails: any;
  edit = false;
  pln = sessionStorage.getItem("plantcode");
  initialRBV = {
    radio1: "No",
    radio2: "No",
    radio3: "No",
    radio4: "No",
    radio5: "No",
    radio6: "No",
    radio7: "No",
    radio8: "No",
    radio9: "No",
    radio10: "No",
  };
  initialDed = {
    radio1: "No",
    radio2: "No",
    radio3: "No",
    radio4: "No",
    radio5: "No",
    radio6: "No",
    radio7: "No",
    radio8: "No",
    radio9: "No",
  };
  initialPTC = {
    radio1: "No",
    radio2: "No",
    radio3: "No",
    radio4: "No",
    radio5: "No",
    radio6: "No",
    radio7: "No",
    radio8: "No",
  };
  conList: any;
  PayrolList: any;
  all: any;
  items: MenuItem[] = [
    {
      icon: "pi pi-plus-circle",
      tooltipOptions: {
        tooltipLabel: "Add Payscale",
      },
      command: () => {
        this.newPayScale();
        this.clickAdd();
      },
    },
    {
      icon: "pi pi-download",
      tooltipOptions: {
        tooltipLabel: "Download",
      },
      command: () => {
        this.exportExcel();
        this.messageService.add({
          severity: "info",
          summary: "Data Converted.",
        });
      },
    },
  ];
  constructor(
    private fb: FormBuilder,
    private api: ClamAPIService,
    private service: ApiService,
    public loader: LoaderserviceService,
    private dialog: MatDialog,
    private modalService:NgbModal,
    private messageService: MessageService,
  ) {}

  // ng lifecycle hook
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
    this.isFin = this.all["is_fin"];

    // PAYSCALE FROM
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
      Servive_Charge_Val: [null],
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
      Effective_Date: [null],
      Effective_Date1: [null],

      CTC: [null],
      ToTal_Base_Value: [null],
      Net_Take_Home: [null],
    });

    this.payScale = this.fb.group({
      PayscaleCode: [null],
      plant: [this.plant_Code],
      contractor: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      payscale: [null, { validators: [Validators.required], updateOn: "blur" }],
      effectiveDate: [null, { validators: [Validators.required] }],
      stipend: [null, { updateOn: "blur" }],
      basic: [null, { updateOn: "blur" }],
      DA: [null, { updateOn: "blur" }],
      HRA: [null, { updateOn: "blur" }],
      conveyance: [null, { updateOn: "blur" }],
    });
    // ALLOWANCE FORM
    // const otherAllowances: any[] = [];

    this.allowance = this.fb.group({
      special: [null, { disabled: true }],
      special_Check: [this.initialRBV.radio1],
      skilled: [null, { disabled: true }],
      skilled_Check: [this.initialRBV.radio2],
      leave_Salary: [null, { disabled: true }],
      leave_Salary_Check: [this.initialRBV.radio4],
      nightShift: [null, { disabled: true }],
      nightShift_Check: [this.initialRBV.radio5],
      washing: [null, { disabled: true }],
      washing_Check: [this.initialRBV.radio6],
      Monthly_bonus: [null, { disabled: true }],
      Monthly_bonus_Check: [this.initialRBV.radio7],
      Attendance_bonus: [null, { disabled: true }],
      Attendance_bonus_Check: [this.initialRBV.radio7],
      Sat_Mon: [null, { disabled: true }],
      Sat_Mon_Check: [this.initialRBV.radio8],
      Retention: [null, { disabled: true }],
      Retention_Check: [this.initialRBV.radio9],
      Amenities: [null, { disabled: true }],
      Amenities_Check: [this.initialRBV.radio10],
      otherAllowance: this.fb.array([]),
      Gross_Earning: null,
    });

    // DEDUCTION FORM
    this.deduction = this.fb.group({
      canteen_Check: [this.initialDed.radio1],
      canteen_amt: [null, { disabled: true }],
      WC_Policy_Check: [this.initialDed.radio2],
      WC_Policy_amt: [null, { disabled: true }],
      Shoes_Check: [this.initialDed.radio3],
      Shoes_amt: [null, { disabled: true }],
      Uniform_Tshirt_Check: [this.initialDed.radio4],
      Uniform_Tshirt_amt: [null, { disabled: true }],
      Transport_Check: [this.initialDed.radio5],
      Transport_amt: [null, { disabled: true }],
      Professional_Tax_Check: [this.initialDed.radio9],
      Professional_Tax_amt: [null, { disabled: true }],
      Insurance_Check: [this.initialDed.radio6],
      Insurance_amt: [null, { disabled: true }],
      Goggles_deduction: [null, { disabled: true }],
      Goggles_deduction_Check: [this.initialDed.radio7],
      Coat: [null, { disabled: true }],
      Coat_Check: [this.initialDed.radio8],
      EMP_PF_Percent: null,
      Emp_PF_Value: null,
      EMP_ESI_Percent: null,
      Emp_ESI_Value: null,
      otherDeduction: this.fb.array([]),
      Gross_Deduction: null,
    });
    // PAID TO CONTRACTOR
    this.paidToContractor = this.fb.group({
      NSDC_Check: [this.initialPTC.radio1],
      NSDC_amt: [null, { disabled: true }],
      Uniform_Chrg_Check: [this.initialPTC.radio2],
      Uniform_Chrg_amt: [null, { disabled: true }],
      Learning_Fee_Check: [this.initialPTC.radio3],
      Learning_Fee_amt: [null, { disabled: true }],
      EMP_Comp_Ins_Check: [this.initialPTC.radio4],
      EMP_Comp_Ins_amt: [null, { disabled: true }],
      LWF_Check: [this.initialPTC.radio5],
      LWF_amt: [null, { disabled: true }],
      Insurance_Premimum_Check: [this.initialPTC.radio6],
      Insurance_Premimum_amt: [null, { disabled: true }],
      Workmen_Compensation_Check: [this.initialPTC.radio7],
      Workmen_Compensation_amt: [null, { disabled: true }],
      Higer_EducationFee_Check: [this.initialPTC.radio8],
      Higer_EducationFee_amt: [null, { disabled: true }],
      Service_chrg: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Percent: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Value: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Base: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      status: [null, { validators: [Validators.required], updateOn: "blur" }],
    });

    this.Service_Details = this.fb.group({
      Service_chrg: [
        "",
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Percent: [
        "",
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Value: [
        "",
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Tax: [
        "",
        { validators: [Validators.required], updateOn: "blur" },
      ],
      status: ["", { validators: [Validators.required], updateOn: "blur" }],
    });

    this.enableInput("special_Check", "special");
    this.enableInput("skilled_Check", "skilled");
    this.enableInput("washing_Check", "washing");
    this.enableInput("nightShift_Check", "nightShift");
    this.enableInput("leave_Salary_Check", "leave_Salary");
    this.enableInput("Attendance_bonus_Check", "Attendance_bonus");
    this.enableInput("Food_Allowance_Check", "Food_Allowance");

    this.enableInputDed("canteen_Check", "canteen_amt");
    this.enableInputDed("WC_Policy_Check", "WC_Policy_amt");
    this.enableInputDed("Shoes_Check", "Shoes_amt");
    this.enableInputDed("Uniform_Tshirt_Check", "Uniform_Tshirt_amt");
    this.enableInputDed("Transport_Check", "Transport_amt");
    this.enableInputDed("Insurance_Check", "Insurance_amt");
    this.enableInputDed("Goggles_deduction_Check", "Goggles_deduction");
    this.enableInputDed("Coat_Check", "Coat");

    this.enableInputDPTC("NSDC_Check", "NSDC_amt");
    this.enableInputDPTC("Uniform_Chrg_Check", "Uniform_Chrg_amt");
    this.enableInputDPTC("Learning_Fee_Check", "Learning_Fee_amt");
    this.enableInputDPTC("EMP_Comp_Ins_Check", "EMP_Comp_Ins_amt");
    this.enableInputDPTC("LWF_Check", "LWF_amt");
    this.enableInputDPTC("Insurance_Premimum_Check", "Insurance_Premimum_amt");
    this.enableInputDPTC(
      "Workmen_Compensation_Check",
      "Workmen_Compensation_amt",
    );
    this.enableInputDPTC("Higer_EducationFee_Check", "Higer_EducationFee_amt");

    // this.getPlant_compain()
    this.getPlant_compain();
    this.getPayScaleCode();
    // this.getPayscaleMaster()
    this.getPayscaleMaster_combine();
    //this.getContractorList()
    this.getContra_combine();
    this.getPayrollList();
    this.getPayscaleHeader_combine();
    // this.getContra()
    this.getPlant_compain();
  }

  getContra() {
    this.api.getContractor().subscribe({
      next:(res) => {
        // this.Con_list = res;
        // console.log(res)
        // this.Con_list =  this.Con_list.filter((item:any) => item.Plant_code == this.plant_Code  && item.Status=== true)
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  getContra_combine() {
    this.api.getContractor_combine(this.userEmpcode).subscribe({
      next: (res: any) => {
        this.Con_list = res;
        console.log(res);
        if (this.plant_Code == "1300") {
          this.Con_list = res;
        } else {
          // console.log(res)
          this.Con_list = this.Con_list.filter(
            (item: any) =>
              item.Plant_code == this.plant_Code && item.Status === true,
          );
        }
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  updateFilteredPlantArr(): void {
    if (this.isadmin === "true") {
      this.filteredPlantArr = this.plantArr;
    } else if (this.plant_Code == "1300" && this.isFin) {
      //const plant = this.plant_Code === '1300' ? ['1300', '1500'] : this.plant_Code;
      //  console.log(plant);
      this.filteredPlantArr = this.plantArr;
    } else {
      this.filteredPlantArr = this.plantArr.filter(
        (plant: any) => plant.plant_code === this.plant_Code,
      );
    }
  }

  newPayScale() {
    // this.showPayscaleForm = true;
    /** open modal */
    this.openModal(this.payscaleModalTemplate);
    this.getPlant();
    this.getPayScaleCode();
    this.getContractorList();
    this.payScale = this.fb.group({
      PayscaleCode: [null],
      plant: [this.plant_Code],
      contractor: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      payscale: [null, { validators: [Validators.required], updateOn: "blur" }],
      effectiveDate: [null, { validators: [Validators.required] }],
      stipend: [null, { updateOn: "blur" }],
      basic: [null, { updateOn: "blur" }],
      DA: [null, { updateOn: "blur" }],
      HRA: [null, { updateOn: "blur" }],
      conveyance: [null, { updateOn: "blur" }],
    });
    // ALLOWANCE FORM
    // const otherAllowances: any[] = [];

    this.allowance = this.fb.group({
      special: [null, { disabled: true }],
      special_Check: [this.initialRBV.radio1],
      skilled: [null, { disabled: true }],
      skilled_Check: [this.initialRBV.radio2],
      leave_Salary: [null, { disabled: true }],
      leave_Salary_Check: [this.initialRBV.radio4],
      nightShift: [null, { disabled: true }],
      nightShift_Check: [this.initialRBV.radio5],
      washing: [null, { disabled: true }],
      washing_Check: [this.initialRBV.radio6],
      Monthly_bonus: [null, { disabled: true }],
      Monthly_bonus_Check: [this.initialRBV.radio7],
      Attendance_bonus: [null, { disabled: true }],
      Attendance_bonus_Check: [this.initialRBV.radio7],
      Sat_Mon: [null, { disabled: true }],
      Sat_Mon_Check: [this.initialRBV.radio8],
      Retention: [null, { disabled: true }],
      Retention_Check: [this.initialRBV.radio9],
      Amenities: [null, { disabled: true }],
      Amenities_Check: [this.initialRBV.radio10],
      otherAllowance: this.fb.array([]),
      Gross_Earning: null,
    });

    // DEDUCTION FORM
    this.deduction = this.fb.group({
      canteen_Check: [this.initialDed.radio1],
      canteen_amt: [null, { disabled: true }],
      WC_Policy_Check: [this.initialDed.radio2],
      WC_Policy_amt: [null, { disabled: true }],
      Shoes_Check: [this.initialDed.radio3],
      Shoes_amt: [null, { disabled: true }],
      Uniform_Tshirt_Check: [this.initialDed.radio4],
      Uniform_Tshirt_amt: [null, { disabled: true }],
      Transport_Check: [this.initialDed.radio5],
      Transport_amt: [null, { disabled: true }],
      Professional_Tax_Check: [this.initialDed.radio9],
      Professional_Tax_amt: [null, { disabled: true }],
      Insurance_Check: [this.initialDed.radio6],
      Insurance_amt: [null, { disabled: true }],
      Goggles_deduction: [null, { disabled: true }],
      Goggles_deduction_Check: [this.initialDed.radio7],
      Coat: [null, { disabled: true }],
      Coat_Check: [this.initialDed.radio8],
      EMP_PF_Percent: null,
      Emp_PF_Value: null,
      EMP_ESI_Percent: null,
      Emp_ESI_Value: null,
      otherDeduction: this.fb.array([]),
      Gross_Deduction: null,
    });

    this.paidToContractor = this.fb.group({
      NSDC_Check: [this.initialPTC.radio1],
      NSDC_amt: [null, { disabled: true }],
      Uniform_Chrg_Check: [this.initialPTC.radio2],
      Uniform_Chrg_amt: [null, { disabled: true }],
      Learning_Fee_Check: [this.initialPTC.radio3],
      Learning_Fee_amt: [null, { disabled: true }],
      EMP_Comp_Ins_Check: [this.initialPTC.radio4],
      EMP_Comp_Ins_amt: [null, { disabled: true }],
      LWF_Check: [this.initialPTC.radio5],
      LWF_amt: [null, { disabled: true }],
      Insurance_Premimum_Check: [this.initialPTC.radio6],
      Insurance_Premimum_amt: [null, { disabled: true }],
      Workmen_Compensation_Check: [this.initialPTC.radio7],
      Workmen_Compensation_amt: [null, { disabled: true }],
      Higer_EducationFee_Check: [this.initialPTC.radio8],
      Higer_EducationFee_amt: [null, { disabled: true }],
      Service_chrg: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Percent: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Value: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      Service_Base: [
        null,
        { validators: [Validators.required], updateOn: "blur" },
      ],
      status: [null, { validators: [Validators.required], updateOn: "blur" }],
    });

    this.enableInput("special_Check", "special");
    this.enableInput("skilled_Check", "skilled");
    this.enableInput("washing_Check", "washing");
    this.enableInput("nightShift_Check", "nightShift");
    this.enableInput("leave_Salary_Check", "leave_Salary");
    this.enableInput("Attendance_bonus_Check", "Attendance_bonus");
    this.enableInput("Food_Allowance_Check", "Food_Allowance");

    this.enableInputDed("canteen_Check", "canteen_amt");
    this.enableInputDed("WC_Policy_Check", "WC_Policy_amt");
    this.enableInputDed("Professional_Tax", "Professional_Tax_amt");
    this.enableInputDed("Shoes_Check", "Shoes_amt");
    this.enableInputDed("Uniform_Tshirt_Check", "Uniform_Tshirt_amt");
    this.enableInputDed("Transport_Check", "Transport_amt");
    this.enableInputDed("Insurance_Check", "Insurance_amt");
    this.enableInputDed("Goggles_deduction_Check", "Goggles_deduction");
    this.enableInputDed("Coat_Check", "Coat");

    this.enableInputDPTC("NSDC_Check", "NSDC_amt");
    this.enableInputDPTC("Uniform_Chrg_Check", "Uniform_Chrg_amt");
    this.enableInputDPTC("Learning_Fee_Check", "Learning_Fee_amt");
    this.enableInputDPTC("EMP_Comp_Ins_Check", "EMP_Comp_Ins_amt");
    this.enableInputDPTC("LWF_Check", "LWF_amt");
    this.enableInputDPTC("Insurance_Premimum_Check", "Insurance_Premimum_amt");
    this.enableInputDPTC(
      "Workmen_Compensation_Check",
      "Workmen_Compensation_amt",
    );
    this.enableInputDPTC("Higer_EducationFee_Check", "Higer_EducationFee_amt");

    this.onServiceOptionChange("Value");
  }

  onServiceOptionChange(event: any) {
    const selectedValue = event.value;

    if (selectedValue === "Value") {
      this.paidToContractor.controls["Service_chrg"].setValue(selectedValue);
      this.paidToContractor.get("Service_Value")?.enable();
      this.paidToContractor.get("Service_Percent")?.disable();
      this.paidToContractor.get("Service_Percent")?.setValue(null);
    } else if (selectedValue === "Percent") {
      this.paidToContractor.controls["Service_chrg"].setValue(selectedValue);
      this.paidToContractor.get("Service_Percent")?.enable();
      this.paidToContractor.get("Service_Value")?.disable();
      this.paidToContractor.get("Service_Value")?.setValue(null);
    }
  }

  showPayscale() {
    this.showPayscaleForm = true;
  }
  hidePayscale() {
    this.showPayscaleForm = false;
  }
  viewPayscale() {
    this.viewPayscaleForn = true;
  }
  hideviewPayscale() {
    this.viewPayscaleForn = false;
  }
  clickAdd() {
    this.showAdd = true;
    this.edit = false;
  }

  formatDateWithHr(inputDate: Date): String {
    const parsedDate = moment(inputDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedDate = parsedDate.format("YYYY-MM-DD HH:mm:ss.SSS");
    return formattedDate;
  }
  formatDate(inputDate: Date): string {
    const parsedDate = moment(inputDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedDate = parsedDate.format("YYYY-MM-DD");
    return formattedDate;
  }

  getPlant_compain() {
    // this.api.getPlant_compain(this.userEmpcode).subscribe((res: any) => {
    //   console.log(res)
    //     this.plantArr = res;
    //     if (this.isFin) {
    //         // Assign `this.plant_Code` dynamically
    //         this.plant_Code = this.plant_Code === '1300' ? ['1300', '1500'] : this.plant_Code;
    //         //this.selectedPlant = this.plant_Code;
    //         this.plantArr = res.filter((item: any) =>
    //             (Array.isArray(this.plant_Code) ? this.plant_Code.includes(item.plant_code) : item.plant_code === this.plant_Code)
    //             && item.del_status === false
    //         );
    //     } else {
    //         this.plantArr = res;
    //     }
    //      this.updateFilteredPlantArr();
    // }, error => {
    //     console.log("Plant list not getting", error);
    // });
  }
  getPlant() {
    this.api.getPlant_compain(this.userEmpcode).subscribe({
      next:(res: any) => {
        console.log(res);
        this.plantArr = res;
        console.log(this.plantArr);
        this.updateFilteredPlantArr();
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  getPayScaleCode() {
    this.api.get_Payscale_code().subscribe({
      next: (res) => {
        this.paycode = res;
        const code = `${this.plant_Code}/${this.paycode}`;
        this.payScale.patchValue({ PayscaleCode: code });
      },
      error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  generatePayscaleCode(plant: String) {
    const code = `${plant}/${this.paycode}`;
    this.filterCon(plant);
    //this.payScale.patchValue({ PayscaleCode: code });
    // console.log(code)
    console.log(`${code}`);
    return code;
  }

  filterCon(plant: any) {
    this.filterconList = this.Con_list.filter(
      (item: any) => item.Plant_code == plant && item.Status === true,
    );
  }

  others() {
    return this.allowance.get("otherAllowance") as FormArray;
  }

  deductions() {
    return this.deduction.get("otherDeduction") as FormArray;
  }

  newAllowance(name: string, amount: number) {
    return this.fb.group({
      name: ["Other Allowance"],
      amount: [amount],
    });
  }
  newDeductions(name: string, amount: number) {
    return this.fb.group({
      name: ["Other Deduction"],
      amount: [amount],
    });
  }

  addnewItem(type: string, name: string, amount: number) {
    if (type === "otherAllowance") {
      return this.others().push(this.newAllowance(name, amount));
    } else if (type === "otherDeduction") {
      return this.deductions().push(this.newDeductions(name, amount));
    }
  }

  deleteAllowance(i: number) {
    this.others().removeAt(i);
  }

  deleteDeductions(i: number) {
    this.deductions().removeAt(i);
  }

  enableInput(check: string, input: string) {
    this.allowance.get(check)?.valueChanges.subscribe((data: any) => {
      if (data === "Yes") {
        this.allowance.get(input)?.enable();
      } else {
        this.allowance.get(input)?.disable();
        this.allowance.get(input)?.reset();
      }
    });
  }

  enableInputDed(check: string, input: string) {
    this.deduction.get(check)?.valueChanges.subscribe((data: any) => {
      if (data === "Yes") {
        this.deduction.get(input)?.enable();
      } else {
        this.deduction.get(input)?.disable();
        this.deduction.get(input)?.reset();
      }
    });
  }

  enableInputDPTC(check: string, input: string) {
    this.paidToContractor.get(check)?.valueChanges.subscribe((data: any) => {
      if (data === "Yes") {
        this.paidToContractor.get(input)?.enable();
      } else {
        this.paidToContractor.get(input)?.disable();
        this.paidToContractor.get(input)?.reset();
      }
    });
  }

  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
      },
    });
  }

  onContractorChange(contId: number) {
    console.log(contId);
    if (contId !== null) {
      this.filterPayscaleHeader = this.PayscaleHeader.filter(
        (option: any) => option.Con_Id === contId,
      );
      console.log(
        this.PayscaleHeader.filter((option: any) => option.Con_Id === 169),
      );
      // Assuming you want to set the payscale based on the selected contractor
      const selectedPayscale = this.filterPayscaleHeader.find(
        (option) => option.Con_Id === contId,
      );
      console.log(selectedPayscale);
      if (selectedPayscale) {
        this.payScale.controls["payscale"].setValue(
          selectedPayscale.PayScale_ID.toString(),
        );
      } else {
        this.filterPayscaleHeader = [];
      }
    }
  }

  resetForm() {
    this.payScale.reset(this.initialRBV);
    this.payScale.patchValue({
      plant: this.plant_Code,
    });
    this.generatePayscaleCode(this.pln!);
    this.allowance.reset();
    //this.payScale.reset()
    this.deduction.reset();
    this.getPlant();
    this.getPlant_compain();
    this.getPayScaleCode();
    // this.stepper.selectedIndex = 0; throws error so cmtd
  }

  // submit Form
  submitForm() {
    console.log("PAYSCALE FORM:", this.payScale);
    if (
      this.validateStep(1) &&
      this.validateStep(2) &&
      this.validateStep(3) &&
      this.validateStep(4)
    ) {
      const allowances = this.allowance.value.otherAllowance;
      const deduction = this.deduction.value.otherDeduction;
      //Payscale Details
      this.newPayScaleObj.Con_Id = this.payScale.value.contractor;
      this.newPayScaleObj.Payscale_ID = this.payScale.value.payscale;
      this.newPayScaleObj.EffectiveDate = this.formatDate(
        this.payScale.value.effectiveDate,
      );
      this.newEarningAllowance.Basic_amt = this.payScale.value.basic;
      this.newEarningAllowance.Stipend = this.payScale.value.stipend;
      this.newEarningAllowance.DA_amt = this.payScale.value.DA;
      this.newEarningAllowance.HRA_amt = this.payScale.value.HRA;

      //Allowance Details
      this.newEarningAllowance.Spcl_allow_amt = this.allowance.value.special;
      this.newEarningAllowance.Skilled_allow_amt = this.allowance.value.skilled;
      this.newEarningAllowance.Attendance_Bonus_amt =
        this.allowance.value.Attendance_bonus;
      this.newEarningAllowance.Leave_Salary_amt =
        this.allowance.value.leave_Salary;
      this.newEarningAllowance.Night_shift_allow_amt =
        this.allowance.value.nightShift;
      this.newEarningAllowance.Washing_allow_amt = this.allowance.value.washing;
      this.newEarningAllowance.Monthly_Bonus_amt =
        this.allowance.value.Monthly_bonus;
      this.newEarningAllowance.Sat_Mon_amt = this.allowance.value.Sat_Mon;
      this.newEarningAllowance.Night_shift_allow_amt =
        this.allowance.value.nightShift;
      this.newEarningAllowance.Amenities_allow_amt =
        this.allowance.value.Amenities;
      this.newEarningAllowance.Retention__amt = this.allowance.value.Retention;

      this.newEarningAllowance.Other_allow_1_amt = allowances[0]?.amount;
      this.newEarningAllowance.Other_allow_2_amt = allowances[1]?.amount;
      this.newEarningAllowance.Other_allow_3_amt = allowances[2]?.amount;
      this.newEarningAllowance.Other_allow_4_amt = allowances[3]?.amount;
      this.newEarningAllowance.Gross_Earnings = this.generateGross("Earning");

      //Deduction Details
      this.newDeduction.Canteen_amt = this.deduction.value.canteen_amt;
      this.newDeduction.Transport_amt = this.deduction.value.Transport_amt;
      this.newDeduction.WC_Policy_amt = this.deduction.value.WC_Policy_amt;
      this.newDeduction.Professional_Tax_amt =
        this.deduction.value.Professional_Tax_amt;
      this.newDeduction.Insurance = this.deduction.value.Insurance_amt;
      this.newDeduction.Shoes_amt = this.deduction.value.Shoes_amt;
      this.newDeduction.Uniform_Tshirt =
        this.deduction.value.Uniform_Tshirt_amt;
      this.newDeduction.Goggles = this.deduction.value.Goggles_deduction;
      this.newDeduction.Coat = this.deduction.value.Coat;
      this.newDeduction.Other_deduction_1_amt = deduction[0]?.amount;
      this.newDeduction.Other_deduction_2_amt = deduction[1]?.amount;
      this.newDeduction.Other_deduction_3_amt = deduction[2]?.amount;
      this.newDeduction.Other_deduction_4_amt = deduction[3]?.amount;
      this.newDeduction.Gross_Deduction = this.generateGross("Deduction");

      // Paid To Contractor
      this.newPaidToContractor.NSDC = this.paidToContractor.value.NSDC_amt;
      this.newPaidToContractor.Uniform_Charges_amt =
        this.paidToContractor.value.Uniform_Chrg_amt;
      this.newPaidToContractor.LWF = this.paidToContractor.value.LWF_amt;
      this.newPaidToContractor.Learning_Fee =
        this.paidToContractor.value.Learning_Fee_amt;
      this.newPaidToContractor.Workmen_Compensation =
        this.paidToContractor.value.Workmen_Compensation_amt;
      this.newPaidToContractor.Insurance_Premium =
        this.paidToContractor.value.Insurance_Premimum_amt;
      this.newPaidToContractor.Higher_Education_Fee =
        this.paidToContractor.value.Higer_EducationFee_amt;
      this.newPaidToContractor.Emp_Comp_Ins =
        this.paidToContractor.value.EMP_Comp_Ins_amt;

      this.newPaidToContractor.Service_Type =
        this.paidToContractor.value.Service_chrg;
      this.newPaidToContractor.Service_chrge =
        this.paidToContractor.value.Service_Value;
      this.newPaidToContractor.Service_percent =
        this.paidToContractor.value.Service_Percent;
      this.newPaidToContractor.Sc_Base =
        this.paidToContractor.value.Service_Base;

      const PayscaleData = {
        PayscaleDetails: this.newPayScaleObj,
        EarningDetails: this.newEarningAllowance,
        DeductionDetails: this.newDeduction,
        PaidToContractorDetails: this.newPaidToContractor,
        Plant: sessionStorage.getItem("plantcode"),
        CreatedBy: sessionStorage.getItem("user_name"),
      };
      console.log(PayscaleData);
      this.api.add_Payscale_Master_new(PayscaleData).subscribe({
        next:(res: any) => {
          console.log(res);
          this.openAlertDialog(`${res}`, "check");
          this.hidePayscale();
          this.resetForm();
          // this.getPayscaleMaster()
          this.getPayscaleMaster_combine();
          this.getPayScaleCode();
          this.PayrolList();
          this.getPayscaleHeader_combine();
          this.payScale.patchValue({
            plant: this.plant_Code,
          });
        },
        error: (error) => {
          if (error.status === 400) {
            this.messageService.add({severity:'error',summary:error?.error})
          } else {
            this.messageService.add({severity:'error',summary:error?.error})
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

  validateStep(stepNumber: number): boolean {
    switch (stepNumber) {
      case 1:
        if (this.payScale.valid) {
          console.log("PAY SCALE FORM:", this.payScale);
          return true;
        } else {
          this.markFormGroupAsTouched(this.payScale);
          this.stepper.selectedIndex = 0;
          return false;
        }
      case 2:
        if (this.allowance.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.allowance);
          this.stepper.selectedIndex = 1;
          return false;
        }
      case 3:
        if (this.deduction.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.deduction);
          this.stepper.selectedIndex = 2;
          return false;
        }
      case 4:
        if (this.paidToContractor.valid) {
          return true;
        } else {
          this.markFormGroupAsTouched(this.paidToContractor);
          this.stepper.selectedIndex = 2;
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

  generateGross(type: String): number {
    if (type === "Earning") {
      const allowances = this.allowance.value.otherAllowance;
      console.log(
        this.payScale.value.basic || 0,
        this.payScale.value.stipend || 0,
        this.payScale.value.DA || 0,
        this.payScale.value.HRA || 0,
        this.payScale.value.conveyance || 0,
        this.allowance.value.special || 0,
        this.allowance.value.skilled || 0,
        this.allowance.value.Attendance_bonus || 0,
        this.allowance.value.leave_Salary || 0,
        this.allowance.value.nightShift || 0,
        this.allowance.value.washing || 0,
        this.allowance.value.Monthly_bonus || 0,
        this.allowance.value.nightShift || 0,
        allowances[0]?.amount || 0,
        allowances[1]?.amount || 0,
        allowances[2]?.amount || 0,
        allowances[3]?.amount || 0,
      );

      const Gross_Earning = parseFloat(
        (this.payScale.value.basic || 0) +
          (this.payScale.value.stipend || 0) +
          (this.payScale.value.DA || 0) +
          (this.payScale.value.HRA || 0) +
          (this.payScale.value.conveyance || 0) +
          (this.allowance.value.special || 0) +
          (this.allowance.value.skilled || 0) +
          (this.allowance.value.Attendance_bonus || 0) +
          (this.allowance.value.leave_Salary || 0) +
          (this.allowance.value.nightShift || 0) +
          (this.allowance.value.washing || 0) +
          (this.allowance.value.Monthly_bonus || 0) +
          (this.allowance.value.nightShift || 0) +
          (allowances[0]?.amount || 0) +
          (allowances[1]?.amount || 0) +
          (allowances[2]?.amount || 0) +
          (allowances[3]?.amount || 0),
      );

      return 0;
    } else if (type === "Deduction") {
      const deduction = this.deduction.value.otherDeduction;
      (console.log(this.deduction.value.canteen_amt || 0),
        this.deduction.value.Transport_amt || 0,
        this.deduction.value.WC_Policy_amt || 0,
        this.deduction.value.Insurance_amt || 0,
        this.deduction.value.Shoes_amt || 0,
        this.deduction.value.Uniform_Tshirt_amt || 0,
        this.deduction.value.Goggles_deduction || 0,
        this.deduction.value.Coat || 0,
        deduction[0]?.amount || 0,
        deduction[1]?.amount || 0,
        deduction[2]?.amount || 0,
        deduction[3]?.amount || 0);

      const Gross_Deduction = parseFloat(
        (this.deduction.value.canteen_amt || 0) +
          (this.deduction.value.Transport_amt || 0) +
          (this.deduction.value.WC_Policy_amt || 0) +
          (this.deduction.value.Insurance_amt || 0) +
          (this.deduction.value.Shoes_amt || 0) +
          (this.deduction.value.Uniform_Tshirt_amt || 0) +
          (this.deduction.value.Goggles_deduction || 0) +
          (this.deduction.value.Coat || 0) +
          (deduction[0]?.amount || 0) +
          (deduction[1]?.amount || 0) +
          (deduction[2]?.amount || 0) +
          (deduction[3]?.amount || 0),
      );

      return 0;
    } else {
      console.log(`Unknown type: ${type}`);
      return 0;
      //throw new Error(`Unexpected type: ${type}`);
    }
  }

  getPayscaleMaster() {
    this.api.get_Payscale_Master(this.pln).subscribe({
      next:(res) => {
        this.payscaleData = res;
        this.filter_Latest("Latest");
      },
      error:(error) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  getPayscaleMaster_combine() {
    this.api
      .get_Payscale_Master_combine(this.plant_Code, this.userEmpcode)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.payscaleData = res;
          this.filter_Latest("Latest");
        },
        error:(error) => {
          console.error("ERROR:", error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        },
      });
  }

  /**
   * filter payscale data based on payscale type
   */
  filter_Latest(data: any) {
    if (data === "Latest") {
      this.filteredPayscaleData = this.payscaleData.filter(
        (item: any) => item.Status == true,
      );
      // console.log(this.filteredPayscaleData);
    } else if (data === "Old") {
      this.filteredPayscaleData = this.payscaleData.filter(
        (item: any) => item.Status == false,
      );
    } else {
      this.filteredPayscaleData = this.payscaleData;
    }
  }

  getPayscaleHeader() {
    this.api.get_Payscale_Header(this.plant_Code).subscribe({
      next: (res) => {
        console.log(res);
        this.PayscaleHeader = res;
      },
      error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message })
      }
    });
  }

  getPayscaleHeader_combine() {
    this.api
      .get_Payscale_Header_combine(this.plant_Code, this.userEmpcode)
      .subscribe({
        next:(res: any) => {
          console.log(res);

          this.PayscaleHeader = res;
        },
        error: (error) => {
          console.error('ERROR:',error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          })
        }
      });
  }

  getPayrollList() {
    this.api.getPayroll().subscribe({
      next:(res) => {
        this.PayrolList = res;

        this.PayrolList = this.PayrolList.filter(
          (item: any) => item.Plant_code === this.plant_Code,
        );
        // console.log(this.PayrolList[0])
      },
      error:(error:any) => {
        console.error("ERROR:", error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  getContractorList() {
    this.api.getContractor_combine(this.userEmpcode).subscribe({
      next: (res) => {
        this.conList = res;
      },
      error: (error) => {
        console.error('ERROR:', error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  getContractorName(id: number): string {
    const contractor = this.conList.find((con: any) => con.Con_Id === id);
    return contractor ? contractor.Cont_company_name : "";
  }

  getPayscaleId(payScaleId: string): string | undefined {
    const foundOption = this.filterPayscaleHeader.find(
      (option: any) => option.PayScale_ID.toString() === payScaleId,
    );
    return foundOption ? foundOption.PayScale_ID.toString() : undefined;
  }

  onView(data: any) {
    // this.viewPayscale(); mannual
    this.showAdd = false;
    console.log(data);

    this.NewPayScaleFormGroup.patchValue(data);

    console.log("Setting payscale value:", data.PayScale_ID.toString());
    console.log(
      "Available options:",
      this.filterPayscaleHeader.map((option: any) => option.PayScale_ID == 1),
    );
    /** open tempalte modal */
    this.openModal(this.viewPayscaleTemplate);
  }


  onEdit(data: any) {
    console.log("Data:", data);
    // console.log('PayScale_ID:', data.PayScale_ID);

    this.showAdd = false;
    this.edit = true;
    // this.showPayscaleForm = true; manual

    this.onContractorChange(data.Con_ID);

    this.payScale.patchValue({
      PayscaleCode: data.PayScale_ID || null,
      plant: data.Plant_Code.toString(),
      contractor: data.Con_ID,
      payscale: data.PayScale_ID || null,
      effectiveDate: data.Effective_Date1,
      stipend: data.Stipend,
      basic: data.Basic,
      DA: data.DA,
      HRA: data.HRA,
    });

    this.allowance.patchValue({
      special: data.Spl_allow || "",
      special_Check: data.Spl_allow > 0 ? "Yes" : "No",
      skilled: data.Skilled_allow_P3 || "",
      skilled_Check: data.Skilled_allow_P3 > 0 ? "Yes" : "No",
      leave_Salary: data.Leave_Salary || "",
      leave_Salary_Check: data.Leave_Salary > 0 ? "Yes" : "No",
      nightShift: data.Night_shift_allowance || "",
      nightShift_Check: data.Night_shift_allowance > 0 ? "Yes" : "No",
      washing: data.Washing_allow || "",
      washing_Check: data.Washing_allow > 0 ? "Yes" : "No",
      Monthly_bonus: data.Monthly_Bonus || "",
      Monthly_bonus_Check: data.Monthly_Bonus > 0 ? "Yes" : "No",
      Attendance_bonus: data.Monthly_Attn_Incentive || "",
      Attendance_bonus_Check: data.Monthly_Attn_Incentive > 0 ? "Yes" : "No",
      Sat_Mon: data.Sat_and_Mon_Incentive || "",
      Sat_Mon_Check: data.Sat_and_Mon_Incentive > 0 ? "Yes" : "No",
      Retention: data.Retention_Incentive || "",
      Retention_Check: data.Retention_Incentive > 0 ? "Yes" : "No",
      Amenities: data.Amenities_Allow || "",
      Amenities_Check: data.Amenities_Allow > 0 ? "Yes" : "No",
      otherAllowance: [
        { name: "Other Allowance 1", amount: data.Other_allowance_1 },
        { name: "Other Allowance 2", amount: data.Other_allowance_2 },
        { name: "Other Allowance 3", amount: data.Other_allowance_3 },
        { name: "Other Allowance 4", amount: data.Other_allowance_4 },
      ],
      Gross_Earning: data.Gross_Earning,
    });

    this.deduction.patchValue({
      canteen_Check: data.Canteen > 0 ? "Yes" : "No",
      canteen_amt: data.Canteen || "",
      WC_Policy_Check: data.WC_Policy > 0 ? "Yes" : "No",
      WC_Policy_amt: data.WC_Policy || "",
      Shoes_Check: data.Shoe_FirstTime > 0 ? "Yes" : "No",
      Shoes_amt: data.Shoe_FirstTime || "",
      Uniform_Tshirt_Check: data.Uniform_FirstTime > 0 ? "Yes" : "No",
      Uniform_Tshirt_amt: data.Uniform_FirstTime || "",
      Transport_Check: data.Transport > 0 ? "Yes" : "No",
      Transport_amt: data.Transport || "",
      Professional_Tax_Check: data.Professional_Tax > 0 ? "Yes" : "No",
      Professional_Tax_amt: data.Professional_Tax || "",
      Insurance_Check: data.Insurance > 0 ? "Yes" : "No",
      Insurance_amt: data.Insurance || "",
      Goggles_deduction: data.Glass_FirstTime || "",
      Goggles_deduction_Check: data.Glass_FirstTime > 0 ? "Yes" : "No",
      Coat: data.Coat_FirstTime || "",
      Coat_Check: data.Coat_FirstTime > 0 ? "Yes" : "No",
      otherDeduction: [
        { name: "Other Deduction 1", amount: data.Other_deduction_1 },
        { name: "Other Deduction 2", amount: data.Other_deduction_2 },
        { name: "Other Deduction 3", amount: data.Other_deduction_3 },
        { name: "Other Deduction 4", amount: data.Other_deduction_4 },
      ],
      Gross_Deduction: data.Gross_Deduction,
    });

    this.paidToContractor.patchValue({
      NSDC_Check: data.NSDC_Contribution > 0 ? "Yes" : "No",
      NSDC_amt: data.NSDC_Contribution || "",
      Uniform_Chrg_Check: data.Uniform_Charges > 0 ? "Yes" : "No",
      Uniform_Chrg_amt: data.Uniform_Charges || "",
      Learning_Fee_Check: data.Learning_Fees > 0 ? "Yes" : "No",
      Learning_Fee_amt: data.Learning_Fees || "",
      EMP_Comp_Ins_Check: data.Emp_Comp_Ins > 0 ? "Yes" : "No",
      EMP_Comp_Ins_amt: data.Emp_Comp_Ins || "",
      LWF_Check: data.Labour_Welfare_Fund > 0 ? "Yes" : "No",
      LWF_amt: data.Labour_Welfare_Fund || "",
      Insurance_Premimum_Check: data.Insurance_Premium > 0 ? "Yes" : "No",
      Insurance_Premimum_amt: data.Insurance_Premium || "",
      Workmen_Compensation_Check: data.Workmen_Compensation > 0 ? "Yes" : "No",
      Workmen_Compensation_amt: data.Workmen_Compensation || "",
      Higer_EducationFee_Check: data.Higher_Education_Fee > 0 ? "Yes" : "No",
      Higer_EducationFee_amt: data.Higher_Education_Fee || "",
      Service_chrg: data.Service_Charge_Fixed != 0 ? "Value" : "Percent",
      Service_Percent: data.Service_charges_Percentage || "",
      Service_Value: data.Service_Charge_Fixed || "",
      Service_Base: data.SC_Base,
      status: data.Status.toString(),
    });
    /** open modal */
    this.openModal(this.payscaleModalTemplate);
  }
  updatePayscaleMaster() {
    if (this.validateStep(1) && this.validateStep(2) && this.validateStep(3)) {
      const allowances = this.allowance.value.otherAllowance;
      const deduction = this.deduction.value.otherDeduction;
      // console.log(this.payScale.value);
      // console.log(this.allowance.value);
      // console.log(this.deduction.value);
      // console.log(this.paidToContractor.value);
      //Payscale Details
      this.newPayScaleObj.Con_Id = this.payScale.value.contractor;
      this.newPayScaleObj.Payscale_ID = this.payScale.value.payscale;
      this.newPayScaleObj.EffectiveDate = this.formatDate(
        this.payScale.value.effectiveDate,
      );
      this.newEarningAllowance.Basic_amt = this.payScale.value.basic;
      this.newEarningAllowance.Stipend = this.payScale.value.stipend;
      this.newEarningAllowance.DA_amt = this.payScale.value.DA;
      this.newEarningAllowance.HRA_amt = this.payScale.value.HRA;

      //Allowance Details
      this.newEarningAllowance.Spcl_allow_amt = this.allowance.value.special;
      this.newEarningAllowance.Skilled_allow_amt = this.allowance.value.skilled;
      this.newEarningAllowance.Attendance_Bonus_amt =
        this.allowance.value.Attendance_bonus;
      this.newEarningAllowance.Leave_Salary_amt =
        this.allowance.value.leave_Salary;
      this.newEarningAllowance.Night_shift_allow_amt =
        this.allowance.value.nightShift;
      this.newEarningAllowance.Washing_allow_amt = this.allowance.value.washing;
      this.newEarningAllowance.Monthly_Bonus_amt =
        this.allowance.value.Monthly_bonus;
      this.newEarningAllowance.Sat_Mon_amt = this.allowance.value.Sat_Mon;
      this.newEarningAllowance.Night_shift_allow_amt =
        this.allowance.value.nightShift;
      this.newEarningAllowance.Amenities_allow_amt =
        this.allowance.value.Amenities;
      this.newEarningAllowance.Retention__amt = this.allowance.value.Retention;

      this.newEarningAllowance.Other_allow_1_amt = allowances[0]?.amount || 0;
      this.newEarningAllowance.Other_allow_2_amt = allowances[1]?.amount || 0;
      this.newEarningAllowance.Other_allow_3_amt = allowances[2]?.amount || 0;
      this.newEarningAllowance.Other_allow_4_amt = allowances[3]?.amount || 0;
      this.newEarningAllowance.Gross_Earnings = 0;

      //Deduction Details
      this.newDeduction.Canteen_amt = this.deduction.value.canteen_amt;
      this.newDeduction.Transport_amt = this.deduction.value.Transport_amt;
      this.newDeduction.WC_Policy_amt = this.deduction.value.WC_Policy_amt;
      this.newDeduction.Professional_Tax_amt =
        this.deduction.value.Professional_Tax_amt;
      this.newDeduction.Insurance = this.deduction.value.Insurance_amt;
      this.newDeduction.Shoes_amt = this.deduction.value.Shoes_amt;
      this.newDeduction.Uniform_Tshirt =
        this.deduction.value.Uniform_Tshirt_amt;
      this.newDeduction.Goggles = this.deduction.value.Goggles_deduction;
      this.newDeduction.Coat = this.deduction.value.Coat;
      this.newDeduction.Other_deduction_1_amt = deduction[0]?.amount || 0;
      this.newDeduction.Other_deduction_2_amt = deduction[1]?.amount || 0;
      this.newDeduction.Other_deduction_3_amt = deduction[2]?.amount || 0;
      this.newDeduction.Other_deduction_4_amt = deduction[3]?.amount || 0;
      this.newDeduction.Gross_Deduction = 0;

      // Paid To Contractor
      this.newPaidToContractor.NSDC = this.paidToContractor.value.NSDC_amt;
      this.newPaidToContractor.Uniform_Charges_amt =
        this.paidToContractor.value.Uniform_Chrg_amt;
      this.newPaidToContractor.LWF = this.paidToContractor.value.LWF_amt;
      this.newPaidToContractor.Learning_Fee =
        this.paidToContractor.value.Learning_Fee_amt;
      this.newPaidToContractor.Workmen_Compensation =
        this.paidToContractor.value.Workmen_Compensation_amt;
      this.newPaidToContractor.Insurance_Premium =
        this.paidToContractor.value.Insurance_Premimum_amt;
      this.newPaidToContractor.Higher_Education_Fee =
        this.paidToContractor.value.Higer_EducationFee_amt;
      this.newPaidToContractor.Emp_Comp_Ins =
        this.paidToContractor.value.EMP_Comp_Ins_amt;

      this.newPaidToContractor.Service_Type =
        this.paidToContractor.value.Service_chrg;
      this.newPaidToContractor.Service_chrge =
        this.paidToContractor.value.Service_Value;
      this.newPaidToContractor.Service_percent =
        this.paidToContractor.value.Service_Percent;
      this.newPaidToContractor.Sc_Base =
        this.paidToContractor.value.Service_Base;

      const PayscaleData = {
        PayscaleDetails: this.newPayScaleObj,
        EarningDetails: this.newEarningAllowance,
        DeductionDetails: this.newDeduction,
        PaidToContractorDetails: this.newPaidToContractor,
        Plant: sessionStorage.getItem("plantcode"),
        CreatedBy: sessionStorage.getItem("user_name"),
      };

      console.log(PayscaleData);
      this.api.Update_Payscale_Master(PayscaleData).subscribe(
        (res: any) => {
          console.log(res);
          this.openAlertDialog(`${res}`, "check");
          this.hidePayscale();
          this.resetForm();
          // this.getPayscaleMaster()
          this.getPayscaleMaster_combine();
          this.getPayScaleCode();
          this.PayrolList();
          this.getPayscaleHeader_combine();
          this.payScale.patchValue({
            plant: this.plant_Code,
          });
        },
        (error) => {
          if (error.status === 400) {
            this.openAlertDialog(`${error.error}`, "error");
          } else {
            this.openAlertDialog(`${error.error}`, "error");
          }
        },
      );
    }
  }

  closeAllForms() {
    this.resetForm();
    this.hidePayscale();
  }

  closeViewForms() {
    this.resetForm();
    this.hideviewPayscale();
  }

  showInput(check: any) {
    if (check == "No") {
      this.inputPopUp = false;
    } else {
      this.inputPopUp = true;
    }
  }

  exportExcel(): void {
    console.log("hif");

    const excludedKeys = [
      "Effective_Date1",
      "EM_PF_Percent",
      "Max_PF_Amount",
      "EMP_PF_Percent",
      "EM_ESI_Percent",
      "EMP_ESI_Percent",
      "Con_ID",
      "Effective_Date",
      "Tot_Deduction",
      "Gross_Earnings",
      "Status",
      "PayScale ID",
    ];
    const keyMapping: any = {
      PayScale_Name: "Pay Scale Name",
      Cont_company_name: "Contractor Company Name",
      Effective_Date2: "Effective Date",
      Stipend: "Stipend",
      Basic: "Basic",
      DA: "DA",
      HRA: "HRA",
      Leave_Salary: "Leave Salary",
      Washing_allow: "Washing Allowance",
      Monthly_Bonus: "Monthly Bonus",
      Sat_and_Mon_Incentive: "Sat and Mon Incentive",
      Monthly_Attn_Incentive: "Monthly Attendance Incentive",
      Retention_Incentive: "Retention Incentive",
      Spl_allow: "Special Allowance",
      Night_shift_allowance: "Night Shift Allowance",
      Skilled_allow_P3: "Skilled Allowance P3",
      Amenities_Allow: "Amenities Allowance",
      Other_allowance_1: "Other Allowance 1",
      Other_allowance_2: "Other Allowance 2",
      Other_allowance_3: "Other Allowance 3",
      Other_allowance_4: "Other Allowance 4",
      Canteen: "Canteen",
      Transport: "Transport",
      Professional_Tax: "Professional Tax",
      WC_Policy: "WC Policy",
      Insurance: "Insurance",
      Shoe_FirstTime: "Shoe First Time",
      Glass_FirstTime: "Glass First Time",
      Uniform_FirstTime: "Uniform First Time",
      Coat_FirstTime: "Coat First Time",
      Other_deduction_1: "Other Deduction 1",
      Other_deduction_2: "Other Deduction 2",
      Other_deduction_3: "Other Deduction 3",
      Other_deduction_4: "Other Deduction 4",
      Service_Charge_Fixed: "Service Charge Fixed",
      Service_charges_Percentage: "Service Charges Percentage",
      SC_Base: "SC Base",
      NSDC_Contribution: "NSDC Contribution",
      Uniform_Charges: "Uniform Charges",
      Labour_Welfare_Fund: "Labour Welfare Fund",
      Insurance_Premium: "Insurance Premium",
      Learning_Fees: "Learning Fees",
      Workmen_Compensation: "Workmen Compensation",
      Emp_Comp_Ins: "Emp Comp Ins",
      Higher_Education_Fee: "Higher Education Fee",

      Gross_Earning: "Gross Earning",
      EM_PF_Cal_Val: "EM PF Cal Val",
      EMP_PF_Cal_Val: "EMP PF Cal Val",
      EM_ESI_Cal_Val: "EM ESI Cal Val",
      EMP_ESI_Cal_Val: "EMP ESI Cal Val",
      Servive_Charge_Val: "Service Charge Val",
      Gross_Deduction: "Gross Deduction",
      Paid_To_Contractor: "Paid To Contractor",
      Net_Take_Home: "Net Take Home",
      ToTal_Base_Value: "Total Base Value",
      Service_Tax_Val: "Service Tax Val",
      CTC: "CTC",
    };
    const transformedArray = this.filteredPayscaleData.map((data: any) => {
      const transformedObj: any = {};
      Object.keys(data).forEach((key) => {
        if (!excludedKeys.includes(key)) {
          const newKey = keyMapping[key] || key.replace(/_/g, " ");
          transformedObj[newKey] = data[key];
        }
      });
      return transformedObj;
    });

    if (transformedArray.length === 0) {
      console.error(
        "No data to export. The filteredPayscaleData array is empty.",
      );
      return;
    }

    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");

    // Style the header row
    if (ws["!rows"] && ws["!rows"].length > 0) {
      const headerRow = ws["!rows"][0];
      if (Array.isArray(headerRow)) {
        headerRow.forEach((cell: any) => {
          cell.s = {
            fill: {
              fgColor: {
                rgb: "FFFF00", // Yellow color
              },
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        });
      }
    } else {
      console.warn("No rows found in the worksheet. Cannot style header.");
    }

    XLSX.writeFile(wb, "Mst_payscale.xlsx");
  }

  /**
   * open ngb modal
   * @param templateRef
   */
  openModal(templateRef:any){
    this.modalService.open(templateRef,{centered:true,});
  }
}
