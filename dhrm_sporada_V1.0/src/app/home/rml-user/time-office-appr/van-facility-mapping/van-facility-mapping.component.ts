import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { ApiService } from "src/app/home/api.service";
import { environment } from "./../../../../../environments/environment.prod";
import { ToastComponent } from "src/app/new-contractor-mod/toast/toast.component";
import { ClamAPIService } from "src/app/new-contractor-mod/clam-api.service";
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from "xlsx-js-style";
import { MessageService, ConfirmationService } from "primeng/api";

@Component({
  selector: "app-van-facility-mapping",
  templateUrl: "./van-facility-mapping.component.html",
  styleUrls: ["./van-facility-mapping.component.css"],
})
export class VanFacilityMappingComponent implements OnInit {
  showAdd: boolean;
  userdtls: any[] = [];
  routelist: any[] = [];
  genid: any;
  pickup: any;
  transport: any;
  route: any;
  viewPayscaleForm = false;
  van_mapList: any[] = [];
  all: any;
  userDetails: any;
  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private OpApi: ClamAPIService,
    private messageService: MessageService,
    private confirmationService:ConfirmationService
  ) {}
  isadmin: any = sessionStorage.getItem("isadmin") == "true" ? true : false;
  userEmpcode: string | null = sessionStorage.getItem("user_name");
  plant: any = sessionStorage.getItem("plantcode");

  ngOnInit(): void {
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
    this.getpermList();
  }

  genIdChange() {
    this.userdtls = [];
  }

  openAlertDialog(message: string, icon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message,
      },
    });
  }

  verify() {
    if (this.genid == "" || this.genid == undefined) {
      // alert("Gen Id cannot be empty");
      this.openAlertDialog("Gen Id cannot be empty", "error");
      this.messageService.add({severity:'warn',summary:'Gen ID cannot be empty'})
      return;
    }
    this.OpApi.mid_Userdetails(this.genid, this.plant).subscribe(
      (res: any) => {
        console.log(res);

        if (res[0].Van_Eligible == true) {
          // this.openAlertDialog("Already Van Facility Mapped", "error");
          this.messageService.add({severity:'warn',summary:'Already Van Facility Mapped'})
        } else {
          this.userdtls = res;
        }
      },
      (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    );
  }

  getroute() {
    this.OpApi.getRoute(this.plant).subscribe(
      (res: any) => {
        // console.log(res);
        this.routelist = res.filter((item: any) => item.Status == "Active");
      },
      (error) => {
        console.log(error);
        // this.openAlertDialog("Data not found", "error");
        this.messageService.add({severity:'error',summary:error.message})
      }
    );
  }

  isSubmitFormValid(): boolean {
    return !!this.route && !!this.transport && !!this.pickup;
  }

  submitVan() {
    const data = {
      route: this.route,
      transport: this.transport,
      pickup: this.pickup,
      gen_id: this.genid,
      applied_by: this.userEmpcode,
      plant: this.plant,
    };

    console.log(data);
    this.OpApi.Van_Facility(data).subscribe(
      (res: any) => {
        // this.openAlertDialog("Van Facility Mapped", "Check");
        this.messageService.add({severity:'info',summary:'Van Facility Mapped.'})
        this.genIdChange();
        this.getpermList();
        this.closeAllForms1();
        this.genid = null;
      },
      (error) => {
        console.log(error);
        // this.openAlertDialog(error.error, "error");
        this.messageService.add({severity:'error',summary:error.error})
      }
    );
  }

  delete(event:Event,data: any) {
    this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteVanMappingApiCall(data)
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            }
        });
    
  }
  // delete api call
  deleteVanMappingApiCall(data:any){
       console.log(data);
    this.OpApi.delete_Van_Facility(data).subscribe(
      (res: any) => {
        this.openAlertDialog("Van Facility Made In-Active", "Check");
        this.genIdChange();
        this.getpermList();
        this.closeAllForms1();
        this.genid = null;
      },
      (error) => {
        console.log(error);
        this.openAlertDialog(error.error, "error");
      }
    );
  }

  getpermList() {
    this.OpApi.get_Van_Details(this.plant).subscribe(
      (res: any) => {
        // console.log(res);
        this.van_mapList = res;
      },
      (error) => {
        console.log(error);
        // this.openAlertDialog("Data not found", "error");
        this.messageService.add({severity:'error',summary:error.message})
      }
    );
  }

  onView(data: any) {
    this.viewPayscaleForm = true;
    this.showAdd = false;
    console.log(data);

    this.route = data.Route_Id;
    this.transport = data.Transporter;
    this.pickup = data.Pickup_Point;
    this.genid = data.Gen_id;
  }

  closeAllForms1() {
    this.viewPayscaleForm = false;

    this.route = null;
    this.transport = null;
    this.pickup = null;
    this.genid = null;
  }

  exportExcel(): void {
    try{
      const transformedArray: any = this.van_mapList.map((obj: any) => {
      const { Route_Id, Van_Eligible, ...filteredObj } = obj; // Exclude fields
      const transformedObj: any = {};

      Object.keys(filteredObj).forEach((key) => {
        const newKey = key.replace(/_/g, " "); // Replace underscores with spaces
        transformedObj[newKey] = filteredObj[key];
      });

      return transformedObj;
    });
    //  console.log(transformedArray);

    var ws = XLSX.utils.json_to_sheet(transformedArray);
    const headerRange = XLSX.utils.decode_range(ws["!ref"]!);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        fill: { fgColor: { rgb: "FFFF00" } }, // Yellow color
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Van Mapping list");
    XLSX.writeFile(wb, "Van mapping list.xlsx");
    this.messageService.add({severity:'info',summary:'Data Exported.'})
    } catch (error:any){
      console.log(error.message);
      this.messageService.add({severity:'warn',summary:'Something went wrong!'})
    }
  }
}
