import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOfficeApprovalLoaderComponent } from './time-office-approval-loader.component';

describe('TimeOfficeApprovalLoaderComponent', () => {
  let component: TimeOfficeApprovalLoaderComponent;
  let fixture: ComponentFixture<TimeOfficeApprovalLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeOfficeApprovalLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeOfficeApprovalLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
