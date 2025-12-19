import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { environment } from "src/environments/environment.prod";
import { ToastComponent } from "src/app/new-contractor-mod/toast/toast.component";
import { ClamAPIService } from "src/app/new-contractor-mod/clam-api.service";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "primeng/api";
import moment from "moment";
import { LoaderserviceService } from "src/app/loaderservice.service";

@Component({
  selector: "app-van-delay-regularization",
  templateUrl: "./van-delay-regularization.component.html",
  styleUrls: ["./van-delay-regularization.component.css"],
})
export class VanDelayRegularizationComponent implements OnInit {
  item: any = sessionStorage.getItem("all");

  date: any;
  route: any;
  transporter: any;
  Category: any;
  lc_min: any;
  driver: any;
  operator_date: any;
  trainee_date: any;
  minDate: any;
  maxDate: any;
  userList: any[] = [
  {
    Route_Name: "Route 12",
    gen_id: "GEN201",
    fullname: "Arun Kumar",
    shift_desc: "Shift A",
    in_time: new Date(2025, 1, 15, 8, 55, 12),   // 15-02-2025 08:55:12
    out_time: new Date(2025, 1, 15, 17, 10, 45), // 17:10:45
    present_type: "P",
    late_comeing: 5,
    Worked_Hrs: "08:15",
    Shift_Duration: "08:00"
  },
  {
    Route_Name: "Route 7",
    gen_id: "GEN202",
    fullname: "Siva Prakash",
    shift_desc: "Shift B",
    in_time: new Date(2025, 1, 15, 9, 12, 30),
    out_time: new Date(2025, 1, 15, 18, 5, 10),
    present_type: "LC",
    late_comeing: 22,
    Worked_Hrs: "08:53",
    Shift_Duration: "09:00"
  },
  {
    Route_Name: "Route 3",
    gen_id: "GEN203",
    fullname: "Meena Devi",
    shift_desc: "Shift A",
    in_time: new Date(2025, 1, 15, 8, 45, 0),
    out_time: new Date(2025, 1, 15, 17, 0, 0),
    present_type: "P",
    late_comeing: 0,
    Worked_Hrs: "08:15",
    Shift_Duration: "08:00"
  },
  {
    Route_Name: "Route 5",
    gen_id: "GEN204",
    fullname: "Priya Dharshini",
    shift_desc: "Shift C",
    in_time: new Date(2025, 1, 15, 10, 5, 20),
    out_time: new Date(2025, 1, 15, 19, 30, 55),
    present_type: "LC",
    late_comeing: 35,
    Worked_Hrs: "08:25",
    Shift_Duration: "09:00"
  },
  {
    Route_Name: "NA",
    gen_id: "GEN205",
    fullname: "Vignesh R",
    shift_desc: "Shift A",
    in_time: new Date(2025, 1, 15, 8, 50, 10),
    out_time: new Date(2025, 1, 15, 17, 20, 40),
    present_type: "P",
    late_comeing: 0,
    Worked_Hrs: "08:30",
    Shift_Duration: "08:00"
  }
];;
  errorList: any[] = [];
  routelist: any[] = [];
  AppliedList: any[] = [
  {
    attn_date: new Date(2025, 1, 15),
    gen_id: "GEN101",
    fullname: "Arun Kumar",
    apprentice_type: "ITI",
    Transport: "Bus",
    Driver: "Ramesh",
    Route_Name: "Route 12",

    Present_type_before: "P",
    Lc_min_before: 12,
    Worked_hrs_before: "07:18",
    Shift_Duration: "08:00",

    Applied_LC_min: 5,

    Present_type_after: "P",
    Lc_min_after: 7,
    Worked_hrs_after: "07:35"
  },
  {
    attn_date: new Date(2025, 1, 15),
    gen_id: "GEN102",
    fullname: "Siva Prakash",
    apprentice_type: "NAPS",
    Transport: "Van",
    Driver: "Karthik",
    Route_Name: "Route 7",

    Present_type_before: "LC",
    Lc_min_before: 28,
    Worked_hrs_before: "06:45",
    Shift_Duration: "08:00",

    Applied_LC_min: 15,

    Present_type_after: "P",
    Lc_min_after: 13,
    Worked_hrs_after: "07:05"
  },
  {
    attn_date: new Date(2025, 1, 15),
    gen_id: "GEN103",
    fullname: "Meena Devi",
    apprentice_type: "BOAT",
    Transport: "Bus",
    Driver: "Suresh",
    Route_Name: "Route 3",

    Present_type_before: "A",
    Lc_min_before: 0,
    Worked_hrs_before: "00:00",
    Shift_Duration: "08:00",

    Applied_LC_min: 0,

    Present_type_after: "A",
    Lc_min_after: 0,
    Worked_hrs_after: "00:00"
  },
  {
    attn_date: new Date(2025, 1, 15),
    gen_id: "GEN104",
    fullname: "Priya Dharshini",
    apprentice_type: "ITI",
    Transport: "Auto",
    Driver: "Mani",
    Route_Name: "Route 5",

    Present_type_before: "P",
    Lc_min_before: 5,
    Worked_hrs_before: "07:40",
    Shift_Duration: "08:00",

    Applied_LC_min: 3,

    Present_type_after: "P",
    Lc_min_after: 2,
    Worked_hrs_after: "07:50"
  },
  {
    attn_date: new Date(2025, 1, 15),
    gen_id: "GEN105",
    fullname: "Vignesh R",
    apprentice_type: "NATS",
    Transport: "Bike",
    Driver: "Self",
    Route_Name: "NA",

    Present_type_before: "LC",
    Lc_min_before: 18,
    Worked_hrs_before: "07:00",
    Shift_Duration: "08:00",

    Applied_LC_min: 10,

    Present_type_after: "P",
    Lc_min_after: 8,
    Worked_hrs_after: "07:20"
  }
];
/** dropdown roles */
  roles = [
    { value: "T", label: "Trainee/CL" },
    { value: "O", label: "Operator" },
  ];
  all: any;
  userDetails: any;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private OpApi: ClamAPIService,
    private messageService: MessageService,
    public loader:LoaderserviceService,
  ) {
    this.setDateRange();
  }
  isadmin: any = sessionStorage.getItem("isadmin") == "true" ? true : false;
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  plant: any = sessionStorage.getItem("plantcode");

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
    this.getroute();
    this.getdetails();
  }

  setDateRange() {
    this.get_payroll();
    const today = new Date();
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      27
    ); // Previous month 26th
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Yesterday

    // Format dates to YYYY-MM-DD for input type="date"
    // this.minDate = previousMonth.toISOString().split('T')[0];
    // this.maxDate = yesterday.toISOString().split('T')[0];
  }

  onCategoryChange() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (this.Category === "O") {
      this.minDate = this.operator_date.bill_Start_date_O.substring(0, 10); // Extract YYYY-MM-DD
      const endDateO = new Date(this.operator_date.bill_End_Date_O);
      this.maxDate =
        endDateO < today
          ? this.operator_date.bill_End_Date_O.substring(0, 10)
          : yesterday.toISOString().substring(0, 10);
      // min date as date object
      this.minDate = new Date(this.minDate);
    } else if (this.Category === "T") {
      this.minDate = this.trainee_date.bill_Start_date_T.substring(0, 10); // Extract YYYY-MM-DD
      /** min date as js object */
      this.minDate = new Date(this.minDate);
      const endDateT = new Date(this.trainee_date.bill_End_Date_T);

      // If bill_End_Date_T is before today, use it. Otherwise, use yesterday.
      this.maxDate =
        endDateT < today
          ? this.trainee_date.bill_End_Date_T.substring(0, 10)
          : yesterday.toISOString().substring(0, 10);
      /** max date as js date object */
      this.maxDate = new Date(this.maxDate);
    } else {
      this.minDate = ""; // Reset if no category selected
      this.maxDate = ""; // Reset if no category selected
    }
  }

  /** 
   * Open Material Dialog modal
   */
  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
      },
    });
  }

  /** 
   * get route list based on plant
   * @property {*} routelist
   */
  getroute() {
    this.OpApi.getRoute(this.plant).subscribe({
      next:  (res: any) => {
        console.log('ROUTE LIST:',res);
        this.routelist = res;
      },
      error: (error) => {
        console.error('ERROR:',error);
        // this.openAlertDialog("Data not found",'error');
        this.messageService.add({ severity: "error", summary: error.message });
      }
    });
  }

  /** 
   * GET van delay regularization data
   * @property {*} AppliedList
   */
  getdetails() {
    this.OpApi.get_Van_Delay_Regularization_Details(this.plant).subscribe({
      next: (res: any) => {
        console.log('VAN REGULARIZATION DETAILS:',res);
        this.AppliedList = res;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    });
  }

  /** 
   * GET route payroll date
   * @property {Date} operator_date
   * @property {Date} trainee_date
   * 
   */
  get_payroll() {
    this.OpApi.get_route_payroll(this.plant).subscribe({
      next: (res: any) => {
        console.log('OP DATE:',res[0][0]);
        console.log('TR DATE:',res[1][0]);
        this.operator_date = res[0][0];
        this.trainee_date = res[1][0];
        // this.routelist =res
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    });
  }

  isverifyValid(): boolean {
    return !!this.route && !!this.date && !!this.Category;
  }
  issubmitValid(): boolean {
    return !!this.transporter && !!this.driver && !!this.lc_min;
  }

  verify() {
    this.date = moment(this.date).format("YYYY-MM-DD");
    if (
      this.date == "" ||
      this.date == undefined ||
      this.route == "" ||
      this.route == undefined ||
      this.Category == "" ||
      this.Category == undefined
    ) {
      // alert("Gen Id cannot be empty");
      // this.openAlertDialog("Fields cannot be empty",'error')
      this.messageService.add({
        severity: "warn",
        summary: "Fields cannot be Empty!",
      });
      return;
    }
    this.OpApi.get_User_route_dtls(
      this.date,
      this.plant,
      this.route,
      this.Category
    ).subscribe(
      (res: any) => {
        // this.userList = res;

        // if(res[0].Van_Eligible == true){
        //   this.openAlertDialog("Already Van Facility Mapped",'error')
        // }else{
        //   this.userList =res
        // }
      },
      (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      }
    );
  }

  /** submit van delay regularization */
  submit() {
    if (
      this.transporter == "" ||
      this.transporter == undefined ||
      this.driver == "" ||
      this.driver == undefined ||
      this.lc_min == "" ||
      this.lc_min == undefined
    ) {
      // alert("Gen Id cannot be empty");
      this.messageService.add({
        severity: "warn",
        summary: "Fields cannot be Empty!",
      });
      return;
    }

    const data = {
      userlist: this.userList,
      transporter: this.transporter,
      driver: this.driver,
      lc_min: this.lc_min,
      applied_by: this.userEmpcode,
      date: this.date,
      plant: this.plant,
      Category: this.Category,
    };
    this.OpApi.Van_delay(data).subscribe({
      next:  (res: any) => {
        console.log(res);

        // this.openAlertDialog(res,'Check')
        this.messageService.add({ severity: "info", summary: res });
        // this.genIdChange()
        this.getdetails();
        this.closeAllForms1();
        this.date = null;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.error });
      }
    });
  }

  /** close form */
  closeAllForms1() {
    this.route = null;
    this.date = null;
    this.transporter = null;
    this.Category = null;
    this.driver = null;
    this.lc_min = null;
    this.userList = [];
  }

  /** 
   * convert number to string
   * @return {string}
   * @param number
   *  */
  convertString(number:any):string{
    return String(number);
  }
}
