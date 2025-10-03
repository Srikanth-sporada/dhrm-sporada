import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PmpdMasterComponent } from "./pmpd-master/pmpd-master.component";
import { PmpdRoutingModule } from "./pmpd-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AddPmpdComponent } from "./pmpd-master/add-pmpd/add-pmpd.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { BulkUploadComponent } from "./pmpd-master/bulk-upload/bulk-upload.component";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { CodePipe } from './code.pipe';
import { ProdActualComponent } from "./prod-actual/prod-actual.component";
import {ProdDataFlterPipe} from './prod-actual/prodDataFlter.pipe'

@NgModule({
  imports: [
    CommonModule,
    PmpdRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatRadioModule,
   
   
  ],
  declarations: [PmpdMasterComponent, AddPmpdComponent, BulkUploadComponent,CodePipe,ProdActualComponent, ProdDataFlterPipe
  ],
  
})
export class PMPDModule {}
