import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenReportsComponent } from './canteen-reports.component';

describe('CanteenReportsComponent', () => {
  let component: CanteenReportsComponent;
  let fixture: ComponentFixture<CanteenReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
