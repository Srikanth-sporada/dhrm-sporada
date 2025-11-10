import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import * as XLSX from'xlsx';
import moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-emp-two-record',
  templateUrl: './emp-two-record.component.html',
  styleUrls: ['./emp-two-record.component.css']
})
export class EmpTwoRecordComponent implements OnInit {



  empForm: FormGroup
  emplist:any
  plantlist: any = [];
  isadmin:string |null= sessionStorage.getItem('isadmin')
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string | null = sessionStorage.getItem('user_name');
  all:any;
  userDetails:any;
  statusOptions = [
  { label: 'ALL', value: '' },
  { label: 'PENDING', value: 'PENDING' },
  { label: 'SUBMITTED', value: 'SUBMITTED' },
  { label: 'APPOINTED', value: 'APPOINTED' },
  { label: 'DELETED', value: 'Deleted' },
  { label: 'REJECTED', value: 'REJECTED' },
  { label: 'RELIEVED', value: 'RELIEVED' },
  { label: 'APPROVED', value: 'APPROVED' }
];

activityStatusOptions = [
  { label: 'ALL', value: '' },
  { label: 'ACTIVE', value: 'Active' },
  { label: 'INACTIVE', value: 'InActive' }
];

roleOptions = [
  { label: 'ALL', value: '' },
  { label: 'OPERATOR', value: 'OPERATOR' },
  { label: 'CL', value: 'CL' },
  { label: 'TRAINEE', value: 'TRAINEE' }
];


  constructor(private fb: UntypedFormBuilder,private api:ClamAPIService
    , private dialog: MatDialog, private messageService:MessageService) {
    this.empForm = this.fb.group({
      plant: [this.plant_Code],
      activeState: [''],
      AplnStatus: [''],
      category: [''],   
    });
   }

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }

    this.api.getPlantForEmpRep().subscribe((res: any) => {
      this.plantlist = res;
      this.plantlist.unshift({plant_name:'All',plant_code:''});
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })

  }
  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }


  download(){
    console.log(this.empForm.value)
    this.api.getFilteredData(this.empForm.value).subscribe(res => {
      // console.log(res)
      this.emplist = res;
      // console.log(this.emplist.length)
      if(this.emplist.length == 0)
{
  // this.openAlertDialog('Data not Found','error')
  this.messageService.add({severity:'info',summary:'Data Not Found!'})
}  else{
  this.exportExcel(res)
}

    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message})
    })

  }

  exportExcel(data:any) : void{

    const transformedArray:any = data.map((data: any) =>{
      const transformedObj:any = {};
      Object.keys(data).forEach(key => {
        const newKey = key.replace(/_/g, ' '); 
        transformedObj[newKey] = data[key];
      });
      return transformedObj;
    })
      console.log(transformedArray);
      var ws = XLSX.utils.json_to_sheet(transformedArray);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cl_Trainee_Operator_Record");
      XLSX.writeFile(wb,"Employee_Record.xlsx");
      this.messageService.add({severity:'info',summary:'Data Downloaded!'})
      }
  }


