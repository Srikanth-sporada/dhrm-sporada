import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Utility } from 'src/app/utils/utils';
import { LoaderserviceService } from 'src/app/loaderservice.service';
@Component({
  selector: 'app-five-days-mapping',
  templateUrl: './five-days-mapping.component.html',
  styleUrls: ['./five-days-mapping.component.css']
})

export class FiveDaysMappingComponent implements OnInit {
  list: any[] = [];
  selectedEmployee: any;
  selectedGenId: any;
  editDialogOpen: boolean = false;
  all:any;
  userDetails:any;
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  plantCode:string | null=  sessionStorage.getItem('plantcode')
  constructor(
    private apiService: ApiService, 
    private dialog: MatDialog, 
    private messageService:MessageService,
    public utils:Utility,
    public loader:LoaderserviceService) {}

  ngOnInit(): void {
    /** logged in user details */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getData(this.plantCode);
  }

  /** get trainee working day mapping data */
  getData(plantCode:any) {
    this.apiService.getFiveDaysMapping(plantCode).subscribe({
      next: (response: any) => {
        console.log(response);
        this.list = response;
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }

  /** 
   * open five days mapping dialog modal
   * @property {*} selectedEmployee
   * @property {*} editDialogOpen
   *  */
  openEditDialog(employee: any): void {
    this.selectedEmployee = employee;
    this.editDialogOpen = true;
  }

  /** close five daya mapping dialog modal */
  closeEditDialog(): void {
    this.selectedEmployee = null;
    this.editDialogOpen = false;
  }

  /** update trainee working mapping */
  saveEdit() {
    console.log('Saving edit:', this.selectedEmployee);
    // Implement save logic here
   this.apiService.Update5Days(this.selectedEmployee,this.userEmpcode).subscribe({
    next: (res:any) => {
    console.log(res);
    if(!res){
      this.messageService.add({severity:'info',summary:'Trainee working day updated successfully!'});
    }
    this.getData(this.plantCode)
    this.closeEditDialog();
    },
    error: (error:any) => {
      console.error('ERROR:',error);
      this.messageService.add({severity:'error',summary:error?.message});
    }
   })
  }

  /** close dialog modal */
  close() {
    this.closeEditDialog();
  }
}