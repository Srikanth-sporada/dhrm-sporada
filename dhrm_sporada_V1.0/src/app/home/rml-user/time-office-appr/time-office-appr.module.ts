import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { TimeOfficeApprRoutingModule } from "./time-office-appr-routing.module";
import { CompOffApprComponent } from "./comp-off-appr/comp-off-appr.component";
import { OverTimeApprComponent } from "./over-time-appr/over-time-appr.component";
import { ShiftChangeApprComponent } from "./shift-change-appr/shift-change-appr.component";
import { ForgotPunchApprComponent } from "./forgot-punch-appr/forgot-punch-appr.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { MatRadioModule } from "@angular/material/radio";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";
import { NgxMatTimepickerModule } from "ngx-mat-timepicker";
// import { OdApprComponent } from "./operator_permission-appr/operator_permission-appr.component";
import { LeaveApprComponent } from "./leave-appr/leave-appr.component";
import { MissingPunchUploadComponent } from "./missing-punch-upload/missing-punch-upload.component";
import { MatTabsModule } from "@angular/material/tabs";
import { OtpopupComponent } from "./over-time-appr/otpopup/otpopup.component";
import { OtapproveComponent } from "./otapprovefh/otapprovefh.component";
import { OtapprovephComponent } from "./otapproveph/otapproveph.component";
import { HrcompoffComponent } from "./hrcompoff/hrcompoff.component";
import { CoffpopupComponent } from "./hrcompoff/coffpopup/coffpopup.component";
import { DatefilterPipe } from "./over-time-appr/datefilter.pipe";
import { CategoryfilterPipe } from './categoryfilter.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ExcesshrApproveComponent} from './excesshr-approve/excesshr-approve.component'
import { LineFilterPipe,LeaveFilterPipe1,LeaveFilterPipe2 } from "./lineFilter.pipe";
import {OtCompoffComponent} from './ot-compoff/ot-compoff.component'
import {CoffotpopupComponent} from './ot-compoff/coffpopup/coffpopup.component'
import {NightCoffComponent} from './night-coff/night-coff.component'
import {NightCoffPopupComponent} from './night-coff/nightCoff-popup/nightCoff-popup.component'
import {CoffDetailsComponent} from './coff-details/coff-details.component'
import {ExcessHoursDetailsComponent} from './excess-hours-details/excess-hours-details.component'
import { OtApprComponent } from "./Ot-appr/Ot-appr.component";
import {OtapprAddComponent} from  "./Ot-appr/otappr-add/otappr-add.component"
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgFor, AsyncPipe} from '@angular/common';
import { CalComponent } from "./cal/cal.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import {OtapprEditComponent}from  "./Ot-appr/otappr-edit/otappr-edit.component"
import { WeekOffComponent } from "./week-off/week-off.component";
import { DeptAttReportComponent } from "./dept-att-report/dept-att-report.component";
// import {LeaveFilterPipe} from 'src/app/new-contractor-mod/Shared/filters'
import {OptrApprComponent}  from "./operator_permission-appr/operator_permission-appr.component";
import { OperatorLeaveApprComponent } from './operator-leave-appr/operator-leave-appr.component';
import { OperatorCoffApprComponent } from './operator-coff-appr/operator-coff-appr.component';
import { FiveDaysMappingComponent } from './five-days-mapping/five-days-mapping.component'
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MidPermissionComponent } from './mid-permission/mid-permission.component';
import { VanFacilityMappingComponent } from './van-facility-mapping/van-facility-mapping.component';
import { VanDelayRegularizationComponent } from './van-delay-regularization/van-delay-regularization.component';
import { RouteMasterComponent } from './route-master/route-master.component';
import { RejoinApprovalComponent } from './rejoin-approval/rejoin-approval.component';
// import {GenFilterPipe} from '../../../new-contractor-mod/Shared/filters';
import { genIDFilterPipe } from "./pipe/genIdFilter.pipe";
// import { MatRadioModule } from '@angular/material/radio';
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import  { CalendarModule as CalanderModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { SpeedDialModule } from "primeng/speeddial";
import { FullMonthLopComponent } from "./full-month-lop/full-month-lop.component";
/** time office loader component */
import { TimeOfficeApprovalLoaderComponent } from "./time-office-approval-loader/time-office-approval-loader.component";
@NgModule({
  declarations: [
    CompOffApprComponent,
    OverTimeApprComponent,
    ShiftChangeApprComponent,
    ForgotPunchApprComponent,
    OptrApprComponent,
    LeaveApprComponent,
    MissingPunchUploadComponent,
    OtpopupComponent,
    OtapproveComponent,
    OtapprovephComponent,
    HrcompoffComponent,
    CoffpopupComponent,
    DatefilterPipe,
    CategoryfilterPipe,
    ExcesshrApproveComponent,
    LineFilterPipe,
    // GenFilterPipe,
    genIDFilterPipe,
    OtCompoffComponent,
    CoffotpopupComponent,
    NightCoffComponent,
    LeaveFilterPipe1,LeaveFilterPipe2,
    NightCoffPopupComponent,
    CoffDetailsComponent,
    ExcessHoursDetailsComponent,
    OtApprComponent,
    OtapprAddComponent,
    CalComponent,
    OtapprEditComponent,
    WeekOffComponent,
    DeptAttReportComponent,
    OperatorLeaveApprComponent,
    OperatorCoffApprComponent,
    FiveDaysMappingComponent,
    MidPermissionComponent,
    VanFacilityMappingComponent,
    VanDelayRegularizationComponent,
    RouteMasterComponent,
    RejoinApprovalComponent,
    /** new component */
    FullMonthLopComponent,
    /** loader */
    TimeOfficeApprovalLoaderComponent,
  ],
  imports: [
    MatNativeDateModule,
    CommonModule,
    TimeOfficeApprRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDividerModule,
    MatTableModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatIconModule,
    NgxMatTimepickerModule,
    MatButtonToggleModule,
    MatTabsModule,
    FormsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    NgFor,
    AsyncPipe,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    CalanderModule,
    ButtonModule,
    TabViewModule,
    SpeedDialModule,
  ],
})
export class TimeOfficeApprModule {}
