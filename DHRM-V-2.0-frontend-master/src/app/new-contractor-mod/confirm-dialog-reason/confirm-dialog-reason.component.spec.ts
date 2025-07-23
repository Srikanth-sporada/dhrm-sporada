import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogReasonComponent } from './confirm-dialog-reason.component';

describe('ConfirmDialogReasonComponent', () => {
  let component: ConfirmDialogReasonComponent;
  let fixture: ComponentFixture<ConfirmDialogReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
