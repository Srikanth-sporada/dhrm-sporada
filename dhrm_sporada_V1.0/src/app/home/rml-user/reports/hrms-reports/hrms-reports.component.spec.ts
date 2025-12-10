import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmsReportsComponent } from './hrms-reports.component';

describe('HrmsReportsComponent', () => {
  let component: HrmsReportsComponent;
  let fixture: ComponentFixture<HrmsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrmsReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrmsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
