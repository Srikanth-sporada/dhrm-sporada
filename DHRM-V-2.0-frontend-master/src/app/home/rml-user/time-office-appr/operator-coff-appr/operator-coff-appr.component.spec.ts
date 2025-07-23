import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorCoffApprComponent } from './operator-coff-appr.component';

describe('OperatorCoffApprComponent', () => {
  let component: OperatorCoffApprComponent;
  let fixture: ComponentFixture<OperatorCoffApprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorCoffApprComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorCoffApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
