import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillDevelopemntRoutingModule } from './skill-developemnt-routing.module';
import { TrainerEvaluationComponent } from './trainer-evaluation/trainer-evaluation.component';
import {MatIconModule} from "@angular/material/icon";
import { SupervisorEvaluationComponent } from './supervisor-evaluation/supervisor-evaluation.component';
import { EvaluatonDueComponent } from './evaluaton-due/evaluaton-due.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatStepperModule} from "@angular/material/stepper";
import { FilterPipe } from './filter.pipe';
import { LoadModule } from 'src/app/loader/loader.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DeptfilterPipe } from './deptfilter.pipe';
import { LinefilterPipe } from './linefilter.pipe';
import { SkillViewComponent } from './skill-view/skill-view.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SkillTestComponent } from './skill-test/skill-test.component';
import { SkillPaperComponent } from './skill-paper/skill-paper.component';
import { AnswerSheetComponent } from './answer-sheet/answer-sheet.component';
import { AbserSheetComponent } from './abser-sheet/abser-sheet.component';
import { HREvalformComponent } from './hr-evalform/hr-evalform.component';
import { SkillMatrixComponent } from './skill-matrix/skill-matrix.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OldSkillTestComponent } from './old-skill-test/old-skill-test.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [
    TrainerEvaluationComponent,
    SupervisorEvaluationComponent,
    EvaluatonDueComponent,
    EvaluationFormComponent,
    FilterPipe,
    DeptfilterPipe,
    LinefilterPipe,
    SkillViewComponent,
    SkillTestComponent,
    SkillPaperComponent,
    AnswerSheetComponent,
    AbserSheetComponent,
    HREvalformComponent,
    SkillMatrixComponent,
    OldSkillTestComponent
  
  ],
  imports: [
    CommonModule,
    SkillDevelopemntRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
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
    FormsModule,
    LoadModule,
    ScrollingModule,
    MatTabsModule,
    NgbPaginationModule,
    MatProgressSpinnerModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    CalendarModule, 
    MultiSelectModule,
  ]
})
export class SkillDevelopemntModule { }
