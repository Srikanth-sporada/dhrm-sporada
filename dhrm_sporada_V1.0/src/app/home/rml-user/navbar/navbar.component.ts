import { Component, OnDestroy, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "primeng/api";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
} from "@angular/forms";
import { FormService } from "../new-joiners/form.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { environment } from "src/environments/environment.prod";
import { homeImages } from "src/app/imageList";
import { Utility } from "src/app/utils/utils";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})

export class NavbarComponent implements OnInit {
  url = environment.path + "/";
  news:any = [];
  /** Menu Hide variables */
  hideMissPunchHr = environment.hideMissPunchHR;
  hideSalaryMaster = environment.hideSalaryMaster;
  hidePmpd = environment.hidePmpd;
  hideMidPermission = environment.hideMidPermission;
  hidePeoplePlanning = environment.hidePeoplePlanning;
  hideHrDashboard = environment.hideHrDashboard;
  hideHrSumary = environment.hideHrSummary;
  hideCanteenDashboard = environment.hideCanteenDashboard;
  hideCumulativeReport = environment.hideCumulativeReport;
  hideCanteenReport = environment.hideCanteenReport;
  hideLopReport = environment.hideLopReport;
  hideMachinePunchReport = environment.hideMachineReport;
  hideOperatorCoffApproval = environment.hideOperatorCOffApproval;
  hideHrmsNewTab:boolean = environment?.hideHrmsNewTab
  /** home page image */
  homePageImg = ['assets/home-one.png' , 'assets/home-two.png'];
  homepageImgIndex:any;
  /** ENV based nav menu bg */
  prodBg:any = environment?.prodBg;
  uatBg:any = environment?.uatBg;
  devBg:any = environment?.devBg;
  appEnvironment:any = environment?.appEnvironment;
  homepageImgURL:any;
  /** permission properties */
  ishrappr: any;
  form: FormGroup = new FormGroup({});
  ishr: any;
  istrainer: any;
  istrainee: any;
  isCL: any;
  istou: any;
  isadmin: any;
  isOtAppr: any;
  isFin: any;
  isCmed: any;
  isPlantHead: any;
  isOperator: boolean;
  isFh: any;
  a: any;
  plant: any;
  // GET HR api call data
  username: any = {
    username: sessionStorage.getItem("user_name"),
    user: sessionStorage.getItem("user"),
  };
  showname: any = "";
  showid: any = "";
  genid: any = "";

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  showdept: string | null;
  showplant: string | null;
  issupervisor: string | null;
  all: any;
  isRA: string | null;
  user: any;
  apprentice_type: any;
  access_master: string | null;
  Is_CHR: any;
  isOpened:boolean = false;
  // matExpansionPanelOpenState: boolean = false;
  isDashboardExpanded: boolean = false;
  isMasterExpanded: boolean = false;
  isTraineeOnboardExpanded: boolean = false;
  isContractorOnboardExpanded: boolean = false;
  isSalaryMasterExpanded: boolean = false;
  isTrainingExpanded: boolean = false;
  isTimeOfficeMenuExpanded: boolean = false;
  isSkillStatusExpanded:boolean = false;
  isTimeOfficeStatusExpanded: boolean = false;
  isTimeOfficeExpanded: boolean = false;
  isApprovalExpanded: boolean = false;
  isSkillDevExpanded: boolean = false;
  isPeoplePlaningExpanded: boolean = false;
  isPmpdExpanded: boolean = false;
  isReportsExpanded: boolean = false;
  isUsermannualExpanded: boolean = false;
  /** payroll navigation */
  authToken:any = sessionStorage.getItem('token');
  /** logged in user company code & plant code */
  companyCode:any;
  plantCode:any;

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private cookie: CookieService,
    private http: HttpClient,
    private service: ApiService,
    private active: ActivatedRoute,
    public router: Router,
    private messageService:MessageService,
    private utils:Utility,
  ) {
    this.form = fb.group({
      username: new UntypedFormControl(sessionStorage.getItem("user_name")),
    });
  }

  
  delCookie() {
    this.user = sessionStorage.getItem("user");
    this.cookie.delete("User_Name");
    this.cookie.delete("Password");
    sessionStorage.clear();
    console.log('LOG OUT NAV URL:',`/${this.companyCode}/${this.plantCode}`)
    this.router.navigateByUrl(`/${this.companyCode}/${this.plantCode}`);
  }

  ngOnInit(): void {
    /** generate image function */ 
    this.generateImage();
    this.getHr();
    /** new Images */
    this.news = homeImages;
    /** clear session after seconds  */
    if(environment.enableSessionTimeout){
      this.utils.logOutUser();
    }
    // console.log('NEW BG:',this.appEnvironment,this.uatBg,this.devBg,this.prodBg)
    // console.log(this.payrollNavLink);
  }

  /** 
   * @description navigate to payroll function
   * @var baseUrl base payroll url from env
   * @var payrollURL js url object
   * @var params params to append STOKEN
   * @property {*} isadmin extra check to ensure user access payroll
   * @global window
   */
  navigateToPayroll(){
    if(this.isadmin){
      const baseUrl = environment.payroll;
      const payrollURL = new URL(baseUrl);
      const params = payrollURL.searchParams;
      params.append('STOKEN',this.authToken);
      window.open(payrollURL.href);
      console.log(payrollURL.toString());
    }else{
      this.messageService.add({severity:'warn',summary:'Access Denied!'});
    }
  }

   /** 
   * @description navigate to payroll function
   * @var baseUrl base payroll url from env
   * @var payrollURL js url object
   * @var params params to append STOKEN
   * @global window
   */
  navigateToHRMSReports(){
      const baseUrl = environment.payroll + '/reports';
      const payrollURL = new URL(baseUrl);
      const params = payrollURL.searchParams;
      params.append('STOKEN',this.authToken)
      window.open(payrollURL.href);
      console.log(payrollURL.toString());
  }

  isOperatorOrNot() {
    if (this.apprentice_type === "OPERATOR") {
      this.isOperator = true;
    } else {
      this.isOperator = false;
    }
  }

  isCLOrNot() {
    if (this.apprentice_type === "CL") {
      this.isCL = true;
      // sessionStorage.setItem('isCL', 'true')
    } else {
      this.isCL = false;
      // sessionStorage.setItem('isCL', 'false')
    }
  }

  getHr() {
    this.service.getHr(this.username).subscribe({
      next: (response) => {
        console.log(response);
        this.ishrappr = response;
        /** setting plant & company code from api response */
        this.companyCode = this.ishrappr[0]?.company_code;
        this.plantCode = this.ishrappr[0]?.plant_code;
        sessionStorage.setItem("all", JSON.stringify(this.ishrappr[0]));
        /** company code & name session storage */
        sessionStorage.setItem('companyCode', JSON.stringify(this.ishrappr[0]?.company_code));
        sessionStorage.setItem('companyName', JSON.stringify(this.ishrappr[0]?.company_name));
        sessionStorage.setItem("ishr", this.ishrappr[0]?.Is_HR);
        sessionStorage.setItem("ishrappr", this.ishrappr[0]?.Is_HRAppr);
        sessionStorage.setItem("istrainer", this.ishrappr[0]?.Is_Trainer);
        sessionStorage.setItem("issupervisor", this.ishrappr[0]?.Is_Supervisor);
        sessionStorage.setItem(
          "access_master",
          this.ishrappr[0]?.access_master
        );
        sessionStorage.setItem("is_fh", this.ishrappr[0]?.ot_appr);

        if (this.username.user == "emp") {
          sessionStorage.setItem("istrainee", this.ishrappr[0]?.is_trainee);
        } else {
          sessionStorage.setItem("istrainee", "true");
        }
        sessionStorage.setItem("isadmin", this.ishrappr[0]?.is_admin);
        sessionStorage.setItem("istou", this.ishrappr[0]?.Is_TOU);
        sessionStorage.setItem("plantcode", this.ishrappr[0]?.plant_code);
        sessionStorage.setItem("Is_CHR", this.ishrappr[0]?.Is_CHR);

        if (this.username.user == "emp")
          sessionStorage.setItem("emp_name", this.ishrappr[0]?.Emp_Name);
        else sessionStorage.setItem("emp_name", this.ishrappr[0]?.fullname);
        sessionStorage.setItem("plantcode", this.ishrappr[0]?.plant_code);

        sessionStorage.setItem("dept_name", this.ishrappr[0]?.dept_name);
        sessionStorage.setItem("plant_name", this.ishrappr[0]?.plant_name);
        sessionStorage.setItem("emp_id", this.ishrappr[0]?.empl_slno);
        sessionStorage.setItem("dept_slno", this.ishrappr[0]?.Department);
        this.getitems();
      },
      error: (error) => this.messageService.add({severity:'error',summary:error.message}),
    });
  }

  getitems() {
    const item = sessionStorage?.getItem("all");
    if (item !== null) {
      this.all = JSON.parse(item);
    }
    this.isRA = this.all.Is_ReportingAuth;
    this.isOtAppr = this.all["ot_appr"];
    this.isFin = this.all["is_fin"];
    // console.log(this.all['is_fin']);
    this.plant = sessionStorage.getItem("plantcode");
    this.isCmed = this.all.is_cmed;
    this.isPlantHead = this.all.is_plant_head;
    this.isFh = this.all.ot_appr;
    // this.Is_CHR=this.all.Is_CHR

    this.ishr = sessionStorage.getItem("ishr");
    this.ishrappr = sessionStorage.getItem("ishrappr");
    this.istrainer = sessionStorage.getItem("istrainer");
    this.istrainee = sessionStorage.getItem("istrainee");
    this.access_master = sessionStorage.getItem("access_master");
    this.showid = sessionStorage.getItem("user_name");
    this.showname = sessionStorage.getItem("emp_name");
    this.showdept = sessionStorage.getItem("dept_name");
    this.showplant = sessionStorage.getItem("plant_name");
    this.isadmin = sessionStorage.getItem("isadmin");
    this.apprentice_type = sessionStorage.getItem("apprentice_type");
    this.istou = sessionStorage.getItem("istou");
    this.issupervisor = sessionStorage.getItem("issupervisor");
    this.Is_CHR = sessionStorage.getItem("Is_CHR");

    if (sessionStorage.getItem("istrainee")) {
      this.genid = sessionStorage.getItem("gen_id");
    }
    this.isOperatorOrNot();
    this.isCLOrNot();
  }

  /**
   * generate Home page Image
   * @property {*} homepageImgIndex random value
   * @property {*} homepageImgURL random image URL
   * @property {*} homePageImg array of image URL
   * @return {*}
   */
  generateImage():void{
    this.homepageImgIndex = Math.floor(Math.random() * this.homePageImg.length);
    this.homepageImgURL = this.homePageImg[this.homepageImgIndex]
    console.log('HOME PAGE IMG', this.homePageImg[this.homepageImgIndex])
  }

  navigateToHome(){
    this.router.navigate(['../rhrm']);
  }

  navigateToARS(event: Event) {
  event.preventDefault(); // This stops the browser from opening a new window
  this.router.navigate(['/rhrm/ars-dump']);
}
}

