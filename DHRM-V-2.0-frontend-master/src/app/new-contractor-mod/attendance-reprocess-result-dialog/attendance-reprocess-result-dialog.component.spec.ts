import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceReprocessResultDialogComponent } from './attendance-reprocess-result-dialog.component';

describe('AttendanceReprocessResultDialogComponent', () => {
  let component: AttendanceReprocessResultDialogComponent;
  let fixture: ComponentFixture<AttendanceReprocessResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceReprocessResultDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceReprocessResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
