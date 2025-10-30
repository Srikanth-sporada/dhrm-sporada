import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';
import moment from 'moment';
import { ClamAPIService } from '../clam-api.service';
import {LoaderserviceService} from '../../loaderservice.service'
import { ToastComponent } from '../toast/toast.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from "xlsx-js-style";
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';

@Component({
  selector: 'app-indirect-head-count-master',
  templateUrl: './indirect-head-count-master.component.html',
  styleUrls: ['./indirect-head-count-master.component.css']
})
export class IndirectHeadCountMasterComponent implements OnInit {
  HC_Form:any
  selectedPlant: string = '';
  updt_HeadCount: string = '';
  selectedDept: string = '';
  selectedDH_Id: string = '';
  selectedData:any
  showHCForm=false
  editHCForm=false
  showAdd=true ;
  plantname:any
  dept_data:any
  isadmin:string |null= sessionStorage.getItem('isadmin')
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  hc_data:any
  Role_data:any
  // Speed Dial items
    items: MenuItem[] = [
              {
                  icon: 'pi pi-plus-circle',
                  tooltipOptions:{
                    tooltipLabel: 'Add Head Count',
                  },
                  command: () => {
                      this.showForm()
                  }
              },
              {
                icon: 'pi pi-download',
                tooltipOptions:{
                  tooltipLabel: 'Download',
                },
                command: () => {
                  this.exportExcel();
                  this.messageService.add({ severity: 'info', summary: 'Data Converted.' });
                }
              }
    ];
  constructor(private fb: FormBuilder,private api : ClamAPIService,private modalService: NgbModal,private dialog: MatDialog,private service : ApiService,public loader: LoaderserviceService,private messageService:MessageService,private confirmationService:ConfirmationService) {
      this.HC_Form = this.fb.group({
        plant: ['', Validators.required],
        dept_id: ['', Validators.required],
        roles: this.fb.array([]) // Dynamically generated table rows
      });
     }

  ngOnInit(): void {
    // this.initializeForm();
    this.getplantcode();
    this.getRoleData();
    this.get_Indirect_HC();
  }



  initializeForm() {
    this.HC_Form = this.fb.group({
      plant: ['', Validators.required],
      dept_id: ['', Validators.required],
      roles: this.fb.array([]) // Dynamically generated table rows
    });
  }

  get rolesFormArray(): FormArray {
    return this.HC_Form.get('roles') as FormArray;
  }


  reset(){
    this.HC_Form.reset()
  }

  showForm(){
    this.showHCForm=true
  }

  hideForm(){
    // this.reset()
    this.showHCForm = false
    this.showAdd=true;
  }

  /** get plant data api call */
  getplantcode(){
    var company = {'company_name': sessionStorage.getItem('companyList.companycode')}
    this.service.plantcodelist(company)
    .subscribe({
      next: (response) =>{
        this.plantname = response;
        if(this.isadmin == 'true'){
          this.plantname = response;
          this.plantname.push({plant_name:'All',plant_code:''})
        }else{
          this.plantname = this.plantname.filter( (data:any) => data.plant_code === this.plant_Code)
        }
      
       console.log(this.plantname)
       },
      error: (error) => console.log(error),
    });
  }

  onPlantChange(event: any) {
    this.selectedPlant = event.value;
    this.HC_Form.get('dept_id')?.reset(); // Reset department selection
    this.HC_Form.get('roles')?.reset(); // Reset roles selection
    this.rolesFormArray.clear(); 
    this.getdept_data();
}

/** get department data api call */
getdept_data(){
  this.api.getDepList(this.selectedPlant).subscribe({
    next: (resp: any) => {
      console.log(resp);
      
      this.dept_data = resp;
      this.dept_data.push({dept_name:'ALL'})
    },
    error: (error) => console.log(error)
  });
}


onDeptChange(event: any) {
  const selectedDeptObj = this.dept_data.find((dept:any) => dept.dept_slno === event.value);

  if (selectedDeptObj) {
    this.selectedDH_Id = selectedDeptObj.Dh_id; // Get Dh_id from selected department
    console.log('Selected DH_Id:', this.selectedDH_Id);
  } else {
    this.selectedDH_Id = ''; // Reset if no match found
  }
  this.selectedDept = event.value;
  this.rolesFormArray.clear();
  this.getRoleData();
}

/** get role data api call */ 
getRoleData() {
  this.api.get_Indirect_dtls(this.selectedPlant ,this.selectedDept).subscribe({
    next: (response: any) => {
      console.log(response);
      
      this.Role_data = response
      this.populateRoles(); 
      //.filter((data: any) => data.dept_slno === this.selectedDept);
    },
    error: (error) => console.log(error)
  });
}

/** get indirect head count api call */
get_Indirect_HC() {
  this.api.get_indirect_headCount(this.selectedPlant ,this.isadmin).subscribe({
    next: (response: any) => {
      console.log(response);
      
      this.hc_data = response
      // this.populateRoles(); 
      //.filter((data: any) => data.dept_slno === this.selectedDept);
    },
    error: (error) => console.log(error)
  });
}

populateRoles() {
  this.Role_data.forEach((role:any) => {
    this.rolesFormArray.push(
      this.fb.group({
        Role_Id: [role.Role_Id],
        Role_Name: [role.Role_Name],
        Head_Count: [role.Head_Count || '', [Validators.required, Validators.pattern('^[0-9]*$')]]
      })
    );
  });
}

openAlertDialog(message: string , icon:string): void {
  this.dialog.open(ToastComponent, {
    data: {
      icon: icon,
      message: message,
      confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
      
    }
  });
}

submitForm() {
  // Remove roles where Head_Count is empty
  const filteredRoles = this.HC_Form.value.roles.filter((role:any) => 
    String(role.Head_Count).trim() !== "" // Convert to string before trimming
  );

  // Prepare the final data without empty Head_Count
  const requestData = {
    DH_Id:this.selectedDH_Id,
    plant: this.HC_Form.value.plant,
    dept_id: this.HC_Form.value.dept_id,
    roles: filteredRoles
  };

  // Send the request
  this.api.update_Ind_HC(requestData, this.userEmpcode).subscribe(
    res => {
      this.closeForm();
      this.get_Indirect_HC()
      this.openAlertDialog(`${res}`, 'check');
      this.reset();
    },
    error => {
      if (error.status === 400) {
        console.log(error);
        this.openAlertDialog(`${error.error}`, 'error');
        this.showForm();
      } else {
        this.openAlertDialog('Error in connection', 'error');
        this.showForm();
      }
    }
  );
}

closeForm(){
  this.resetForm()
  this.hideForm()
}

closeForm1(){
 // this.resetForm()
  this.editHCForm=false
  this.selectedData=null
}

resetForm() {
  this.HC_Form.reset();
  this.rolesFormArray.clear();
  this.Role_data = [];
  this.selectedPlant = '';
  this.selectedDept = '';
}

updateHC(){
console.log(this.selectedData);
console.log(this.updt_HeadCount);

this.api.update_Single_HC(this.updt_HeadCount,this.selectedData.HC_Id,this.userEmpcode).subscribe(
  res => {
    this.closeForm1();
    this.get_Indirect_HC()
    this.openAlertDialog(`${res}`, 'check');
this.updt_HeadCount=''
  },
  error => {
    if (error.status === 400) {
      console.log(error);
      this.openAlertDialog(`${error.error}`, 'error');
      
    } else {
      this.openAlertDialog('Error in connection', 'error');
     
    }
  }
);


}

viewHC(data:any){
  console.log(data);
  
  this.editHCForm =true
this.selectedData = data
}

onHeadCountChange(newValue: string) {
  if (this.selectedData && this.selectedData.Head_Count !== newValue) {
    this.selectedData.Head_Count = newValue;
    console.log('Updated head count:', this.selectedData);
    // Here you can call an API to update the server if needed
  }
}

delete_HC(event:Event,data:any){
 console.log('delete', data);
  this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteHeadCountAPICall(data)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
}

deleteHeadCountAPICall(data:any){
 this.api.delete_Single_HC(data.HC_Id,this.userEmpcode).subscribe(
  res => {
    this.get_Indirect_HC()
    this.messageService.add({severity:'info',summary:`${res}`})
    // this.openAlertDialog(`${res}`, 'check');
  },
  error => {
    if (error.status === 400) {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.error})
      // this.openAlertDialog(`${error.error}`, 'error');
      
    } else {
      this.messageService.add({severity:'error',summary:'Error In Connection!'})
      // this.openAlertDialog('Error in connection', 'error');
    }
  }
);
}
exportExcel(){
    const transformedArray: any = this.hc_data.map((obj: any) => {
      const { dept_slno, HC_Id,Role_Id , ...filteredObj } = obj; // Exclude fields
      const transformedObj: any = {};
  
      Object.keys(filteredObj).forEach(key => {
        const newKey = key.replace(/_/g, ' '); // Replace underscores with spaces
        transformedObj[newKey] = filteredObj[key];
      });
  
      return transformedObj;
    });
  
    var ws = XLSX.utils.json_to_sheet(transformedArray);
  
    // Apply yellow background and border styles to headers
    const headerRange = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        fill: { fgColor: { rgb: "FFFF00" } }, // Yellow color
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
  
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Head master list");
    XLSX.writeFile(wb, "Indirect_Headcount.xlsx");

}
  
}
