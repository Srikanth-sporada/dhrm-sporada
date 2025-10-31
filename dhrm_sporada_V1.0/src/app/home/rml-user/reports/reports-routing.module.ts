import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationDueReportComponent } from './evaluation-due-report/evaluation-due-report.component';
import { TestSummaryReportComponent } from './test-summary-report/test-summary-report.component';
import { TraineeAplnReportComponent } from './trainee-apln-report/trainee-apln-report.component';
import { RawpunchdataComponent } from './rawpunchdata/rawpunchdata.component';
import { MusterreportComponent } from './musterreport/musterreport.component';
import { ArsReportsComponent } from './ars-reports/ars-reports.component';
import {AtndreportComponent} from "./atndreport/atndreport.component"
import { CanteenReportsComponent } from './canteen-reports/canteen-reports.component';
import { SkillMatrixReportComponent } from './skill-matrix-report/skill-matrix-report.component';
/** new reports */
import { CummulativeReportComponent } from './cummulative-report/cummulative-report.component';
import { LopReportComponent } from './lop-report/lop-report.component';

const routes: Routes = [

  {
    path: 'trainee-apln-report',
    component: TraineeAplnReportComponent
  },
  {
    path: 'evaluation-due-report',
    component: EvaluationDueReportComponent
  },
  {
    path: 'test-summary-report',
    component: TestSummaryReportComponent
  },
  {
    path: 'rawpunch',
    component: RawpunchdataComponent
  },{
    path:'atndReport',
    component:AtndreportComponent
  },
  {
    path:'arsreports',
    component:ArsReportsComponent
  },
  {
    path:'cntRpt',
    component:CanteenReportsComponent
  },
  {
    path:'Skill-Matrix-Report',
    component:SkillMatrixReportComponent
  },
  {
    path:'cummulativereport',
    component:CummulativeReportComponent
  },
  {
    path:'lopreport',
    component:LopReportComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule { }
