import { Component, OnInit , ChangeDetectionStrategy } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { environment } from "src/environments/environment.prod";
import { MessageService } from "primeng/api";
import { LoaderserviceService } from "src/app/loaderservice.service";

@Component({
  selector: "app-skill-view",
  templateUrl: "./skill-view.component.html",
  styleUrls: ["./skill-view.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillViewComponent implements OnInit {
  genid: any;
  skillData: any;
  oprnData: any;
  showskillMatrix: boolean = false;
  showOprationData: boolean = false;
  userData: any;
  oprnsList: any;
  oprnId: any = "";
  plantSkill: any;
  fileDetails: any;
  url: any = environment.path;
  all: any;
  userDetails: any;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    public loader:LoaderserviceService,
  ) {}

  ngOnInit() {
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
    /** get operations */
    this.getOperationList();
    /** get plant skill */
    this.getPlantSkill();
  }

  /** 
   * get skill details
   * @property {*} skillData
   * @property {*} userData
   * @property {*} fileDetails
   * @property {*} showSkillMatrix
   */
  getSkilldetails() {
    this.apiService.getoperationsByGenid(this.genid).subscribe({
      next: (response: any) => {
        if (response.status == "success") {
          this.skillData = response.skill;
          this.userData = response.userData;
          this.fileDetails = response.filedetails;
          console.log(this.fileDetails);
          this.showskillMatrix = true;
        } else {
          this.showskillMatrix = false;
          // alert(response.message);
          this.messageService.add({
            severity: "info",
            summary: response.message,
          });
        }
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }
  /** 
     * get operations
     * @property {*} oprnsList
     *  */
    getOperationList() {this.apiService.getOperationList().subscribe({
      next: (response: any) => {
      if (response.status == "success") {
        console.log('OPERTAIONS:',response.data);
        this.oprnsList = response.data;
      }
    },
    error: (error:any) => {
       console.error('ERROR:',error);
       this.messageService.add({severity:'error',summary:error?.error?.message});
    }
    });
    }
     /** 
     * get plant skill
     * @property {*} plantSkill
     *  */
    getPlantSkill(){this.apiService.getPlantskill().subscribe({
        next:  (response: any) => {
          if (response.status == "success") {
            this.plantSkill = response.skill;
            console.log('PLANT SKILL:',this.plantSkill);
          } else {
            // alert(response.message);
            this.messageService.add({severity: "info",summary: response.message});
          }
        },
        error: (error) => {
          console.error('ERROR:',error);
          this.messageService.add({ severity: "error", summary: error.message });
        },
      });
    }

    getUrl(file_name: any) {
      return this.url + "/skill_dev/" + file_name;
    }

  /**
   * get operation data
   * @property {*} getOprationData
   * @property {*} showOprationData
   */
  getOprationData() {
    if (this.oprnId == "") {
      return this.messageService.add({
        severity: "warn",
        summary: "Select Operation",
      });
    }
    this.apiService.getoperationsByOperation(this.oprnId).subscribe({
      next: (response: any) => {
        if (response.status == "success") {
          this.oprnData = response.skill;
          this.showOprationData = true;
        } else {
          this.showOprationData = false;
          this.messageService.add({
            severity: "info",
            summary: response.message,
          });
        }
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  /** convert number to string */
  convertToString(number:any){
    if(!number){
      return '0'
    }else{
    return String(number);
      
    }
  }
}
