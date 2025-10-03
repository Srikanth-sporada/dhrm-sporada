import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionBankComponent } from './question-bank/question-bank.component';
import { TestEvaluationComponent } from './test-evaluation/test-evaluation.component';
import { TestResultSummaryComponent } from './test-result-summary/test-result-summary.component';
import { TraineeAnswerComponent } from './trainee-answer/trainee-answer.component';
import { TraineeScoreCardComponent } from './trainee-score-card/trainee-score-card.component';
import { TrainingModulesComponent } from './training-modules/training-modules.component';
import { SkillQuestionComponent } from './skill-question/skill-question.component';
import { SupervisorQuestionComponent } from './supervisor-question/supervisor-question.component';
import { SuperVisorAnswerComponent } from './super-visor-answer/super-visor-answer.component';
import { SupervisorEvaluationFormComponent } from './supervisor-evaluation-form/supervisor-evaluation-form.component';

const routes: Routes = [
  {
    path: 'question-bank',
    component: QuestionBankComponent
  },
  {
    path: 'test-evaluation',
    component: TestEvaluationComponent
  },
  {
    path: 'test-result-summary',
    component: TestResultSummaryComponent
  },
  {
    path: 'trainee-score-card/:trainee_idno/:fullname',
    component: TraineeScoreCardComponent
  },
  {
    path: 'training-modules',
    component: TrainingModulesComponent
  },
  {
    path: 'trainee-answer/:trainee_idno/:fullname/:module_name',
    component: TraineeAnswerComponent
  },
  {
    path: 'skill-question',
    component: SkillQuestionComponent
  },
  {
    path: 'Supervisor_Question',
    component: SupervisorQuestionComponent
  },
  // {
  //   path: 'Supervisor_Evaluation',
  //   component: SuperVisorAnswerComponent
  // },
  // {
  //   path: 'Supervisor_Evaluation_Form/:peval_slno/:dept/:user',
  //   component: SupervisorEvaluationFormComponent
  // }
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingDojoRoutingModule { }
