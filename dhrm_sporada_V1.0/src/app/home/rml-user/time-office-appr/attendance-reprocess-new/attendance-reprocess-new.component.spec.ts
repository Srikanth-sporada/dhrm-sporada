import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceReprocessNewComponent } from './attendance-reprocess-new.component';

describe('AttendanceReprocessNewComponent', () => {
  let component: AttendanceReprocessNewComponent;
  let fixture: ComponentFixture<AttendanceReprocessNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceReprocessNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceReprocessNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
