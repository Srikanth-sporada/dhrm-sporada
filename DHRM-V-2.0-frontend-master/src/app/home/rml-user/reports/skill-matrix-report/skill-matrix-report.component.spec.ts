import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillMatrixReportComponent } from './skill-matrix-report.component';

describe('SkillMatrixReportComponent', () => {
  let component: SkillMatrixReportComponent;
  let fixture: ComponentFixture<SkillMatrixReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillMatrixReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillMatrixReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
