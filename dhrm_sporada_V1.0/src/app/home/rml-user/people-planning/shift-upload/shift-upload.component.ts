import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as _moment from "moment";
import * as XLSX from 'xlsx';
import { ApiService } from "src/app/home/api.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";


@Component({
  selector: 'app-shift-upload',
  templateUrl: './shift-upload.component.html',
  styleUrls: ['./shift-upload.component.css']
})
export class ShiftUploadComponent implements OnInit {

  plant: any;
  file: any;
  gen: any;
  all:any;
  userDetails:any;
  @ViewChild('fileInput') fileInput!: ElementRef;  // added reference to file input

  constructor(private apiService: ApiService, private router: Router, private messageService:MessageService) { }

  ngOnInit(): void {
     let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.plant = sessionStorage.getItem('plantcode');
    this.gen = sessionStorage.getItem('user_name');
  }

  download() {
    if (this.plant) {
      this.apiService.shift_template(this.plant).subscribe((res: any) => {
        console.log('response', res.data);

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res.data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Shift Template': worksheet },
          SheetNames: ['Shift Template']
        };
        XLSX.writeFile(workbook, 'ShiftTemplate.xlsx');
        this.messageService.add({severity:'info',summary:'Shift Template Downloaded!'})
      }, (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      });
    }
  }

  onFileChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
    } else {
      this.file = null;
    }
  }

  upload() {
    if (!this.file) {
      // alert("Please Select File Before Uploading");
      this.messageService.add({severity:'warn',summary:'Please Select File Befor Uploading!'})
    } else {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('gen', this.gen);
      console.log('gen id',sessionStorage.getItem('user_name'))

      this.apiService.shift_upload(formData).subscribe(
        (res: any) => {
          console.log('File uploaded successfully', res);
          // alert("File uploaded successfully");
          this.messageService.add({severity:'info',summary:'File Uploaded Sucessfully'})
          this.clearFileInput();
        },
        (err) => {
          console.error('Upload error', err);
          if (err.error && err.error.message) {
            // alert(err.error.message);
            this.messageService.add({severity:'warn',summary:err.error.message})
          } else {
            // alert("Something went wrong");
            this.messageService.add({severity:'error',summary:err.messages})
          }
          this.clearFileInput();
        }
      );
    }
  }

  clearFileInput() {
    this.file = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
