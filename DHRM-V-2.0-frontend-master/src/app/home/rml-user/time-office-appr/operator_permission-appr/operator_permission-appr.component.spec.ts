import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptrApprComponent } from './operator_permission-appr.component';

describe('OdApprComponent', () => {
  let component: OptrApprComponent;
  let fixture: ComponentFixture<OptrApprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptrApprComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptrApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
