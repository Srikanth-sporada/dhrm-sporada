import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePayscaleComponent } from './approve-payscale.component';

describe('ApprovePayscaleComponent', () => {
  let component: ApprovePayscaleComponent;
  let fixture: ComponentFixture<ApprovePayscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePayscaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovePayscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
