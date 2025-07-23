import { Component, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApiService } from "src/app/home/api.service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { NgFor, AsyncPipe } from "@angular/common";
import { AnyNsRecord } from "dns";
import { MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: "app-otappr-add",
  templateUrl: "./otappr-add.component.html",
  styleUrls: ["./otappr-add.component.css"],
})
export class OtapprAddComponent implements OnInit {
  mappingList: any[];
  plantList: any[];
  plant: any;
  genid: any;
  isadmin: any;
  otApprovers: any;
  headHr: any;

  selectedOtAppr:any
  selectedHr:any
  // isvalid:any
  // user:any;
  emp = new FormControl("");
  filteredEmp: Observable<any[]>;

  constructor(private api: ApiService,private matDailog:MatDialogRef<OtapprAddComponent>) {}

  ngOnInit() {
    this.api.getplantcode(sessionStorage.getItem("plantcode")).subscribe({
      next: (response: any) => {
        this.plantList = response;
      },
      error: (error) => console.log(error),
    });
    this.plant = sessionStorage.getItem("plantcode");
    this.isadmin = sessionStorage.getItem("isadmin") == "true" ? true : false;
    
    this.loadData()
    this.filteredEmp = this.emp.valueChanges.pipe(
      startWith(""),
      map((empl) => (empl ? this._filterEmp(empl) : this.mappingList.slice()))
    );
  }

  private _filterEmp(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.mappingList.filter(
      (empl) =>
        empl.Emp_Name.toLowerCase().includes(filterValue) ||
        empl.gen_id.toLowerCase().includes(filterValue)
    );
  }

  getmappingemployee() {
    this.api.getEmplListForMapping(this.plant).subscribe((response: any) => {
      console.log(response);
      if (response.status == "success") {
        this.mappingList = response.data;
        this.filteredEmp = this.emp.valueChanges.pipe(
          startWith(""),
          map((empl) =>
            empl ? this._filterEmp(empl) : this.mappingList.slice()
          )
        );
      }
    });
  }

  getFHListForMapping() {
    this.api.getFHListForMapping(this.plant).subscribe((response: any) => {
      console.log(response);
      if (response.status == "success") {
        this.otApprovers = response.data;
      } else {
        alert(response.message);
      }
    });
  }

  gethrApprList() {
    this.api.gethrApprList(this.plant).subscribe((response: any) => {
      console.log(response);
      if (response.status == "success") {
        this.headHr = response.data;
      } else {
        alert(response.message);
      }
    });
  }

  loadData(){
    this.getmappingemployee();
    this.getFHListForMapping();
    this.gethrApprList()
  }
 
  close(){
    this.matDailog.close()
  }

  submit(){
   
    let empl_details=this.mappingList.filter((item:any)=>{
      return this.emp.getRawValue()==item.Emp_Name
    })
    console.log(empl_details[0].empl_slno,this.selectedOtAppr,this.selectedHr)
    let data={
      exec:empl_details[0].empl_slno,
      fh:this.selectedOtAppr,
      hr:this.selectedHr,
      plant:this.plant,
      id:sessionStorage.getItem('user_name')
    }
    this.api.addOtMapping(data).subscribe((response:any)=>{
      if(response.status='success'){
        alert(response.message)
        this.matDailog.close()
      }else{
        alert(response.message)
      }
    })
  }
  // checkGenId(){
  //   if(this.genid.length==5){
  //     this.api.getDetailsbyGebId(this.genid,this.plant).subscribe((response:any)=>{
  //       console.log(response.data)
  //       this.user=response.data
  //     })
  //   }
  //   let ismappingNotdone=this.mappingList.filter((element:any)=>{
  //     return element.empl_slno==this.user.empl_slno
  //   })
  //   console.log(ismappingNotdone)
  // }
}
