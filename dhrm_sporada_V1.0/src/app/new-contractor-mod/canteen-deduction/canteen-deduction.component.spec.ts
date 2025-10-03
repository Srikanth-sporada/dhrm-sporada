import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenDeductionComponent } from './canteen-deduction.component';

describe('CanteenDeductionComponent', () => {
  let component: CanteenDeductionComponent;
  let fixture: ComponentFixture<CanteenDeductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenDeductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
