import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorQuestionComponent } from './supervisor-question.component';

describe('SupervisorQuestionComponent', () => {
  let component: SupervisorQuestionComponent;
  let fixture: ComponentFixture<SupervisorQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
