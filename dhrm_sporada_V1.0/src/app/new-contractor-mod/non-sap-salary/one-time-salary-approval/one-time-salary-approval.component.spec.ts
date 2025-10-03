import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimeSalaryApprovalComponent } from './one-time-salary-approval.component';

describe('OneTimeSalaryApprovalComponent', () => {
  let component: OneTimeSalaryApprovalComponent;
  let fixture: ComponentFixture<OneTimeSalaryApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneTimeSalaryApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneTimeSalaryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
