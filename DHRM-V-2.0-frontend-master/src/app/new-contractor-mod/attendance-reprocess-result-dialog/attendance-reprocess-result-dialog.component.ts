import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-attendance-reprocess-result-dialog',
  templateUrl: './attendance-reprocess-result-dialog.component.html',
  styleUrls: ['./attendance-reprocess-result-dialog.component.css']
})
export class AttendanceReprocessResultDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  // Helper method to get the keys of the data object
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}