import { Component, OnInit } from '@angular/core';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { ApiService } from 'src/app/home/api.service';
import { BackdatePopupComponent } from './backdate-popup/backdate-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService,ConfirmationService,MenuItem } from 'primeng/api';

@Component({
  selector: 'app-backdate',
  templateUrl: './backdate.component.html',
  styleUrls: ['./backdate.component.css']
})
export class BackdateComponent implements OnInit {
  data:any[];
  selectedPlant:any='';
  plantData:any=[];
  plantCopy:any = [];
  backDateData:any = [];
   // Speed Dial items
    items: MenuItem[] = [
              {
                  icon: 'pi pi-plus-circle',
                  tooltipOptions:{
                    tooltipLabel: 'Add Back Date',
                  },
                  command: () => {
                      this.dailog.open(BackdatePopupComponent,{
                        data:{editingFlag:true}
                      });
                  }
              },
              {
                icon: 'pi pi-download',
                tooltipOptions:{
                  tooltipLabel: 'Download',
                },
                command: () => {
                  this.exportexcel();
                  this.messageService.add({ severity: 'info', summary: 'Data Converted.' });
                }
              }
    ];
  constructor(public loader: LoaderserviceService,private service:ApiService,private dailog:MatDialog,private messageService:MessageService,private confirmationService:ConfirmationService) { }

  ngOnInit() {
    this.getPlantData();
    this.getBackDateData();
  }

/** get back date api call */
  getBackDateData(){
    this.service.getBackDate().subscribe((response:any)=>{
      if(response.status=='success'){
        console.log(response.data)
        this.data = response.data;
        this.backDateData = response.data;
        /** filter function */
        this.filterBackDateByPlant();
      }else{
        this.messageService.add({severity:'info',summary:response.message})
      }
    })
  }

  /** get plant data api call */
  getPlantData(){
     this.service.getplant().subscribe({
      next:(response:any) =>{
        this.plantData = response;
        this.plantData.unshift({plant_name:'All', plant_code:''});
      },
      error:(err) => this.messageService.add({severity:'error',summary:err.message})
    });
  }
  // open update back date material model
  openEdit(plantdata:any){
    let dailog=this.dailog.open(BackdatePopupComponent,{
      data:plantdata,
    })

    dailog.afterClosed().subscribe(()=>{
      this.getBackDateData();
    })
  }
// delete designation
  deleteBackDate(event:Event,a: any, slno: any) {
  console.log(slno)
  this.confirmationService.confirm({
        target: event.target as EventTarget,
            message: 'Are you sure you want to Delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {this.deleteBackDateAPICall(a,slno)},
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected'});
            }
      })
  }
// delete BackDate api call
  deleteBackDateAPICall(a: any, slno: any){
    // this.service.deletedesignation({ slno: slno })
    //   .subscribe({
    //     next: (response: any) => {
    //       console.log(response);
    //       if (response.message == 'success')
    //         this.designation.splice(a, 1);
    //         this.messageService.add({severity:'info',summary:'Designation Deleted.'})
    //     },
    //     error:(err) => this.messageService.add({severity:'error',summary:err.message})
    //   })

    this.messageService.add({severity:'info',summary:'Delete Test!'})
  }
  // filter backdate by plant
  filterBackDateByPlant(){
     if(this.selectedPlant !== ''){
      const filteredData = this.backDateData.filter((backdate:any) => {
       if(this.selectedPlant == backdate.plant.toString()){
        return backdate;
       }
     });

     if(filteredData.length){
      this.data = filteredData;
     }else{
      this.data = this.backDateData;
      this.messageService.add({severity:'info',summary:`Back Date Not Found For Plant: ${this.selectedPlant}`})
     }
     }else{
      this.data = this.backDateData;
     }
  }

  // export to excel
  exportexcel(){

  }
}
