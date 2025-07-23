import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorEvaluationFormComponent } from './supervisor-evaluation-form.component';

describe('SupervisorEvaluationFormComponent', () => {
  let component: SupervisorEvaluationFormComponent;
  let fixture: ComponentFixture<SupervisorEvaluationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorEvaluationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorEvaluationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
