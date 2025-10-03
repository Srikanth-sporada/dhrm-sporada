import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalSalaryComponent } from './approval-salary.component';

describe('ApprovalSalaryComponent', () => {
  let component: ApprovalSalaryComponent;
  let fixture: ComponentFixture<ApprovalSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalSalaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
