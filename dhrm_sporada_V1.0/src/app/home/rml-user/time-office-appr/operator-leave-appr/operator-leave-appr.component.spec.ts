import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorLeaveApprComponent } from './operator-leave-appr.component';

describe('OperatorLeaveApprComponent', () => {
  let component: OperatorLeaveApprComponent;
  let fixture: ComponentFixture<OperatorLeaveApprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorLeaveApprComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorLeaveApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
