import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import * as XLSX from'xlsx';
import * as moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import { ToastComponent } from '../toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
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
  userEmpcode:string |null = sessionStorage.getItem('user_name');

  constructor(private fb: UntypedFormBuilder,private api:ClamAPIService
    , private dialog: MatDialog,) {
    this.empForm = this.fb.group({
      plant: [this.plant_Code],
      activeState: [''],
      AplnStatus: [''],
      category: [''],
    });
   }

  ngOnInit(): void {
    this.api.getPlantForEmpRep().subscribe((res: any) => {
      this.plantlist = res;
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
      this.emplist =res

      // console.log(this.emplist.length)
      if(this.emplist.length == 0)
{
  this.openAlertDialog('Data not Found','error')
}  else{
  this.exportExcel(res)
}

    },(error)=>{
      console.log(error)
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
  
      }



  
    
  }


