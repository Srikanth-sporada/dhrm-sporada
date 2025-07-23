import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-reason',
  templateUrl: './confirm-dialog-reason.component.html',
})
export class ConfirmDialogReasonComponent {
  icon: string = '';
  reason: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirmClick(result: boolean): void {
    this.dialogRef.close({ result, reason: this.reason });

  }



  isReasonValid(): boolean {
    return this.reason.trim() !== '' && this.reason.length > 7;
  }
}
