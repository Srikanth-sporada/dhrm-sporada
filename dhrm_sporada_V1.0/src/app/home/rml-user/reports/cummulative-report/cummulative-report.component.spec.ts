import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CummulativeReportComponent } from './cummulative-report.component';

describe('CummulativeReportComponent', () => {
  let component: CummulativeReportComponent;
  let fixture: ComponentFixture<CummulativeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CummulativeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CummulativeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
