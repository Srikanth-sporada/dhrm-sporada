import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessHourChartLargerComponent } from './excess-hour-chart-larger.component';

describe('ExcessHourChartLargerComponent', () => {
  let component: ExcessHourChartLargerComponent;
  let fixture: ComponentFixture<ExcessHourChartLargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcessHourChartLargerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcessHourChartLargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
