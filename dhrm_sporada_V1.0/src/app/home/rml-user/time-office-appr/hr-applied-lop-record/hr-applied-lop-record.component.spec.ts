import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAppliedLopRecordComponent } from './hr-applied-lop-record.component';

describe('HrAppliedLopRecordComponent', () => {
  let component: HrAppliedLopRecordComponent;
  let fixture: ComponentFixture<HrAppliedLopRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrAppliedLopRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrAppliedLopRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
