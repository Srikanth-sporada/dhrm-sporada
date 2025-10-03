import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.css']
})
export class RejectComponent implements OnInit {
  reason:any;
  constructor(private dailogRef:MatDialogRef<RejectComponent>,@Inject(MAT_DIALOG_DATA) private data:any) { }

  ngOnInit() {
  }

  close(){
    this.dailogRef.close()
  }

  submit(){
    this.dailogRef.close(this.reason)
  }

}
