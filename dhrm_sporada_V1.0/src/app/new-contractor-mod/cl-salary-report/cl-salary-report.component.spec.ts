import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLSalaryReportComponent } from './cl-salary-report.component1';

describe('CLSalaryReportComponent', () => {
  let component: CLSalaryReportComponent;
  let fixture: ComponentFixture<CLSalaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CLSalaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLSalaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
