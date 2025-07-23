import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { environment } from "src/environments/environment.prod";
@Component({
  selector: "app-skill-view",
  templateUrl: "./skill-view.component.html",
  styleUrls: ["./skill-view.component.css"],
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
  plantSkill:any;
  fileDetails:any;
  url:any = environment.path;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getOperationList().subscribe((response: any) => {
      if (response.status == "success") {
        this.oprnsList = response.data;
      }
    });
  this.apiService.getPlantskill().subscribe((response: any) => {
    if (response.status == "success") {
      this.plantSkill = response.skill;
      console.log(this.plantSkill)
    } else {
      alert(response.message);
    }
  })
  }

  getSkilldetails() {
    this.apiService
      .getoperationsByGenid(this.genid)
      .subscribe((response: any) => {
        if (response.status == "success") {
          this.skillData = response.skill;
          this.userData = response.userData;
          this.fileDetails=response.filedetails
          console.log(this.fileDetails)
          this.showskillMatrix = true;
        } else {
          this.showskillMatrix = false;
          alert(response.message);
        }
      });
  }
  getUrl(file_name:any){
    return this.url + "/skill_dev/" + file_name;
  }

  getOprationData() {
    if (this.oprnId=='') {
      return alert("please select the Opeartion");
    }
    this.apiService
      .getoperationsByOperation(this.oprnId)
      .subscribe((response: any) => {
        if (response.status == "success") {
          this.oprnData = response.skill;
          this.showOprationData = true;
        } else {
          this.showOprationData = false;
          alert(response.message);
        }
      });
  }
}
