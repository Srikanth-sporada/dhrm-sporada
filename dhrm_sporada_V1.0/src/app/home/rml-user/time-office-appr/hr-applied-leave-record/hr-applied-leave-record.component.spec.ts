import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAppliedLeaveRecordComponent } from './hr-applied-leave-record.component';

describe('HrAppliedLeaveRecordComponent', () => {
  let component: HrAppliedLeaveRecordComponent;
  let fixture: ComponentFixture<HrAppliedLeaveRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrAppliedLeaveRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrAppliedLeaveRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
