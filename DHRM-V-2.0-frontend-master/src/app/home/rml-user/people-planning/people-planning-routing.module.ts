import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MonthlyPlanningComponent } from "./monthly-planning/monthly-planning.component";
import { PeoplePlanningReportComponent } from "./people-planning-report/people-planning-report.component";
import { UploadPlanningComponent } from "./upload-planning/upload-planning.component";
import { ShiftUploadComponent } from "./shift-upload/shift-upload.component";

const routes: Routes = [
  {
    path: "monthly",
    component: MonthlyPlanningComponent,
  },
  {
    path: "actualxplanned",
    component: PeoplePlanningReportComponent,
  },
  { path: "upload", component: UploadPlanningComponent },
  {
    path: "shift",
    component: ShiftUploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeoplePlanningRoutingModule {}
