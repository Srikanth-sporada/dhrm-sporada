import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimeSalaryComponent } from './one-time-salary.component';

describe('OneTimeSalaryComponent', () => {
  let component: OneTimeSalaryComponent;
  let fixture: ComponentFixture<OneTimeSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneTimeSalaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneTimeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
