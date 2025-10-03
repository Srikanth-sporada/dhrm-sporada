import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollDisplayFormComponent } from './payroll-display-form.component';

describe('PayrollDisplayFormComponent', () => {
  let component: PayrollDisplayFormComponent;
  let fixture: ComponentFixture<PayrollDisplayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollDisplayFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollDisplayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
