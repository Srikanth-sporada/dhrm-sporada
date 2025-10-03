import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrSummaryComponent } from './hr-summary.component';

describe('HrSummaryComponent', () => {
  let component: HrSummaryComponent;
  let fixture: ComponentFixture<HrSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
