import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { UntypedFormBuilder } from "@angular/forms";
import * as XLSX from "xlsx";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-rejoin-process',
  templateUrl: './rejoin-process.component.html',
  styleUrls: ['./rejoin-process.component.css']
})
export class RejoinProcessComponent implements OnInit {
  data: any = [];
  plant: any;
  genid: any;
  form: any;
  CatList: any = [];
  selectedCategory: string = '';
  rejoinReason: string = '';
  created: any;
  tableData: any = [];
  ReportData: any = [];
  showActionColumn: boolean = false;
  showEditModal: boolean = false;
  selectedItem: any = null;
  editCategory: string = '';
  editReason: string = '';
  selectedAction: string = '';
  activeIndex:number = 0;
  all:any;
  userDetails:any;
  constructor(
    public loader: LoaderserviceService,
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private messageService:MessageService,
  ) {
    this.form = this.fb.group({
      plantcode: [sessionStorage.getItem('plantcode')],
      genid: ['']
    })
  }

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.plant = sessionStorage.getItem('plantcode');
    this.created = sessionStorage.getItem('emp_id');

    this.initialLoad();

    this.service.GetCategory().subscribe({
      next: (resp: any) => {
        console.log('cate resp', resp);
        this.CatList = resp.data;
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    });
  }

  initialLoad() {
    this.service.GetRejoinTable(this.plant).subscribe({
      next: (res: any) => {
        this.tableData = res.data;
        this.ReportData = res.NotNew;
        this.checkForRejected();
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    })
  }

  getRejectedByName(item: any): string {
  return item.Chr_Approval ? item.Chr_Name : item.Phr_Name;
}

getRejectedComment(item: any): string {
  return item.Chr_Approval ? item.Chr_Comment : item.Phr_Comment;
}

  checkForRejected() {
    this.showActionColumn = this.tableData.some(
      (item:any) => item.Approval_Status?.trim().toUpperCase() === 'REJECTED'
    );
  }

  // gen id search filter
  search() {
    if(this.form.value.genid == ''){
      this.messageService.add({severity:'warn',summary:'Enter Gen ID'});
    }else{
     const formValues = this.form.value;
    this.service.rejoinData(formValues).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.data = res.data;
        if(!res.data.length){
          this.messageService.add({severity:'info',summary:`Gen ID Not Found: ${this.form.value.genid}`})
        }
      },
      error: (err) => this.messageService.add({severity:'error',summary:err.message})
    })
    }
    

  }

  add() {
    // console.log(this.selectedCategory,this.rejoinReason)
    if (this.data.length === 0) {
      this.messageService.add({severity:'warn',summary: 'No Data Available To Submit!'})
      return;
    }

    if (!this.selectedCategory || !this.rejoinReason) {
      this.messageService.add({severity:'warn', summary:'Please select a category and enter a reason.'});
      return;
    }

    const row = this.data[0];

    if (row.rejectionreason === '02' || row.rejectionreason === '03' || row.rejectionreason === '07') {
      this.messageService.add({severity:'info',summary:`Not Eligible For Rejoin Due To ${row.R_Reason} !`})
      return;
    }
    const payload = {
      gen_id: row.gen_id,
      name: row.fullname,
      old_category: row.apprentice_type,
      new_category: this.selectedCategory,
      reason: this.rejoinReason,
      doj: row.doj,
      dol: row.dol,
      service_years: row.ServiceYears,
      plantcode: this.plant,
      apln: row.apln_slno,
      created: this.created,
      aadhar: row.aadhar_no,
      mobile: row.mobile_no1
    };

    console.log('Payload to submit:', payload);

    this.service.AddRejoinTrainee(payload).subscribe({
      next: (response: any) => {
        console.log('response', response);
        this.messageService.add({severity:'info',summary:response.message})
        this.clear()
        this.initialLoad();
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        this.messageService.add({severity:'error',summary:err?.error?.message});
        this.clear()
      }
    });

  }

  onEdit(item: any) {
    this.selectedItem = item;
    this.editCategory = item.New_Category;
    this.editReason = item.Reason_For_Rejoin;
    this.showEditModal = true;
    console.log("Selected Row:", item);
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedItem = null;
    this.editCategory = '';
    this.editReason = '';
    this.selectedAction = '';
  }

  updateRejoin() {
    if (!this.editCategory || !this.editReason) {
      this.messageService.add({severity:'info',summary:'Category and Reason are Required!'})
      // alert('Category and reason are required.');
      return;
    }

    if (!this.selectedAction) {
      this.messageService.add({severity:'info',summary:"Select Action!"})
      // alert('Select Resubmit Or Cancel.');
      return;
    }

    const payload = {
      rejoin_id: this.selectedItem.Rejoin_Id,
      new_category: this.editCategory,
      reason_for_rejoin: this.editReason,
      updated_by: this.created,
      status: this.selectedAction
    };

    this.service.UpdateSingleRejoin(payload).subscribe({
      next: (res: any) => {
        // alert(res.message);
        this.messageService.add({severity:'info',summary:res.message})
        this.closeEditModal();
        this.initialLoad();
      },
      error: (err) => {
        this.messageService.add({severity:'error',summary:err.message})
        // alert(err?.error?.message || 'Update failed');
        this.closeEditModal();
      }
    });
  }

  submit() {
    // Filter out rejected rows
    const filteredData = this.tableData.filter(
      (item:any)=> item.Approval_Status?.trim().toUpperCase() !== 'REJECTED'
    );

    if (filteredData.length === 0) {
      this.messageService.add({severity:'info',summary: 'No valid Rows to submit (Non-Rejected).'})
      return;
    }

    const upload = {
      data: filteredData,
      createdAt: this.created
    };

    this.service.UpdateRejoinTrainee(upload).subscribe({
      next: (res: any) => {
        console.log('response to update', res);
        this.messageService.add({severity:'info',summary:res.message})
        this.initialLoad();
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        this.messageService.add({severity:'error',summary: err?.error?.message || 'Submission failed'})
        // alert(err?.error?.message || 'Submission failed');
        this.initialLoad();
      }
    });
  }


  clear() {
    this.form.reset({
      plantcode: sessionStorage.getItem('plantcode'),
      genid: ''
    });

    this.data = [];
    this.selectedCategory = '';
    this.rejoinReason = '';
  }

  exportexcel() {
    const table = document.querySelector("#table") as HTMLTableElement;
    if (!table) {
      console.error("Table element not found.");
      this.messageService.add({severity:'warn',summary:'Table Element Not Found!'})
      return;
    }
  
    const rows = Array.from(table.rows); 
  
    const headerCells = Array.from(rows[0].cells);
    const skipIndexes: number[] = [];
  
    headerCells.forEach((cell, index) => {
      const text = cell.textContent?.trim();
      if ( text === "Action") {
        skipIndexes.push(index);
      }
    });
 
    const data = rows.map(row =>
      Array.from(row.cells)
        .filter((_, idx) => !skipIndexes.includes(idx))
        .map(cell => cell.textContent?.trim() || "")
    );
  
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rejoin Request");
    XLSX.writeFile(wb, "Rejoin Request.xlsx");
    this.messageService.add({severity:'info',summary:'Data Exported!'})
  }
}
