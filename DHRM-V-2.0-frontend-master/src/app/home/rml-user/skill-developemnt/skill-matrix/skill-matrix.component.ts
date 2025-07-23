import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-skill-matrix',
  templateUrl: './skill-matrix.component.html',
  styleUrls: ['./skill-matrix.component.css']
})
export class SkillMatrixComponent implements OnInit {
  someSubscription: any;
  filterinfo: any = [];
  id: any;
  form: any;
  searchText: any;
  year: Number[] = [];
  dept: any = [];
  options = [
    { label: "0 to 60 days", value: "0-60" },
    { label: "61 to 120 days", value: "61-120" },
    { label: "121 to 180 days", value: "121-180" },
    { label: "181 to 270 days", value: "181-270" },
  ];
  lineNames: any;
  departments: any;
  plant: any;
  fullData: any = [];
  lineOptions: string[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public loader: LoaderserviceService
  ) {
    this.form = this.fb.group({
      status: ['1'],
      plantcode: [sessionStorage.getItem('plantcode')],
      id: ['1'],
      department: [''],  // clearer name than "year"
      line: [''],        // clearer name than "filter"
      gen_id: ['']
    });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 45;
    for (let i = currentYear; i >= oldestYear; i--) {
      this.year.push(i);
    }
    this.plant = sessionStorage.getItem('plantcode');


    this.service.skillmatrix(this.plant).subscribe({
      next: (response) => {
        console.log(response);
        this.filterinfo = response;
        this.fullData = response;
        this.lineOptions = Array.from(new Set(this.filterinfo.map(item => item.Line_Name)));
        this.departments = Array.from(
          new Set(this.filterinfo.map(item => item.dept_name))
        ).filter(i => i);

      },
    });
  }

  filter() {
    const formValues = this.form.value;
    const selectedDept = formValues.department;
    const selectedLine = formValues.line;
    const genId = formValues.gen_id;
  
    // First, filter the full dataset
    let filtered = this.fullData.filter((record) => {
      let isMatch = true;
  
      if (selectedDept && record.dept_name !== selectedDept) {
        isMatch = false;
      }
  
      if (selectedLine && record.Line_Name !== selectedLine) {
        isMatch = false;
      }
  
      if (genId && !record.gen_id?.toLowerCase().includes(genId.toLowerCase())) {
        isMatch = false;
      }
  
      return isMatch;
    });
  
    // Update filtered records for display
    this.filterinfo = filtered;
  
    // 🔁 Regenerate lineNames based on the filtered result
    this.lineNames = Array.from(new Set(filtered.map(item => item.Line_Name)));
  
    console.log('Filtered Records:', this.filterinfo);
    console.log('Updated Line Names:', this.lineNames);
  }
  

  clear() {
    this.form.reset({
      department: '',
      line: '',
      gen_id: ''
    });
  
    // Restore the full list of data
    this.filterinfo = this.fullData;
  
    // Reset the full list of departments and line names
    this.departments = Array.from(
      new Set(this.fullData.map(item => item.dept_name))
    ).filter(i => i);
  
    this.lineNames = Array.from(
      new Set(this.fullData.map(item => item.Line_Name))
    ).filter(i => i);
  }

  // onDepartmentChange() {
  //   const selectedDept = this.form.value.department;
  
  //   // Get line names from fullData where department matches
  //   this.lineOptions = Array.from(
  //     new Set(
  //       this.fullData
  //         .filter(item => item.dept_name === selectedDept)
  //         .map(item => item.Line_Name)
  //     )
  //   );
  
  //   // Reset line selection
  //   this.form.patchValue({ line: '' });
  //   this.filter()
  // }

  onDepartmentChange() {
    const selectedDept = this.form.value.department;
  
    if (!selectedDept) {
      // If no department is selected, show all lines
      this.lineOptions = Array.from(
        new Set(this.fullData.map(item => item.Line_Name))
      );
    } else {
      // If a department is selected, filter lines based on department
      this.lineOptions = Array.from(
        new Set(
          this.fullData
            .filter(item => item.dept_name === selectedDept)
            .map(item => item.Line_Name)
        )
      );
    }
  
    // Reset line selection
    this.form.patchValue({ line: '' });
    this.filter();
  }
  

  onLineChange() {
    this.filter()
  }
  
  
  save() {
    console.log(this.form.value);
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
      if (text === "Offline" || text === "Online") {
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
    XLSX.utils.book_append_sheet(wb, ws, "Skill Matrix");
    XLSX.writeFile(wb, "Skill Matrix.xlsx");
  }
  
  
}
