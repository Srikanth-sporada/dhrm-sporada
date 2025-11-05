import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullMonthLopComponent } from './full-month-lop.component';

describe('FullMonthLopComponent', () => {
  let component: FullMonthLopComponent;
  let fixture: ComponentFixture<FullMonthLopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullMonthLopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullMonthLopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
