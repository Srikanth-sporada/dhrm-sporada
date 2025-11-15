import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeHeadCountSummaryComponent } from './trainee-head-count-summary.component';

describe('TraineeHeadCountSummaryComponent', () => {
  let component: TraineeHeadCountSummaryComponent;
  let fixture: ComponentFixture<TraineeHeadCountSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineeHeadCountSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeHeadCountSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
