import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLeaveApplyComponent } from './hr-leave-apply.component';

describe('HrLeaveApplyComponent', () => {
  let component: HrLeaveApplyComponent;
  let fixture: ComponentFixture<HrLeaveApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrLeaveApplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrLeaveApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
