import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-request-details-dialog',
  templateUrl: './request-details-dialog.component.html',
  styleUrls: ['./request-details-dialog.component.css']
})
export class RequestDetailsDialogComponent {
  dataSource: MatTableDataSource<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource = new MatTableDataSource(this.data.details);
  }

  getRequestTotalEarnings(): number {
    return this.data.details.reduce((sum, item) => 
      item.Type === 'Earning' ? sum + item.Amount : sum, 0);
  }

  getRequestTotalDeductions(): number {
    return this.data.details.reduce((sum, item) => 
      item.Type === 'Deduction' ? sum + item.Amount : sum, 0);
  }
}