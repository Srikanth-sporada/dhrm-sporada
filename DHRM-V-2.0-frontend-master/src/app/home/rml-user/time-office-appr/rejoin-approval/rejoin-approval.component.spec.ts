import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejoinApprovalComponent } from './rejoin-approval.component';

describe('RejoinApprovalComponent', () => {
  let component: RejoinApprovalComponent;
  let fixture: ComponentFixture<RejoinApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejoinApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejoinApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
