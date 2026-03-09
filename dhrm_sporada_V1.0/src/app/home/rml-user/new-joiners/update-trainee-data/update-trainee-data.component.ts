import { Component, OnInit,ViewChild,ElementRef,AfterViewInit,Renderer2 } from "@angular/core";
import { environment } from "src/environments/environment.prod";
import * as XLSX from "xlsx";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { MessageService } from "primeng/api";
import { ApiService } from "src/app/home/api.service";
import { ConfirmationComponent } from "src/app/confirmation/confirmation.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Utility } from "src/app/utils/utils";
@Component({
  selector: "app-update-trainee-data",
  templateUrl: "./update-trainee-data.component.html",
  styleUrls: ["./update-trainee-data.component.css"],
})
export class UpdateTraineeDataComponent implements OnInit,AfterViewInit {
  userDetails: any;
  all: any;
  url = environment.path + "/";
  file: any;
  traineeUpdateDataBulk: any = [];
  hasGenID: boolean = false;
  isFileLoaded:boolean = false;
  headerHeight:any;
  actionHeight:any;
  heightForTable:any;
  /** action & header element */
   @ViewChild('headerDiv',) headerRef: ElementRef;
   @ViewChild('actionDiv',) actionDivRef: ElementRef;
  constructor(
    private messageService:MessageService,
    public loader:LoaderserviceService,
    private apiService:ApiService,
    private modalService:NgbModal,
    private utils:Utility,
    private renderer: Renderer2
  ) {}

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
  }

 ngAfterViewInit():void{
    this.headerHeight = this.headerRef.nativeElement.getBoundingClientRect().height;
    this.actionHeight = this.actionDivRef.nativeElement.getBoundingClientRect().height;
    this.heightForTable = this.actionHeight + this.headerHeight;
 }

  /** 
   * handl file upload
   * @param event
   */
  fileUpload(event: any) {
    /** remove already selected file */
    console.log("FILE:",event.target.files[0]);
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    /** on load event */
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      // console.log('BINARY DATA:',binaryData)
      let workbook = XLSX.read(binaryData, { type: "binary" });
      console.log("WB:", workbook);
      let sheetname = workbook.SheetNames[0];
      console.log("SN:", sheetname);
      this.traineeUpdateDataBulk = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetname],
        {
          blankrows: false,
        },
      );
      /** on error event */
      fileReader.onerror = (error:any) => {
        console.log('ERROR:',error);
        this.isFileLoaded = false;
        this.messageService.add({severity:'error',summary:'Error while loading file!'})
      }
      /** loaded end event */
       fileReader.onloadend = ({loaded,total}) => {
        if(loaded == total){
          this.isFileLoaded = true;
        }else{
          this.messageService.add({severity:'error',summary:'Oops! something went wrong.'});
          this.isFileLoaded = false;
        }
       }
      /** check sheet has gen id */
      this.checkSheetHasGenID();
      if(!this.hasGenID){
        this.messageService.add({severity:'warn',summary:'Please Fill Gen ID'})
        this.traineeUpdateDataBulk = [];
        this.file = null;
        this.hasGenID = false;
      }
      console.log("Update Data:", this.traineeUpdateDataBulk);
    };
  }

  /** 
   * check gen col has value to update data
   */
  checkSheetHasGenID() {
    /** check sheet data has gen id prop */
    this.hasGenID = this.traineeUpdateDataBulk.every((traineeData:any) => traineeData.hasOwnProperty('gen_id'))
    console.log('HAS GEN ID:',this.hasGenID);
   }

  /** 
   * update trainee data bulk API
   * @property {boolean} isFileLoaded
   * @property {*} traineeUpdateDataBulk
   */
  updateTraineeDataBulk(){
    if(this.isFileLoaded){
      this.apiService.updateTraineDataBulk(this.traineeUpdateDataBulk).subscribe({
      next: (response:any) => {
        console.log('RESPONSE:',response);
        if(response.status){
          this.messageService.add({severity:'info',summary:'updated succesfully'});
        }else{
          this.messageService.add({severity:'error',summary:'Oops! something went wrong'})
        }
        /** open status modal */
        this.openStatusModal(response,this.traineeUpdateDataBulk.length);
      },
      error: (error:any) => {
       console.error('ERROR:',error);
       this.messageService.add({severity:'error',summary:error?.error?.message})
      }
    })
    }else{
      console.log('file not loaded correctly');
      this.messageService.add({severity:'warn',summary:'Oops! something went wrong'})
    }
  }

  /** 
   * reset data
   */
  resetData(){
    this.traineeUpdateDataBulk = [];
        this.file = null;
        this.hasGenID = false;
  }

  /** 
   * open status modal
   * @param apiResponse
   * @param totalDataCount
   */
  openStatusModal(apiResponse:any, totalDataCount:any){
    const confirmModalRef = this.modalService.open(ConfirmationComponent, {centered:true});
    confirmModalRef.componentInstance.confirmFunction = () => this.resetData();
    /** modal text */
    confirmModalRef.componentInstance.confirmText = `${apiResponse?.inserted_count} of ${totalDataCount} SUCCESS and ${apiResponse?.not_inserted_count} of ${totalDataCount} FAILED.`
    console.log('modal opened...');
  }
}
