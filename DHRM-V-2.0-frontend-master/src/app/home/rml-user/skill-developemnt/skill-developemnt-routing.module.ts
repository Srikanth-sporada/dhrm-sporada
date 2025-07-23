import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRouteSnapshot, RouteReuseStrategy } from '@angular/router';
import { TrainerEvaluationComponent } from './trainer-evaluation/trainer-evaluation.component';
import {MatIconModule} from "@angular/material/icon";
import { SupervisorEvaluationComponent } from './supervisor-evaluation/supervisor-evaluation.component';
import { EvaluatonDueComponent } from './evaluaton-due/evaluaton-due.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { SkillDevHR, SkillDevSupervisor} from '../../Guards/SkillDev.guard';
import { SkillViewComponent } from './skill-view/skill-view.component';
import { SkillTestComponent } from './skill-test/skill-test.component';
import { SkillPaperComponent } from './skill-paper/skill-paper.component';
import { AnswerSheetComponent } from './answer-sheet/answer-sheet.component';
import { AbserSheetComponent } from './abser-sheet/abser-sheet.component';
import { HREvalformComponent } from './hr-evalform/hr-evalform.component';
import { SkillMatrixComponent } from './skill-matrix/skill-matrix.component';
import { OldSkillTestComponent } from './old-skill-test/old-skill-test.component';
import { SuperVisorAnswerComponent } from '../training-dojo/super-visor-answer/super-visor-answer.component';
import { SupervisorEvaluationFormComponent } from '../training-dojo/supervisor-evaluation-form/supervisor-evaluation-form.component';
import { OperationsComponent } from '../masters/operations/operations.component';



// export class CustomRouteReuseStrategy extends RouteReuseStrategy {

//   shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//     return false;
//   }


const routes: Routes = [
  {
    path:'trainer-evaluation',
    component:TrainerEvaluationComponent,
    data: {reuse : false},
    canActivate:[SkillDevHR]

  },
  {
    path:'supervisor-evaluation',
    component:SupervisorEvaluationComponent,
    canActivate: [SkillDevSupervisor]
  },  
  {
    path:'evaluation-due',
    component:EvaluatonDueComponent,
  },
  {
    path:'evaluation-form/:id/:eval/:nav',
    component: EvaluationFormComponent,
  },
  {
    path:'skill-view',
    component: SkillViewComponent,
  },
  {
    path:'skill-test',
    component: SkillTestComponent
  },
  {
    path:'skill-test/:id/:level',
    component: SkillPaperComponent
  },
  {
    path: 'answer-paper/:id',
    component: AnswerSheetComponent
  },
  {
    path: 'Abserv-point/:id',
    component: AbserSheetComponent
  },
  {
    path: 'Skill-Matrix',
    component: SkillMatrixComponent
  },
  {
    path: 'HR-Evaluation/:peval',
    component: HREvalformComponent
  },
  {
    path: 'Old-HR-Evaluation/:peval',
    component: OldSkillTestComponent
  },
  {
    path: 'Supervisor_Evaluation',
    component: SuperVisorAnswerComponent
  },
  {
    path: 'Supervisor_Evaluation_Form/:peval_slno/:dept/:user',
    component: SupervisorEvaluationFormComponent
  },
  {
    path: 'Operations',
    component: OperationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillDevelopemntRoutingModule {

 }
