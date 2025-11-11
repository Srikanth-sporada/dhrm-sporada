import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RmlUserRoutingModule } from "./rml-user-routing.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CompanyComponent } from "./masters/company/company.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { DeptComponent } from "./masters/dept/dept.component";
import { MatTableModule } from "@angular/material/table";
import { MatDividerModule } from "@angular/material/divider";
import { PlantComponent } from "./masters/plant/plant.component";
import { LineComponent } from "./masters/line/line.component";
import { DesignationComponent } from "./masters/designation/designation.component";
import { TraineecategoryComponent } from "./masters/traineecategory/traineecategory.component";
import { BankComponent } from "./masters/bank/bank.component";
import { LoginModule } from "./login/login.module";
import { OperationsComponent } from "./masters/operations/operations.component";
import { PincodeComponent } from "./masters/pincode/pincode.component";
import { EmployeeComponent } from "./masters/employee/employee.component";
import { ShiftComponent } from "./masters/shift/shift.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SkillDevelopemntModule } from "./skill-developemnt/skill-developemnt.module";
import { ArsLoginComponent } from "./ars-login/ars-login.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NewContractorModModule } from "src/app/new-contractor-mod/new-contractor-mod.module";
import { PlanvsactualComponent } from "./planvsactual/planvsactual.component";
import { FormsModule } from "@angular/forms";
import { DirectandindirectComponent } from "./planvsactual/directandindirect/directandindirect.component";
import { NgChartsModule } from "ng2-charts";
import { PlanvsactdeptComponent } from "./planvsactual/planvsactdept/planvsactdept.component";
import { PlanvssctlineComponent } from "./planvsactual/planvssctline/planvssctline.component";
import { BackdateComponent } from "./masters/backdate/backdate.component";
import { BackdatePopupComponent } from "./masters/backdate/backdate-popup/backdate-popup.component";
import { OcmComponent } from "./ocm/ocm.component";
import { ExcessHoursChartComponent } from "./ocm/excess-hours-chart/excess-hours-chart.component";
import { MissPicnhTrendComponent } from "./ocm/miss-picnh-trend/miss-picnh-trend.component";
import { ContworkingComponent } from "./ocm/contworking/contworking.component";
import { CanteenBiRptComponent } from './dashboard/canteen-bi-rpt/canteen-bi-rpt.component';
import { HrSummaryComponent } from './dashboard/hr-summary/hr-summary.component';
import { MonthFilterPipe,IN_PlantFilterPipe} from "src/app/new-contractor-mod/Shared/filters";
import { DeptFilterPipe } from "src/app/new-contractor-mod/Shared/filters";
import { CorpHRDashboardComponent } from "./dashboard/corp-hr-dashboard/corp-hr-dashboard.component";
import { IndirectHeadCountMasterComponent } from "src/app/new-contractor-mod/indirect-head-count-master/indirect-head-count-master.component";
import { BillProcessedDateComponent } from "src/app/new-contractor-mod/bill-processed-date/bill-processed-date.component";
import { DeclaredCompOffComponent } from "src/app/new-contractor-mod/Alternate_Holiday-comp-off/Alternate_Holiday-comp-off.component";
import { HolidayMasterComponent } from "src/app/new-contractor-mod/holiday-master/holiday-master.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { SpeedDialModule } from "primeng/speeddial";
import { TabViewModule } from "primeng/tabview";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ChartModule } from 'primeng/chart';
import { FormatTimePipe } from "src/app/pipes/format-time.pipe";
import { PayrollAreaComponent } from "./masters/payroll-area/payroll-area.component";
import { CostCenterComponent } from "./masters/cost-center/cost-center.component";
@NgModule({
  declarations: [
    CompanyComponent,
    DeptComponent,
    PlantComponent,
    LineComponent,
    DesignationComponent,
    TraineecategoryComponent,
    BankComponent,
    OperationsComponent,
    PincodeComponent,
    EmployeeComponent,
    ShiftComponent,
    ArsLoginComponent,
    PlanvsactualComponent,
    DirectandindirectComponent,
    PlanvsactdeptComponent,
    PlanvssctlineComponent,
    BackdateComponent,
    BackdatePopupComponent,
    OcmComponent,
    ExcessHoursChartComponent,
    MissPicnhTrendComponent,
    ContworkingComponent,
    CanteenBiRptComponent,
    HrSummaryComponent,
    CorpHRDashboardComponent,
    HolidayMasterComponent,
    DeclaredCompOffComponent,
    BillProcessedDateComponent,
    IndirectHeadCountMasterComponent,
    // new components
    PayrollAreaComponent,
    CostCenterComponent,
    MonthFilterPipe,
    DeptFilterPipe,
    IN_PlantFilterPipe,
    FormatTimePipe
  ],
  imports: [
    CommonModule,
    LoginModule,
    RmlUserRoutingModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    FlexLayoutModule,
    SkillDevelopemntModule,
    ScrollingModule,
    // NewContractorModModule,
    FormsModule,
    NgChartsModule,
    MatTabsModule,
    MatDatepickerModule,
    SpeedDialModule,
    TabViewModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    FileUploadModule,
    InputTextModule,
    CheckboxModule,
    ChartModule,
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RmlUserModule {}
