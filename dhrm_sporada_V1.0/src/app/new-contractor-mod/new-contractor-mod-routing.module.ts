import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContractorEmployeeComponent } from "./contractor-employee/contractor-employee.component";
import { ContractorOnboardComponent } from "./contractor-onboard/contractor-onboard.component";
import { EarnedLeaveMasterComponent } from "./earned-leave-master/earned-leave-master.component";
import { CanteenDeductionComponent } from "./canteen-deduction/canteen-deduction.component";
import { PayrollMasterComponent } from "./payroll-master/payroll-master.component";
import { PayscaleMasterComponent } from "./payscale-master/payscale-master.component";
import { BonusMasterComponent } from "./bonus-master/bonus-master.component";
import { HolidayMasterComponent } from "./holiday-master/holiday-master.component";
import { OTLimitMasterComponent } from "./otlimit-master/otlimit-master.component";
import { WeekOffMasterComponent } from "./week-off-master/week-off-master.component";
import { DeclaredCompOffComponent } from "./Alternate_Holiday-comp-off/Alternate_Holiday-comp-off.component";
import { DeclaredHolidayMasterComponent } from "./declared-holiday-master/declared-holiday-master.component";
import { ShiftCancelComponent } from "./shift-cancel/shift-cancel.component";
import { Admin_HrApp_Hr_Sup } from "./routes.gaurd/Role.guard";
import { Admin_HrApp_Hr } from "./routes.gaurd/Role.guard";
import { Admin_HrApp } from "./routes.gaurd/Role.guard";
import { Admin } from "./routes.gaurd/Role.guard";
import { Admin_Is_fin } from "./routes.gaurd/Role.guard";
import { BulkReviseSalaryComponent } from "./non-sap-salary/bulk-revise-salary/bulk-revise-salary.component";

import { EmpSalMasterComponent } from "./non-sap-salary/emp-sal-master/emp-sal-master.component";
import { ApprovalSalaryComponent } from "./non-sap-salary/approval-salary/approval-salary.component";
import { ApprovePayscaleComponent } from "./non-sap-salary/approve-payscale/approve-payscale.component";
import { ViewPayscaleComponent } from "./non-sap-salary/view-payscale/view-payscale.component";
import { OneTimeSalaryComponent } from "./one-time-salary/one-time-salary.component";
import { RevisePayscaleComponent } from "./non-sap-salary/revise-payscale/revise-payscale.component";
import { UpdatePayscaleComponent } from "./non-sap-salary/update-payscale/update-payscale.component";
import { EmpTwoRecordComponent } from "./emp-two-record/emp-two-record.component";
import { BillProcessedDateComponent } from "./bill-processed-date/bill-processed-date.component";
import { TransferPostingComponent } from "./transfer-posting/transfer-posting.component";
import { PayscaleHeaderMasterComponent } from "./non-sap-salary/payscale-header-master/payscale-header-master.component";
import { LeaveMasterComponent } from "./leave-master/leave-master.component";
import { ShiftChangeComponent } from "./shift-change/shift-change.component";
import { OneTimeSalaryApprovalComponent } from "./non-sap-salary/one-time-salary-approval/one-time-salary-approval.component";
import { CLSalaryReportComponent } from "./cl-salary-report/cl-salary-report.component";
import { IndirectHeadCountMasterComponent } from "./indirect-head-count-master/indirect-head-count-master.component";
/** #NEW CHANGES FROM RML */
import { PrEmployeeComponent } from "./pr-employee/pr-employee.component";
import { PrMachinePunchComponent } from "./pr-machine-punch/pr-machine-punch.component";
import { PrPresentAbsentComponent } from "./pr-present-absent/pr-present-absent.component";

const routes: Routes = [
  {
    path: "conemp",
    component: ContractorEmployeeComponent,
    canActivate: [Admin_HrApp_Hr_Sup],
  },

  {
    path: "newCon",
    component: ContractorOnboardComponent,
    canActivate: [Admin_HrApp_Hr],
  },
  /** NEW FROM RML */
   {
    path: "pr-employee",
    component: PrEmployeeComponent,
  },
  {
    path: "pr-present-absent",
    component: PrPresentAbsentComponent,
  },
  {
    path: "pr-machine-punch",
    component: PrMachinePunchComponent,
  },
  
  { path: "payroll", component: PayrollMasterComponent, canActivate: [Admin] },
  {
    path: "canteen",
    component: CanteenDeductionComponent,
    canActivate: [Admin],
  },
  { path: "payscale", 
    component: PayscaleMasterComponent 
  },
  { path: "bonus", component: BonusMasterComponent, canActivate: [Admin] },

  {
    path: "el_mst",
    component: EarnedLeaveMasterComponent,
    canActivate: [Admin],
  },
  {
    path: "fhday_mst",
    component: HolidayMasterComponent,
    canActivate: [Admin],
  },
  { path: "ot_mst", component: OTLimitMasterComponent, canActivate: [Admin] },
  {
    path: "w-off_mst",
    component: WeekOffMasterComponent,
    canActivate: [Admin],
  },
  {
    path: "dcoff_Mst",
    component: DeclaredCompOffComponent,
    canActivate: [Admin],
  },
  {
    path: "dh_day_mst",
    component: DeclaredHolidayMasterComponent,
    canActivate: [Admin],
  },
  { path: "shft_cancel", component: ShiftCancelComponent },
  { path: "shft_change", component: ShiftChangeComponent },
  {
    path: "trnsf_post",
    component: TransferPostingComponent,
    canActivate: [Admin],
  },
  {
    path: "bill_pros_dt",
    component: BillProcessedDateComponent,
    canActivate: [Admin],
  },
  { path: "emp_rec2", component: EmpTwoRecordComponent },
  { path: "upt_payscale", component: UpdatePayscaleComponent },

  { path: "bulk_rev_payscale", component: BulkReviseSalaryComponent },
  { path: "ont_salary", component: OneTimeSalaryComponent },
  { path: "ont_salary_approval", component: OneTimeSalaryApprovalComponent },
  { path: "Emp_Sal_Master", component: EmpSalMasterComponent },
  { path: "CL_Sal_Master", component: CLSalaryReportComponent },
  { path: "sal_header", component: PayscaleHeaderMasterComponent },
  {
    path: "rev_payscale/:apln_slno/:Con_ID/:gen_id/:apln_status/:PayScale_ID",
    component: RevisePayscaleComponent,
    canActivate: [Admin_HrApp_Hr],
  },
  {
    path: "updt_payscale/:apln_slno/:Con_ID/:gen_id/:apln_status/:Salary_Status",
    component: ViewPayscaleComponent,
    canActivate: [Admin_HrApp_Hr],
  },
  {
    path: "view_payscale/:view/:P_Id/:apln_slno/:Con_ID/:Effective_Date",
    component: ApprovePayscaleComponent,
    canActivate: [Admin_HrApp_Hr],
  },
  {
    path: "appr_payscale/:approve/:P_Id/:apln_slno/:Con_ID/:Effective_Date",
    component: ApprovePayscaleComponent,
    canActivate: [Admin_HrApp_Hr],
  },
  // { path:"mst_payscale/:master/:Payscale_Id/:Con_ID/:Effective_Date", component:ApprovePayscaleComponent,
  //   },
  {
    path: "apprl_salary",
    component: ApprovalSalaryComponent,
    canActivate: [Admin_HrApp_Hr],
  },
  { path: "mst_leave", component: LeaveMasterComponent },
  { path: "Indirect_HC", component: IndirectHeadCountMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewContractorModRoutingModule {}
