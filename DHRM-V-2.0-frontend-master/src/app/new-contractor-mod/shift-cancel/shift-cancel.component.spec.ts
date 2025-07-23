import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCancelComponent } from './shift-cancel.component';

describe('ShiftCancelComponent', () => {
  let component: ShiftCancelComponent;
  let fixture: ComponentFixture<ShiftCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
