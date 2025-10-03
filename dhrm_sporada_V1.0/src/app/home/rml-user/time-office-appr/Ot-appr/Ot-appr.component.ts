import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import { MatDialog } from '@angular/material/dialog';
import { OtapprAddComponent } from './otappr-add/otappr-add.component';
import {OtapprEditComponent} from './otappr-edit/otappr-edit.component';
import * as XLSX from'xlsx';
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';

@Component({
  selector: 'app-Ot-appr',
  templateUrl: './Ot-appr.component.html',
  styleUrls: ['./Ot-appr.component.css']
})
export class OtApprComponent implements OnInit {
  list:any[];
  approverList:any[];
  plant:any;
  plantArray:any[] = [];
  all:any;
  userDetails:any;
  selectedPlant:any = '';
  items: MenuItem[] = [
            {
                icon: 'pi pi-plus-circle',
                tooltipOptions:{
                  tooltipLabel: 'Add OT Approver',
                },
                command: () => {
                   this.openAdd();
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
  constructor(private apiService:ApiService,private matdailog:MatDialog, private messageService:MessageService, private confirmationService:ConfirmationService) { }

  ngOnInit() {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.plant=sessionStorage.getItem('isadmin')=='true'?'':sessionStorage.getItem('plantcode')
    console.log(this.plant)
    this.getData();
    if(!this.plant){
       this.getPlant();
    }
   
  }

  getData(){
    this.apiService.getOtapperMapping(this.plant).subscribe((response:any)=>{
      if(response.status=='success'){
        this.list=response.data
        this.approverList = response.data
      }else{
        // alert(response.messsage);
        this.messageService.add({severity:'warn',summary:response.message})
      }
    })
  }

  getPlant(){
    this.apiService.getplant().subscribe({
      next: (response:any) => {
        if(!response){
          this.messageService.add({severity:'info',summary:'No Plants'});
        }else{
          this.plantArray = response;
          this.plantArray.push({plant_name:'All',plant_code:''})
        }
      },
      error: (error) =>{
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message})
      }
    })
  }

  openAdd(){
    let dailog=this.matdailog.open(OtapprAddComponent)

    dailog.afterClosed().subscribe((data:any)=>{this.getData()})
  }

  openEdit(item:any){
    let dailog=this.matdailog.open(OtapprEditComponent,{
      data:item
    })

    dailog.afterClosed().subscribe((data:any)=>{this.getData()})
  }

  delete(event:Event,id:any){
    this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteApproverAPICall(id)},
            reject: () => {
                this.messageService.add({ severity: 'warn', summary: 'Rejected'});
            }
      });
  }

  deleteApproverAPICall(id:any) {
        let data={id:id}
    this.apiService.deleteOtMapping(data).subscribe((response:any)=>{
      if(response.status='success'){
        // alert(response.message)
        this.messageService.add({severity:'info',summary:response.message})
        this.getData()
      }else{
        alert(response.message);
        this.messageService.add({severity:'error',summary:response.message})
        this.getData()
      }
    })
  }

  exportExcel() : void{
    const transformedArray:any = this?.list?.map((data: any) =>{
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
    XLSX.utils.book_append_sheet(wb, ws, "OT APPROVER MAPPING");
    XLSX.writeFile(wb,"ot_approver_mapping.xlsx");
  
  }

  filterOtApproverByPlant(){
    if(this.selectedPlant == ''){
      this.list = this.approverList;
    }else{
    const filteredData = this.approverList.filter((approver:any) => {
      if(approver.plant == this.selectedPlant) return approver;
    });

    if(filteredData.length){
      this.list = filteredData;
    }else{
      this.list = this.approverList;
      this.messageService.add({severity:'info',summary:`No Approver For Plant: ${this.selectedPlant}`});
    }
    }
  }
}
