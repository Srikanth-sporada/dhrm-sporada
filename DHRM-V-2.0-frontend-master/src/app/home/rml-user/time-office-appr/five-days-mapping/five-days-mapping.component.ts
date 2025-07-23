import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/home/api.service';
import { MatDialog } from '@angular/material/dialog';
import {GenFilterPipe } from '../../../../new-contractor-mod/Shared/filters'

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
  
  userEmpcode:string |null = sessionStorage.getItem('user_name');

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
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