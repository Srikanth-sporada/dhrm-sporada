import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { environment } from "src/environments/environment.prod";
import * as XLSX from "xlsx";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
const material = [MatSidenav, MatTableModule];

@Component({
  selector: "app-bank",
  templateUrl: "./bank.component.html",
  styleUrls: ["./bank.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class BankComponent implements OnInit {
  closeResult: string;
  form: any;
  sample: any = environment.path;
  dummy: any = [];
  editing_flag: any;
  temp_a: any;
  bankData: any = [];
  userInput:string = '';
  // material modal template ref
  @ViewChild("content", { read: TemplateRef }) addShiftTemplateRef:
    | TemplateRef<unknown>
    | undefined;
  // Speed Dial items
  items: MenuItem[] = [
    {
      icon: "pi pi-plus-circle",
      tooltipOptions: {
        tooltipLabel: "Add Bank",
      },
      command: () => {
        this.open(this.addShiftTemplateRef);
      },
    },
    {
      icon: "pi pi-download",
      tooltipOptions: {
        tooltipLabel: "Download",
      },
      command: () => {
        this.exportexcel();
        this.messageService.add({
          severity: "info",
          summary: "Data Converted.",
        });
      },
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private service: ApiService,
    public loader: LoaderserviceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.form = this.fb.group({
      sno: [""],
      Slno: [""],
      bank_name: ["", Validators.required],
      bank_code: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    /** get bank */
   this.getBank()
  }
 /** get bank data */
 getBank(){
   this.service.getbank().subscribe({
      next: (response) => {
        this.dummy = response;
        this.bankData = response;
      },
      error: (err) => {
        console.error('ERROR:',err);
        this.messageService.add({ severity: "info", summary: err.message });
      }
    });
 }

  open(content: any) {
    this.form.reset();
    this.editing_flag = false;
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  /** add bank API */
  save() {
    this.form.controls["sno"].setValue(this.dummy.length + 1);
    console.log(this.form.value);

    this.service.addbank(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "already") {
          this.messageService.add({
            severity: "warn",
            summary: "Bank Already Exists!",
          });
        } else if (response.message == "inserted") {
          this.dummy.push(this.form.value);
          this.form.reset();
          this.messageService.add({ severity: "info", summary: "Bank Added." });
          this.getBank();
          this.searchBankByName()
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Cannot Add Bank!",
          });
        }
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }

  opentoedit(content: any) {
    console.log("opening");
    this.modalService.open(content, { centered: true });
  }

  edit(slno: any, a: any) {
    this.temp_a = a;
    this.editing_flag = true;
    this.form.controls["Slno"].setValue(this.dummy[a].Slno);
    this.form.controls["bank_name"].setValue(this.dummy[a].bank_name);
    this.form.controls["bank_code"].setValue(this.dummy[a].bank_code);
    console.log(this.form.value);
  }

  // update bank function
  editSave() {
    console.log(this.form.value);
    this.service.updatebank(this.form.value).subscribe({
      next: (response: any) => {
        if (response.message == "updated") {
          console.log(response);
          this.dummy[this.temp_a] = this.form.value;
          this.messageService.add({
            severity: "info",
            summary: "Bank Updated!",
          });
          this.getBank();
          this.searchBankByName()
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Cannot Update Bank!",
          });
        }
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }

  // delete bank function
  deleteBank(event: Event, slno: any, a: any) {
    console.log(slno);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to Delete?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteBankAPICall(slno, a);
      },
      reject: () => {
        this.messageService.add({ severity: "error", summary: "Rejected" });
      },
    });
  }
  // delete bank apicall function
  deleteBankAPICall(slno: any, a: any) {
    console.log(slno);
    this.service.deletebank({ Slno: slno }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.message == "success") {
          this.dummy.splice(a, 1); // remove data from array
          this.bankData.splice(a,1);
          this.messageService.add({
            severity: "info",
            summary: "Bank Deleted!",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Cannot Delete Bank!",
          });
        }
      },
      error: (err) =>
        this.messageService.add({ severity: "error", summary: err.message }),
    });
  }

  exportexcel(): void {
    const newKeys: any = {
      bank_code: "Bank Code",
      bank_name: "Bank Name",
      del_status: "Del Status",
    };

    // Map the array and transform each object
    const transformedArray: any = this.dummy.map((obj: any) => {
      const transformedObj: any = {};
      Object.keys(obj).forEach((key) => {
        const newKey = newKeys[key] || key;
        transformedObj[newKey] = obj[key];
      });
      return transformedObj;
    });
    console.log(transformedArray);

    var ws = XLSX.utils.json_to_sheet(transformedArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "bank_details.xlsx");
  }

  reset() {
    this.form.reset();
  }

  /** search bank filter */
  searchBankByName() {
    const searchTerm = this.userInput.toLowerCase();
    console.log(searchTerm);
    const foundBank = this.bankData.filter((bank: any) => {
      if (bank.bank_name.toLowerCase().includes(searchTerm)) {
        return bank;
      }
    });
    console.log(foundBank);
    if (foundBank.length) {
      this.dummy = foundBank;
    } else {
      this.dummy = this.bankData;
    }
  }
}
