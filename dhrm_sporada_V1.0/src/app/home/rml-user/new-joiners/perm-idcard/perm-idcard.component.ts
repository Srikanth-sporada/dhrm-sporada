import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { UntypedFormBuilder } from "@angular/forms";
import { environment } from "src/environments/environment.prod";
import { ApiService } from "src/app/home/api.service";
import { MessageService } from "primeng/api";
import moment from 'moment'

@Component({
  selector: "app-perm-idcard",
  templateUrl: "./perm-idcard.component.html",
  styleUrls: ["./perm-idcard.component.css"],
})
export class PermIdcardComponent implements OnInit {
  uniqueId: any = { mobile: "" };
  status: any = { status: "" };
  apln_no: any = { apln_no: "" };
  formvalues: any;
  address: any = "hello";
  form: any;
  url: any = environment.path;
  url2: any = this.url;
  fromdate: any;
  frommdate: any;
  toodate: any;
  todate: any;
  plant: any;
  traineeSign:any;
  cat: any;
  validdate: any;
  plantName:string;
  // todate = this.fromdate.setDate(this.fromdate.getDate() + 10)

  constructor(
    private active: ActivatedRoute,
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private service: ApiService,
    private messageService:MessageService
  ) {
    this.form = fb.group({
      permanent: [],
      company_address: [],
    });
  }

  ngOnInit(): void {
    // this.getDataForID();
    this.getTraineeData();

    if (this.formvalues) {
      setTimeout(() => {
        this.printing();
      }, 1000);
    }
  }

  /** ID card print function
   * while print hiding prin btn using print events
   */
  printing() {
    window.addEventListener('beforeprint', (event) => {
    // Code to run before the print dialog opens
    console.log('Document is about to be printed.');

    // Example: Temporarily hide certain elements using JavaScript
    const elementsToHide = document.querySelectorAll('.btn');
    elementsToHide.forEach((el:any) => el.style.display = 'none');
    });
  
    window.addEventListener('afterprint', (event) => {
        // Code to run after the print dialog is closed
        console.log('Document printing is complete or cancelled.');

        // Example: Revert the visibility of elements
        const elementsToHide = document.querySelectorAll('.btn');
        // Or their original display value
        elementsToHide.forEach((el:any) => el.style.display = 'block'); 
    });
    window.print();
    // window.close();
  }

  getDataForID() {
    this.uniqueId.trainee_apln = this.active.snapshot.paramMap.get("trainee_apln");
    this.uniqueId.apln_slno = this.active.snapshot.paramMap.get("apln_slno");
    this.uniqueId.status = this.active.snapshot.paramMap.get("status");
    console.log(this.status);

    this.service.getDataForPermId(this.uniqueId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.formvalues = response;
        this.getDate()
        this.plant = this.formvalues[0].plant_sign;
         this.plantName = response[0].plant_name
        this.form.controls["permanent"].setValue(this.formvalues[0]?.permanent_address);
        this.form.controls["company_address"].setValue(this.formvalues[0]?.addr);
        /** trainee signature */
        this.url = this.url + "/uploads/" + this.formvalues[0]?.other_files6; // trainee photo
        this.plant = environment.path + "/plant/" + this.formvalues[0]?.plant_sign; // plant sign
        this.traineeSign = environment.path + '/uploads/' + this.formvalues[0]?.other_files7; // trainee signature
        console.log("url", this.plant, this.url);
      },
      error: (error) => console.log(error),
    });
  }
  getDate(){
    this.cat = this.active.snapshot.paramMap.get('cat')
    this.service.getValidDate({cat: this.cat})
    .subscribe(
        (data:any)=>
        {
          this.fromdate = this.formvalues[0].doj;
          this.validdate = data[0].sap_p2; 
          const fromDate = moment(this.fromdate);
          const toDate = fromDate.clone().add(this.validdate,'months');
          this.todate = toDate;
          console.log(this.validdate,this.fromdate,this.todate);
        }
    )
  }
  formatDate(date: any) {
    return date.split("-").revers().join("-");
  }

  /** get trainee data for permanent ID card 
   * @property uniqueId has trainee data from router params
  */
  getTraineeData(){
    this.uniqueId.trainee_apln = this.active.snapshot.paramMap.get("trainee_apln");
    this.uniqueId.apln_slno = this.active.snapshot.paramMap.get("apln_slno");
    this.uniqueId.status = this.active.snapshot.paramMap.get("status");
    console.log(this.status);

    this.service.getTraineeDataForIdCard(this.uniqueId.apln_slno).subscribe({
      next: (response: any) => {
        console.log(response);
        this.formvalues = response;
        this.getDate()
        this.plant = this.formvalues[0].plant_sign;
         this.plantName = response[0].plant_name
        this.form.controls["permanent"].setValue(this.formvalues[0]?.permanent_address);
        this.form.controls["company_address"].setValue(this.formvalues[0]?.addr);
        /** trainee signature */
        this.url = this.url + "/uploads/" + this.formvalues[0]?.other_files6; // trainee photo
        this.plant = environment.path + "/plant/" + this.formvalues[0]?.plant_sign; // plant sign
        this.traineeSign = environment.path + '/uploads/' + this.formvalues[0]?.other_files7; // trainee signature
        console.log("url", this.plant, this.url);
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({severity:'error',summary:error.message})
      },
    });
  }
}
