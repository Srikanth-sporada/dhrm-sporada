import { Component, Inject,OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-del-popup',
  templateUrl: './del-popup.component.html',
  styleUrls: ['./del-popup.component.css']
})
export class DelPopupComponent implements OnInit {

  reason: string = '';
  errorMessage: string = '';
  constructor(
    private dialogRef: MatDialogRef<DelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteRecord(): void {
    if (this.reason.trim() === '') {
      this.errorMessage = 'Please provide a reason for deletion.';
      return;
    }

    this.dialogRef.close({ apln_slno: this.data.apln_slno, reason: this.reason });
  }
}
