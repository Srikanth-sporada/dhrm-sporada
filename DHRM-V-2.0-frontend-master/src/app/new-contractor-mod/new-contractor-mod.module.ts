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
import { NewContractorModRoutingModule } from './new-contractor-mod-routing.module';
import { ContractorEmployeeComponent } from './contractor-employee/contractor-employee.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContractorOnboardComponent } from './contractor-onboard/contractor-onboard.component';
import { EarnedLeaveMasterComponent } from './earned-leave-master/earned-leave-master.component';
import { CanteenDeductionComponent } from './canteen-deduction/canteen-deduction.component';
import { PayrollMasterComponent } from './payroll-master/payroll-master.component';
import { PayscaleMasterComponent } from './payscale-master/payscale-master.component';
import { BonusMasterComponent } from './bonus-master/bonus-master.component';
import { PayrollDisplayFormComponent } from './payroll-display-form/payroll-display-form.component';
import { HolidayMasterComponent } from './holiday-master/holiday-master.component';
import { OTLimitMasterComponent } from './otlimit-master/otlimit-master.component';
import { WeekOffMasterComponent } from './week-off-master/week-off-master.component';
import { DeclaredCompOffComponent } from './Alternate_Holiday-comp-off/Alternate_Holiday-comp-off.component';
import { DeclaredHolidayMasterComponent } from './declared-holiday-master/declared-holiday-master.component';
import { LoaderserviceService } from '../loaderservice.service';
import { LoadModule } from '../loader/loader.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {ApprovalSalaryComponent} from './non-sap-salary/approval-salary/approval-salary.component'
import {ApprovePayscaleComponent} from  './non-sap-salary/approve-payscale/approve-payscale.component'
import {ViewPayscaleComponent} from './non-sap-salary/view-payscale/view-payscale.component'
 import {OneTimeSalaryComponent} from './one-time-salary/one-time-salary.component'
import {RevisePayscaleComponent} from './non-sap-salary/revise-payscale/revise-payscale.component'
import {UpdatePayscaleComponent} from './non-sap-salary/update-payscale/update-payscale.component'
import {EmpTwoRecordComponent} from './emp-two-record/emp-two-record.component'
import {BillProcessedDateComponent} from './bill-processed-date/bill-processed-date.component'
import {TransferPostingComponent} from './transfer-posting/transfer-posting.component'
import {BulkReviseSalaryComponent} from './non-sap-salary/bulk-revise-salary/bulk-revise-salary.component'
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {PayscaleHeaderMasterComponent} from './non-sap-salary/payscale-header-master/payscale-header-master.component'
// import { BonusMaster1Component } from './bonus-master1/bonus-master1.component';
// import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';

import { NativeDateAdapter } from '@angular/material/core';
import {MY_DATE_FORMATS} from './Shared/format-Datepicker'
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ToastComponent } from './toast/toast.component';
import { DelPopupComponent } from './del-popup/del-popup.component';
import { ShiftCancelComponent } from './shift-cancel/shift-cancel.component';
import {GenFilterPipe,LineFilterPipe,ShiftFilterPipe,CatgFilterPipe,DeptFilterPipe,
  SalGenFilterPipe,CustomGenFilterPipe,ApproveGenFilterPipe,PlantFilterPipe,
  CustomSalFilterPipe,ConFilterPipe,DateFilterPipe,Con_Status_FilterPipe,IN_PlantFilterPipe,
  StatusFilterPipe,MonthFilterPipe,} from '../new-contractor-mod/Shared/filters'
import { DatePipe } from '@angular/common';
import { LeaveMasterComponent } from './leave-master/leave-master.component';
import { ConfirmDialogReasonComponent } from './confirm-dialog-reason/confirm-dialog-reason.component';
import { ShiftChangeComponent } from './shift-change/shift-change.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {EmpSalMasterComponent} from './non-sap-salary/emp-sal-master/emp-sal-master.component'
import { AttendanceReprocessResultDialogComponent } from './attendance-reprocess-result-dialog/attendance-reprocess-result-dialog.component';
import { RequestDetailsDialogComponent } from './request-details-dialog/request-details-dialog.component';
import { CLSalaryReportComponent } from './cl-salary-report/cl-salary-report.component';
import { IndirectHeadCountMasterComponent } from './indirect-head-count-master/indirect-head-count-master.component';

// import { RequestDetailsDialogComponentComponent } from './request-details-dialog-component/request-details-dialog-component.component'
@NgModule({
  declarations: [
    ContractorEmployeeComponent,
    ContractorOnboardComponent,
    EarnedLeaveMasterComponent,
    CanteenDeductionComponent,
    PayrollMasterComponent,
    PayscaleMasterComponent,
    BonusMasterComponent,
    PayrollDisplayFormComponent,
    HolidayMasterComponent,
    OTLimitMasterComponent,
    WeekOffMasterComponent,
    DeclaredCompOffComponent,
    DeclaredHolidayMasterComponent,
    ToastComponent,
    DelPopupComponent,
    ShiftCancelComponent,
    GenFilterPipe,LineFilterPipe,PlantFilterPipe,
    ShiftFilterPipe,StatusFilterPipe,CatgFilterPipe,DeptFilterPipe,MonthFilterPipe,
    CustomGenFilterPipe,ApproveGenFilterPipe,IN_PlantFilterPipe,
    DateFilterPipe,ConFilterPipe,CustomSalFilterPipe,SalGenFilterPipe,Con_Status_FilterPipe,
    ApprovalSalaryComponent,  
    ApprovePayscaleComponent,  
    ViewPayscaleComponent,  
     OneTimeSalaryComponent,
    RevisePayscaleComponent, 
    UpdatePayscaleComponent, 
    EmpTwoRecordComponent,    
    TransferPostingComponent,  
    BillProcessedDateComponent,
    BulkReviseSalaryComponent,
    ConfirmDialogComponent,
    LeaveMasterComponent,
    ConfirmDialogReasonComponent,
    ShiftChangeComponent,
    AttendanceReprocessResultDialogComponent,
    EmpSalMasterComponent,
    RequestDetailsDialogComponent,
    CLSalaryReportComponent,
    PayscaleHeaderMasterComponent,
    IndirectHeadCountMasterComponent,

    
  
  ],
  imports: [
    CommonModule,
    NgbModule,
    NewContractorModRoutingModule,
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
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    HttpClientModule,
    LoadModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTableModule

    // NgxMatFileInputModule
   
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    [DatePipe],
  ], 
  
})
export class NewContractorModModule { }
