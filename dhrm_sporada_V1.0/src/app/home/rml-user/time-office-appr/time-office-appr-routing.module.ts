import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompOffApprComponent } from "./comp-off-appr/comp-off-appr.component";
import { ForgotPunchApprComponent } from "./forgot-punch-appr/forgot-punch-appr.component";
import { OverTimeApprComponent } from "./over-time-appr/over-time-appr.component";
import { ShiftChangeApprComponent } from "./shift-change-appr/shift-change-appr.component";
import { MissingPunchUploadComponent } from "./missing-punch-upload/missing-punch-upload.component";
import { OtapproveComponent } from "./otapprovefh/otapprovefh.component";
import { OtapprovephComponent } from "./otapproveph/otapproveph.component";
import { HrcompoffComponent } from "./hrcompoff/hrcompoff.component";
import { ExcesshrApproveComponent } from "./excesshr-approve/excesshr-approve.component";
import { OtCompoffComponent } from "./ot-compoff/ot-compoff.component";
import { NightCoffComponent } from "./night-coff/night-coff.component";
import { OtApprComponent } from "./Ot-appr/Ot-appr.component";
import { CalComponent } from "./cal/cal.component";
import { WeekOffComponent } from "./week-off/week-off.component";
import { AdminGuard } from "../../Guards/admin.guard";
import { DeptAttReportComponent } from "./dept-att-report/dept-att-report.component";
import {OptrApprComponent}  from "./operator_permission-appr/operator_permission-appr.component"
import { OperatorLeaveApprComponent } from './operator-leave-appr/operator-leave-appr.component'
import { OperatorCoffApprComponent } from './operator-coff-appr/operator-coff-appr.component'
import { FiveDaysMappingComponent } from './five-days-mapping/five-days-mapping.component'
import { MidPermissionComponent } from './mid-permission/mid-permission.component';
import { VanFacilityMappingComponent } from './van-facility-mapping/van-facility-mapping.component';
import { VanDelayRegularizationComponent } from './van-delay-regularization/van-delay-regularization.component';
import { RouteMasterComponent } from './route-master/route-master.component';
import { RejoinApprovalComponent } from "./rejoin-approval/rejoin-approval.component";
import { AttendanceReprocessNewComponent } from "./attendance-reprocess-new/attendance-reprocess-new.component";

const routes: Routes = [
  {
    path: "forgot-punch-appr",
    component: ForgotPunchApprComponent,
  },
  {
    path: "shift-change-appr",
    component: ShiftChangeApprComponent,
  },
  {
    path: "over-time-appr",
    component: OverTimeApprComponent,
  },
  {
    path: "comp-off-appr",
    component: CompOffApprComponent,
  },
  {
    path: "missing-punch",
    component: MissingPunchUploadComponent,
  },
  {
    path: "otapprove",
    component: OtapproveComponent,
  },
  {
    path: "otapproveph",
    component: OtapprovephComponent,
  },
  {
    path: "compoffhr",
    component: HrcompoffComponent,
  },
  {
    path: "excesshrAppr",
    component: ExcesshrApproveComponent,
    // canActivate: [AdminGuard],
  },
  {
    path: "ot-compoff",
    component: OtCompoffComponent,
    // canActivate: [AdminGuard],
  },
  {
    path: "night-coff",
    component: NightCoffComponent,
    // canActivate: [AdminGuard],
  },
  {
    path: "otapprmapping",
    component: OtApprComponent,
  },
  {
    path: "calender",
    component: CalComponent,
  },
  // with params
  {
    path: "calender/:genId",
    component: CalComponent,
  },
  {
    path: "weekoff",
    component: WeekOffComponent,
  },
  {
    path: "deptReport",
    component: DeptAttReportComponent,
  },
  {
    path: "optr-appr-exec",
    component: OptrApprComponent,
  },
  {
    path: "optr-appr-hrmng",
    component: OptrApprComponent,
  },
  {
    path: "optr-leave-exec",
    component: OperatorLeaveApprComponent,
  },
  {
    path: "optr-leave-hrmng",
    component: OperatorLeaveApprComponent,
  },
  {
    path: "optr-Coff-exec",
    component: OperatorCoffApprComponent,
  },
  
  {
    path: "five-days-mapping",
    component: FiveDaysMappingComponent,
  },
  {
    path: "mid-day-permission",
    component: MidPermissionComponent,
  },
  {
    path: "van-delay-regularization",
    component: VanDelayRegularizationComponent,
  },
  {
    path: "van-mapping",
    component: VanFacilityMappingComponent,
  },
  {
    path: "route",
    component: RouteMasterComponent,
  },
  {
    path: "Rejoin_Approval",
    component: RejoinApprovalComponent
  },
  {
    path: "attendance/reprocess/new",
    component: AttendanceReprocessNewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeOfficeApprRoutingModule {}
