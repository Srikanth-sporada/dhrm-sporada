import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLopApplyComponent } from './hr-lop-apply.component';

describe('HrLopApplyComponent', () => {
  let component: HrLopApplyComponent;
  let fixture: ComponentFixture<HrLopApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrLopApplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrLopApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
