import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenBiRptComponent } from './canteen-bi-rpt.component';

describe('CanteenBiRptComponent', () => {
  let component: CanteenBiRptComponent;
  let fixture: ComponentFixture<CanteenBiRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenBiRptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenBiRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
