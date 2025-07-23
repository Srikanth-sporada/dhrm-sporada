import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { UntypedFormBuilder } from "@angular/forms";
import * as XLSX from "xlsx";

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



  constructor(
    public loader: LoaderserviceService,
    private service: ApiService,
    private fb: UntypedFormBuilder,
  ) {
    this.form = this.fb.group({
      plantcode: [sessionStorage.getItem('plantcode')],
      genid: ['']
    })
  }

  ngOnInit(): void {
    this.plant = sessionStorage.getItem('plantcode');
    this.created = sessionStorage.getItem('emp_id');

    this.initialLoad();

    this.service.GetCategory().subscribe({
      next: (resp: any) => {
        console.log('cate resp', resp);
        this.CatList = resp.data;
      }
    });
  }

  initialLoad() {
    this.service.GetRejoinTable(this.plant).subscribe({
      next: (res: any) => {
        this.tableData = res.data;
        this.ReportData = res.NotNew;

        this.checkForRejected();
      }
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
      item => item.Approval_Status?.trim().toUpperCase() === 'REJECTED'
    );
  }


  search() {
    if (this.form.value.genid === '') {
      alert('Please Fill In Gen ID');
      return;
    }
    const formValues = this.form.value;
    this.service.rejoinData(formValues).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.data = res.data;
      }
    })

  }

  add() {
    if (this.data.length === 0) {
      alert('No data available to submit.');
      return;
    }

    if (!this.selectedCategory || !this.rejoinReason) {
      alert('Please select a category and enter a reason.');
      return;
    }

    const row = this.data[0];

    if (row.rejectionreason === '02' || row.rejectionreason === '03' || row.rejectionreason === '07') {
      alert(`Not Eligible For Rejoin Due To ${row.R_Reason} !`);
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
        alert(response.message);
        this.clear()

        this.initialLoad();
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        alert(err?.error?.message);
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
      alert('Category and reason are required.');
      return;
    }

    if (!this.selectedAction) {
      alert('Select Resubmit Or Cancel.');
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
        alert(res.message);
        this.closeEditModal();
        this.initialLoad();
      },
      error: (err) => {
        alert(err?.error?.message || 'Update failed');
        this.closeEditModal();
      }
    });
  }




  submit() {
    // Filter out rejected rows
    const filteredData = this.tableData.filter(
      item => item.Approval_Status?.trim().toUpperCase() !== 'REJECTED'
    );

    if (filteredData.length === 0) {
      alert('No valid rows to submit (non-rejected).');
      return;
    }

    const upload = {
      data: filteredData,
      createdAt: this.created
    };

    this.service.UpdateRejoinTrainee(upload).subscribe({
      next: (res: any) => {
        console.log('response to update', res);
        alert(res.message);
        this.initialLoad();
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        alert(err?.error?.message || 'Submission failed');
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
  }


}
