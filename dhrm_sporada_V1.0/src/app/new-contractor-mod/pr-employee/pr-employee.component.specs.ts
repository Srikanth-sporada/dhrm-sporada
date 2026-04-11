import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrEmployeeComponent } from './pr-employee.component';

describe('PrEmployeeComponent', () => {
  let component: PrEmployeeComponent;
  let fixture: ComponentFixture<PrEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
