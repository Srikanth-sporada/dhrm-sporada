import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
 import { ClipboardModule } from '@angular/cdk/clipboard';
import { CategoryLinePipe } from './category-line.pipe';
import { ReportsRoutingModule } from "./reports-routing.module";
import { EvaluationDueReportComponent } from "./evaluation-due-report/evaluation-due-report.component";
import { TestSummaryReportComponent } from "./test-summary-report/test-summary-report.component";
import { TraineeAplnReportComponent } from "./trainee-apln-report/trainee-apln-report.component";
import { MatTableModule } from "@angular/material/table";
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RawpunchdataComponent } from "./rawpunchdata/rawpunchdata.component";
import { LoadModule } from "src/app/loader/loader.module";
import { SwipidPipe } from "./rawpunchdata/swipid.pipe";
import { MusterreportComponent } from "./musterreport/musterreport.component";
import { ArsReportsComponent } from "./ars-reports/ars-reports.component";
import {AtndreportComponent} from "./atndreport/atndreport.component";
import { CanteenReportsComponent } from './canteen-reports/canteen-reports.component';
import { SkillMatrixReportComponent } from './skill-matrix-report/skill-matrix-report.component';
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from "primeng/overlaypanel";
import { AccordionModule } from 'primeng/accordion';
import { CummulativeReportComponent } from "./cummulative-report/cummulative-report.component";
import { LopReportComponent } from "./lop-report/lop-report.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ReportsLoaderComponent } from "./reports-loader/reports-loader.component";
@NgModule({
  declarations: [
    EvaluationDueReportComponent,
    TestSummaryReportComponent,
    TraineeAplnReportComponent,
    RawpunchdataComponent,
    SwipidPipe,
    MusterreportComponent,
    ArsReportsComponent,
    AtndreportComponent,
    CategoryLinePipe,
    CanteenReportsComponent,
    SkillMatrixReportComponent,
    CummulativeReportComponent,
    LopReportComponent,
    ReportsLoaderComponent,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    ReportsRoutingModule,
    ScrollingModule,
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
    FormsModule,
    MatNativeDateModule,
    MatDividerModule,
    MatProgressBarModule,
    LoadModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    OverlayPanelModule,
    AccordionModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsModule {}
