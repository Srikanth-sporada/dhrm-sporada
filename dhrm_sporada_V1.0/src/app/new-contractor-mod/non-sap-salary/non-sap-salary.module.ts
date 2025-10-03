import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon'
import {MatToolbarModule} from '@angular/material/toolbar'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LoadModule } from '../../loader/loader.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { OneTimeSalaryApprovalComponent } from './one-time-salary-approval/one-time-salary-approval.component';
import { PayscaleHeaderMasterComponent } from './payscale-header-master/payscale-header-master.component';
// import { EmpSalMasterComponent } from './emp-sal-master/emp-sal-master.component';
// import { BulkReviseSalaryComponent } from './bulk-revise-salary/bulk-revise-salary.component';
// import { ApprovalSalaryComponent } from './approval-salary/approval-salary.component';
// import { ApprovePayscaleComponent } from './approve-payscale/approve-payscale.component';
// import { ViewPayscaleComponent } from './view-payscale/view-payscale.component';



@NgModule({
  declarations: [
    // ViewPayscaleComponent
  
    // ApprovePayscaleComponent
  
    // ApprovalSalaryComponent
  
    // BulkReviseSalaryComponent
  
    // 
    
  
    OneTimeSalaryApprovalComponent,
    // PayscaleHeaderMasterComponent
  ],
  imports: [
   CommonModule,
      NgbModule,

      ReactiveFormsModule,
      MatStepperModule,
      MatButtonModule,
      MatRadioModule,
      MatIconModule,
      MatNativeDateModule,
      FormsModule,
      MatDatepickerModule,
      MomentDateModule,
      MatInputModule,
      MatToolbarModule,
     
      MatSelectModule,
      MatCheckboxModule,
      MatDialogModule,
      HttpClientModule,
      LoadModule,
      MatAutocompleteModule,
      MatProgressSpinnerModule,
      MatTableModule
  
  ]
})
export class NonSAPSalaryModule { }
