import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';
import {ClamAPIService} from '../clam-api.service'
import { LoaderserviceService } from 'src/app/loaderservice.service';
import {BonusObj} from './bonus.model'
import * as moment from 'moment';
import * as XLSX from'xlsx'



@Component({
  selector: 'app-bonus-master',
  templateUrl: './bonus-master.component.html',
  styleUrls: ['./bonus-master.component.css'],

})
export class BonusMasterComponent implements OnInit {


showBonusForm = false;
bonusForm:any
bonusObj: BonusObj = new BonusObj();
plantData:any
plant_id: any = sessionStorage.getItem('plantcode');
userEmpcode:string |null = sessionStorage.getItem('user_name');
bonusData:any
activeBonusData:any

showAdd: boolean ;
activeStatus: boolean;

  constructor(private fb: FormBuilder ,private modalService: NgbModal,private service : ApiService,public loader: LoaderserviceService,private api:ClamAPIService ) {

  }

  ngOnInit(): void {
        this.bonusForm = this.fb.group({
      slNo:[''],
      plant:['',{validators : [Validators.required],updateOn: 'blur'}],
      Pbonus:['',{validators : [Validators.required],updateOn: 'blur'}],
      Abonus:['',{validators : [Validators.required],updateOn: 'blur'}],
      status:['',{validators : [Validators.required],updateOn: 'blur'}],
      effectiveFrom:['',{validators : [Validators.required],updateOn: 'blur'}],
      effectiveTo:['',{validators : [Validators.required],updateOn: 'blur'}]
    })

    this.getplantcode()
    this.getAllBonus()

  
  }




  getplantcode(){
    var company = {'company_name': sessionStorage.getItem('companyList.companycode')}
    this.service.plantcodelist(company)
    .subscribe({


      next: (response) =>{ this.plantData = response;
        console.log(response)
       },
      error: (error) => console.log(error),
    });
  }


  clickAddBonus(){
    this.showAdd=true;
    this.activeStatus=true
  }


  

  showBonus(){
    this.showBonusForm =true
    this.reset()
  }

  hideBonus(){
     this.reset()
    this.showBonusForm =false
   
  }
  reset(){
    this.bonusForm.reset()
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
  closeAllForms(event:any){
    this.hideBonus() 
  }


  onSubmit(){
    if(this.bonusForm.valid){
      // this.bonusObj.Plant_code  =this.plant_id
      this.bonusObj.Plant_code  =this.bonusForm.value.plant
      this.bonusObj.Planned_Bonus  =this.bonusForm.value.Pbonus
      this.bonusObj.Actual_Bonus  =this.bonusForm.value.Abonus
      this.bonusObj.Effective_from  =this.formatDate(this.bonusForm.value.effectiveFrom).toString()
      this.bonusObj.Effective_To  =this.formatDate(this.bonusForm.value.effectiveTo).toString()
      this.bonusObj.Status = this.bonusForm.value.status
      this.bonusObj.Created_By = this.userEmpcode
      this.bonusObj.Created_On = this.formatDateWithHr(new Date()).toString()


      this.api.add_Bonus_Mst(this.bonusObj).subscribe(res => {
        alert('bonus added')
        this.hideBonus()
        this.getAllBonus()
        this.reset()
      },(error)=>{
        if (error.status === 400){
          alert('Data already exists');
      }else {
        alert('Error in connection');
      }
      })
     
      return true;
    }else{
      this.markFormGroupAsTouched(this.bonusForm);
      return false;
    }
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


getAllBonus(){

  this.api.get_Bonus_Mst().subscribe(res => {
    this.bonusData = res
    this.activeBonusData = this.bonusData.filter((item:any) => item.Status === true)
  

      },  error => {
        alert("Something went Wrong")
      })


}


onEdit(data:any){
  this.showBonus()
  console.log(data)

    this.bonusForm.controls['slNo'].setValue(data.Bn_SlNo)
    this.bonusForm.controls['plant'].setValue(data.Plant_code)
    this.bonusForm.controls['Pbonus'].setValue(data.Planned_Bonus)
    this.bonusForm.controls['Abonus'].setValue(data.Actual_Bonus)
    this.bonusForm.controls['effectiveFrom'].setValue(data.Effective_from)
    this.bonusForm.controls['effectiveTo'].setValue(data.Effective_To)
    this.bonusForm.controls['status'].setValue(data.Status.toString())
    this.showAdd=false;

}


update(){
  console.log("update")
  if(this.bonusForm.valid ){
    this.bonusObj.Bn_SlNo  =this.bonusForm.value.slNo
    this.bonusObj.Plant_code  =this.bonusForm.value.plant
    this.bonusObj.Planned_Bonus  =this.bonusForm.value.Pbonus
    this.bonusObj.Actual_Bonus  =this.bonusForm.value.Abonus
    this.bonusObj.Status = this.bonusForm.value.status
    this.bonusObj.Effective_from  =this.formatDate(this.bonusForm.value.effectiveFrom).toString()
    this.bonusObj.Effective_To  =this.formatDate(this.bonusForm.value.effectiveTo).toString()
    this.bonusObj.Modified_By = this.userEmpcode
    this.bonusObj.Modified_On = this.formatDateWithHr(new Date()).toString()

console.log(this.bonusObj)


    this.api.edit_Bonus_Mst(this.bonusObj , this.bonusObj.Bn_SlNo ).subscribe(res => {
      alert('Bonus updated successfully')
    },error=>{
      alert("Error in connection")
    })
    this.hideBonus()
    this.getAllBonus()
    this.reset()
    return true;
  }else{
    alert("Please select Status Active ")
    this.markFormGroupAsTouched(this.bonusForm);
    return false;
  }

}

delete_bonus(data:any){
  if(data.Status){
    this.api.del_Bonus_Mst(data.Bn_SlNo)
    .subscribe(res =>{
      alert("Bonus Deleted successfully")
      this.getAllBonus()
    })
  }else{
    alert('Data Already Deleted')
  }
  
}

exportExcel() : void{

  const transformedArray:any = this.bonusData.map((data: any) =>{
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
  XLSX.utils.book_append_sheet(wb, ws, "Bonus Master");
  XLSX.writeFile(wb,"Mst_Bonus.xlsx");

    }


  







}