import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAreaComponent } from './payroll-area.component';

describe('PayrollAreaComponent', () => {
  let component: PayrollAreaComponent;
  let fixture: ComponentFixture<PayrollAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
