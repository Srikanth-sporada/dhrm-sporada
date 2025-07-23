import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder,Validators,FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import { MatVerticalStepper } from '@angular/material/stepper';
import { ApiService } from 'src/app/home/api.service';
import { ClamAPIService } from '../../clam-api.service';

import { MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import {LoaderserviceService} from '../../../loaderservice.service'
import { checkServerIdentity } from 'tls';
import { ToastComponent } from '../../toast/toast.component';
import * as moment from 'moment';
import * as XLSX from "xlsx-js-style";
import { error } from 'console';
import { ChangeDetectorRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-payscale-header-master',
  templateUrl: './payscale-header-master.component.html',
  styleUrls: ['./payscale-header-master.component.css']
})
export class PayscaleHeaderMasterComponent implements OnInit {
  selectedContrator:any
  selectedPlant:any
  selectedStatus: boolean | null = true;
  payScale:FormGroup
  NewPayScaleFormGroup:FormGroup
  showPayscaleForm=false;
  viewPayscaleForm=false
  constructors_List: any[] = [];
  filteredconstructors_List: any[] = [];
  plantList: any[] = [];
  Payscale_Header_List: any[] = [];
  all: any = JSON.parse(sessionStorage.getItem("all") || '{}')
 // userEmpcode:string |null = sessionStorage.getItem('user_name');
  userEmpcode:any = sessionStorage.getItem('user_name');
  plant_Code: any = sessionStorage.getItem('plantcode');
  isadmin: string | null = sessionStorage.getItem("isadmin");
  isFin: string | null =this.all['is_fin']
  showAdd :boolean;
  edit=false;



  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private api : ClamAPIService,private service : ApiService,public loader: LoaderserviceService,private dialog: MatDialog) { 
// console.log(this.isFin);

  }



  ngOnInit() {
    this.NewPayScaleFormGroup = this.fb.group({
      PayScale_ID:'',
      Plant_Code: ['', Validators.required],
      Cont_ID: ['', Validators.required],
      PayScale_Name: ['', Validators.required]
    });

    // Initialize form fields
    this.NewPayScaleFormGroup.patchValue({
      Plant_Code: '',
      Cont_ID: '',
      PayScale_Name: ''
    });

    // Call methods to fetch data
    //this.getPayscale_Header();
    this.getPayscale_Header_combine();
    this.getContra();
    // this.getPlant();
    this.getPlant_compain();
  }

  onPayScaleNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.NewPayScaleFormGroup.patchValue({
      PayScale_Name: value.toUpperCase()
    });
  }
  // getContra(){
  //   this.api.getContractor().subscribe(res =>{
  //     // console.log(res);
  //     // console.log( res.filter((item:any) => item.Plant_code == this.plant_Code  && item.Status=== true));
      
  //     if(this.isFin){
  //       this.constructors_List = res;
  //      this.filteredconstructors_List =  res.filter((item:any) => item.Plant_code == this.plant_Code  && item.Status=== true)
  //     }else{
  //       this.constructors_List = res;
  //     }
  //     // console.log(res)
  //    },error=>{
  //     console.log(error)
  //   })
  // }

  getContra(){
    this.api.getContractor_combine(this.userEmpcode).subscribe((res:any) =>{

      this.constructors_List = res
    
      // console.log( res.filter((item:any) => item.Plant_code == this.plant_Code  && item.Status=== true));
      
      if(this.isFin && this.plant_Code=='1300'){
        console.log('1');
        console.log('res',res);
        this.constructors_List=res;

        this.filteredconstructors_List = res;
      
      }
      else if(this.isFin && this.plant_Code!='1300')
      {
        console.log('2');
        this.constructors_List=res;
        this.filteredconstructors_List =  res.filter((item:any) => item.Plant_code == this.plant_Code  && item.Status=== true)
      }
      else{
        console.log('3');
        this.constructors_List=res;
        this.filteredconstructors_List = res;
      }
      // console.log(res)
     },error=>{
      console.log(error)
    })
  }

  openAlertDialog(message: string, iCon: string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: iCon,
        message: message,
      },
    });
  }


  // getPayscale_Header(){
  //   this.api.getPayscleMaster(this.plant_Code).subscribe((res:any) =>{
      
  //     if(this.isFin){
  //       this.Payscale_Header_List =  res.filter((item:any) => item.Plant_Code == this.plant_Code  )
  //      }else{
  //        this.Payscale_Header_List = res;
  //      }
  //       },error=>{
  //     console.log(error)
  //   })
  // }
  getPayscale_Header_combine(){
    this.api.get_Payscale_Header_combine(this.plant_Code,this.userEmpcode).subscribe((res:any) =>{
      console.log(res)
      if(this.isFin && this.plant_Code=='1300'){
        this.Payscale_Header_List =  res
       }
    else if(this.isFin && this.plant_Code!='1300'){
        this.Payscale_Header_List =  res.filter((item:any) => item.Plant_Code == this.plant_Code  )
       }else{
         this.Payscale_Header_List = res;
       }
        },error=>{
      console.log(error)
    })
  }



  // getPlant(){
  //   this.api.getPlant().subscribe((res:any) => {

  //     this.plantList = res

  //     if(this.isFin){
  //       this.selectedPlant = this.plant_Code
  //       // this.onPlantChange()
  //       this.plantList = res.filter((item:any) => item.plant_code == this.plant_Code  && item.del_status=== false)
  //      }else{
  //        this.plantList = res;
  //      }

  //     // this.updateFilteredPlantArr();
  //   },error =>{
  //     console.log("plant list not getting",error);
  //   })
  // }
  // this.api.getWageMst(this.plant_Code,this.userEmpcode).subscribe((res:any) =>{

  getPlant_compain(){
    this.api.getPlant_compain(this.userEmpcode).subscribe((res:any) => {
     
      this.plantList = res
console.log(res)
      if(this.isFin && this.plant_Code == '1300'){
        console.log(res)
        console.log(typeof(this.plant_Code))
        this.plantList = res;
        }
        else if( this.plant_Code !='1300'){
          //this.selectedPlant = this.plant_Code
        // this.onPlantChange()
   this.plantList = res.filter((item:any) => item.plant_code == this.plant_Code  && item.del_status=== false)
        }
        
        else{

         this.plantList = res;
       }

      // this.updateFilteredPlantArr();
    },error =>{
      console.log("plant list not getting",error);
    })
  }


  getContractorCode(plantCode: string) {
    //this.filteredconstructors_List = this.constructors_List.filter(con => con.Plant_code === plantCode);

    // if((this.plant_Code=='1300' ||this.plant_Code=='1500' ) && this.isFin)
    // {
    //   this.filteredconstructors_List=this.constructors_List
    // }
   
    // else{

    this.filteredconstructors_List = this.constructors_List.filter(con => con.Plant_code === plantCode);
    this.cdr.detectChanges();
    // }
  }

  onPlantChange(value: string) {
console.log(value)
if(this.isFin){
  this.getContractorCode(value);
}else{
  if (value) {
    this.getContractorCode(value);
  }
}

    
  }
  
  onStatusChange(status: boolean) {
    this.selectedStatus = status;
    this.cdr.detectChanges();
  }

  showPayscale(){
    this.showPayscaleForm = true
  }
  hidePayscale(){
    this.showPayscaleForm = false;
  }
  viewPayscale(){
    this.viewPayscaleForm = true
  }
  hideviewPayscale(){
    this.viewPayscaleForm = false;
  }
  clickAdd(){
    this.showAdd=true;
    this.edit = false
  }

  closeAllForms(){
    this.resetForm();
    this.hidePayscale();
  }
  closeAllForms1(){
    this.resetForm();
    this.hideviewPayscale();
  }
  resetForm() {
    this.NewPayScaleFormGroup.reset();
    this.NewPayScaleFormGroup.patchValue({
      Plant_Code: '',
      Cont_ID: '',
      PayScale_Name: ''
    });
  }

  onSubmit() {
    if (this.NewPayScaleFormGroup.valid) {
      // Process form data
      const formData = this.NewPayScaleFormGroup.value;
      this.api.NewPayscaleHeader(formData,this.userEmpcode).subscribe((res:any)=>{
        // this.getPayscale_Header()
        this.getPayscale_Header_combine();
        this.closeAllForms()
        this.openAlertDialog(`New Payscale Header Added`, "check");
      },error =>{
        this.openAlertDialog(`Header Not Created`, "check");
      console.log("Header Not Inserted",error);
    })
    } else {
      // Handle invalid form
      Object.values(this.NewPayScaleFormGroup.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  On_Update() {
    if (this.NewPayScaleFormGroup.valid) {
      // Process form data
      const formData ={
        PayScale_ID:   this.NewPayScaleFormGroup.value.PayScale_ID,
        PayScale_Name:   this.NewPayScaleFormGroup.value.PayScale_Name,

      }
      
      this.NewPayScaleFormGroup.value;
      this.api.updatePayscaleHeader(formData,this.userEmpcode).subscribe((res:any)=>{
        // this.getPayscale_Header()
        this.getPayscale_Header_combine()
        this.closeAllForms1()
        this.openAlertDialog(` Payscale Header Updated`, "check");
      },error =>{
        this.openAlertDialog(`Header Not Updated`, "check");
      console.log("Header Not Inserted",error);
    })
    } else {
      // Handle invalid form
      Object.values(this.NewPayScaleFormGroup.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }


  delete(data: any) {
    this.api.deletePayscaleHeader(data,this.userEmpcode).subscribe((res:any)=>{
      // this.getPayscale_Header()
      this.getPayscale_Header_combine()
    //  this.closeAllForms1()
      this.openAlertDialog(` Payscale Header Deleted`, "check");
    },error =>{
      this.openAlertDialog(`Header Not Deleted`, "check");
    console.log("Header Not Inserted",error);
  })


  }




  newPayScale( ){
   this.showPayscaleForm = true
   this.getPlant_compain()
  };
  

  exportExcel(): void {
 
    
    let data
 if(this.isFin){
   data =  this.Payscale_Header_List.filter(item =>item.Plant_Code == this.plant_Code)
 }else{
  data =  this.Payscale_Header_List
 }
 
     const transformedArray: any = data.map((obj: any) => {
       const transformedObj: any = {};
       Object.keys(obj).forEach(key => {
         const newKey = key.replace(/_/g, ' '); // replace hyphens with spaces
         transformedObj[newKey] = obj[key];
       });
       return transformedObj;
     });
    //  console.log(transformedArray);
 
     var ws = XLSX.utils.json_to_sheet(transformedArray);
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
     XLSX.utils.book_append_sheet(wb, ws, "Payscale Header List");
     XLSX.writeFile(wb, "Payscale Header List.xlsx");
   }
 
 

  onView(data: any) {
   this.viewPayscaleForm = true
    this.showAdd = false;
    // console.log(data);
    // this.getPlant()
this.getContractorCode( data.Plant_Code?.toString())
    // Patch the values to the form
    this.NewPayScaleFormGroup.patchValue({
      PayScale_ID: data.PayScale_ID,
      Plant_Code: data.Plant_Code?.toString() ,
      Cont_ID: data.Con_Id,
      PayScale_Name: data.PayScale_Name
    });
  }



}
