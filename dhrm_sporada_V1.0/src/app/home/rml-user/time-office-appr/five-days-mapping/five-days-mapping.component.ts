import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';


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

  constructor(private apiService: ApiService, private dialog: MatDialog, private messageService:MessageService) {}

  ngOnInit(): void {
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.getData();
  }

  getData() {
    const plant = sessionStorage.getItem('plantcode');
    this.apiService.getFiveDaysMapping(plant).subscribe((response: any) => {
      console.log(response);
      this.list = response;
    });
  }

  openEditDialog(employee: any): void {
    this.selectedEmployee = employee;
    this.editDialogOpen = true;


  }

  closeEditDialog(): void {
    this.selectedEmployee = null;
    this.editDialogOpen = false;
  }

  saveEdit() {
    console.log('Saving edit:', this.selectedEmployee);
    // Implement save logic here
this.apiService.Update5Days(this.selectedEmployee,this.userEmpcode).subscribe((res:any)=>{
  console.log(res);
this.getData()
  this.closeEditDialog();
})
  }

  close() {
    this.closeEditDialog();
  }
}