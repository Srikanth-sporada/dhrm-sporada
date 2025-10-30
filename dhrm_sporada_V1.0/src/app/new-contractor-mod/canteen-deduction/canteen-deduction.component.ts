
import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ClamAPIService} from '../clam-api.service'
import {CanteenObj} from './canteen.model'
import moment from 'moment';
import { HttpResponse } from '@angular/common/http';
import * as XLSX from'xlsx'
import {LoaderserviceService} from '../../loaderservice.service'
@Component({
  selector: 'app-canteen-deduction',
  templateUrl: './canteen-deduction.component.html',
  styleUrls: ['./canteen-deduction.component.css']
})
export class CanteenDeductionComponent implements OnInit {
  showAdd :boolean;
  showUpdate: boolean;
   showCanteen = false
   canteenForm:any
   editing_flag:any
   plantArr :any
   shiftDropdown:any
   shiftMst:any
   selectedPlant: string;
    canteenObj: CanteenObj = new CanteenObj();
    canteenMst:any
    activeCntMst:any
    uniqueShiftGroups:any
    plant_Code: any = sessionStorage.getItem('plantcode');
    is_admin: any = sessionStorage.getItem('isadmin');
    userEmpcode:string |null = sessionStorage.getItem('user_name');
  constructor(private fb: FormBuilder,private api:ClamAPIService,private modalService: NgbModal,public loader: LoaderserviceService) { 
  
  }

  ngOnInit(): void {
    this.canteenForm = this.fb.group({
      Cnt_SlNo:[''],
      plant:['',{validators : [Validators.required],updateOn: 'blur'}],
      shift:['',{validators : [Validators.required],updateOn: 'blur'}],
      status:['',{validators : [Validators.required],updateOn: 'blur'}],
      amount:['',{validators : [Validators.required],updateOn: 'blur'}],
      effectiveFrom:['',{validators : [Validators.required],updateOn: 'blur'}],
    })
this.getPlant()
this.get_Mst_List()
this.get_Shift_Mst()


  }
  clickAddCanteen(){
    this.showAdd=true;
  }

showCanteenForm(){
  this.showCanteen =!this.showCanteen
  this.reset()
}
hideCanteenForm(){
  this.showCanteen = false
  this.reset()
}
reset(){
  this.canteenForm.reset()
}


formatDateWithHr(inputDate: Date): String {
  const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
  const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
  return formattedDate;
}
 formatDate(inputDate: Date): String {
  const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
  const formattedDate = parsedDate.format('YYYY-MM-DD');
  return formattedDate;
}
markFormGroupAsTouched(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((key) => {
    const control = formGroup.controls[key];
    if (control instanceof FormGroup) {
      this.markFormGroupAsTouched(control);
    } else {
      control.markAsTouched();
    }
  });
}


SubmitForm(){

  if (this.canteenForm.valid) {

    this.canteenObj.Plant_code = this.canteenForm.value.plant
    this.canteenObj.Shift = this.canteenForm.value.shift
    this.canteenObj.Amount = this.canteenForm.value.amount
    this.canteenObj.Status = this.canteenForm.value.status
    this.canteenObj.Effective_from = this.formatDate(this.canteenForm.value.effectiveFrom)
    this.canteenObj.Created_By = this.userEmpcode;
    this.canteenObj.Created_On = this.formatDateWithHr(new Date())
   
console.log(this.canteenObj)

    this.api.addCanteen(this.canteenObj).subscribe(res => {

  alert('canteen Amount Added')
  this.get_Mst_List()
  this.hideCanteenForm()
  this.reset()

}
    ,(error)=>{
      if (error.status === 400){
          alert('Data already exists');
      }else {
        alert('Error in connection');
      }
    })

  } 
  else {
    this.markFormGroupAsTouched(this.canteenForm);
 
  }

}

Onedit(data: any) {
  this.showAdd=false
  console.log(data)
  this.canteenForm.controls['Cnt_SlNo'].setValue(data.Cnt_SlNo)
  this.canteenForm.controls['plant'].setValue(data.Plant_code)
  this.canteenForm.controls['shift'].setValue(data.Shift)
  this.canteenForm.controls['status'].setValue(data.Status.toString())
  this.canteenForm.controls['amount'].setValue(data.Amount)
  this.canteenForm.controls['effectiveFrom'].setValue(data.Effective_from)
}

editForm(){
  if (this.canteenForm.valid) {
    this.canteenObj.Cnt_SlNo= this.canteenForm.value.Cnt_SlNo
    this.canteenObj.Plant_code = this.canteenForm.value.plant
    this.canteenObj.Shift = this.canteenForm.value.shift
    this.canteenObj.Amount = this.canteenForm.value.amount
    this.canteenObj.Status = this.canteenForm.value.status
    this.canteenObj.Effective_from = this.formatDate(this.canteenForm.value.effectiveFrom)
    this.canteenObj.Modifed_By = this.userEmpcode;
    this.canteenObj.Modifed_On = this.formatDateWithHr(new Date())
   
console.log(this.canteenObj)

    this.api.editCanteen(this.canteenObj).subscribe(res => {
     
          alert('canteen deduction Updated')
          this.get_Mst_List()
          this.hideCanteenForm()
          this.reset()
        
    }
    ,(error)=>{

      if (error.status === 400){
          alert('Data already exists');
      }else {
        alert('Error in connection');
      }
    })
  } else {
    this.markFormGroupAsTouched(this.canteenForm);
  }

}

getPlant(){
  this.api.getPlant().subscribe(res => {
    console.log(res)

    if(this.is_admin){
      this.plantArr = res
    }
    else{
      this.plantArr = this.plantArr.filter((plant:any) => {
        return plant.plant_code == this.plant_Code
            })
    }

  },error =>{
    console.log("plant list not getting",error);
  })
  }
  // updateShiftDropdown(selectedPlant:any) {
  //   // console.log(selectedPlant)
  //   // console.log(this.shiftMst)
  //   const filteredShifts = this.shiftMst.filter((shift:any) => {
  //     // console.log(shift.plant_code.toString(), selectedPlant);
  //     return shift.plant_code.toString() === this.plant_Code;
  //   });

  //   // console.log(filteredShifts)
    
    
  //   this.shiftDropdown = filteredShifts.map((shift1:any) => ({
  //     id: shift1.shift_id,
  //     description: shift1.shift_desc
  //   }));
  //   // console.log(this.shiftDropdown)
  // }

get_Shift_Mst(){
  this.api.get_Shift_master().subscribe(res=>{
    this.shiftMst =res
    console.log(this.shiftMst)
     this.uniqueShiftGroups = [...new Set(this.shiftMst.map((item:any) => item.shift_group ))];
    console.log(this.uniqueShiftGroups)
    this.shiftMst = this.shiftMst.filter((shift:any)=>{
    return  shift.plant_code == this.plant_Code
    })

    console.log(this.shiftMst)
  },error=>{
    alert("Something went Wrong")
  })
}

// getFiltered_Shift():any[]{
//   if (!this.selectedPlant) {
//     // console.log(this.selectedPlant)
//     return [];
//   }
//   return this.shiftMst.filter((shift:any) => shift.plant_desc === this.selectedPlant)
// }


get_Mst_List(){
this.api.getCanteen_Mst().subscribe(res => {
this.canteenMst = res

this.activeCntMst = this.canteenMst.filter((item:any) => item.Status === true)

console.log(this.activeCntMst)
  },  error => {
    alert("Something went Wrong")
  })
}

del_Mst(data:any){
  if(data.Status){
  this.api.deleteCanteen(data.Cnt_SlNo).subscribe(res =>{
    this.get_Mst_List()
    alert("Deleted successfully")
  })
}else{
  alert("Data Already Deleted ")
}
}
exportExcel() : void{

  const transformedArray:any = this.canteenMst.map((data: any) =>{
    const transformedObj:any = {};
    Object.keys(data).forEach(key => {
      const newKey = key.replace(/_/g, ' '); 
      transformedObj[newKey] = data[key];
     
    });
    return transformedObj;
   
  
  })
  // console.log(transformedArray);
  var ws = XLSX.utils.json_to_sheet(transformedArray);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Canteen Master");
  XLSX.writeFile(wb,"Mst_Canteen_deduction.xlsx");

    }




}
