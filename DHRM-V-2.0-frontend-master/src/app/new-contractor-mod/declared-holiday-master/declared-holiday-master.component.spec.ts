import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaredHolidayMasterComponent } from './declared-holiday-master.component';

describe('DeclaredHolidayMasterComponent', () => {
  let component: DeclaredHolidayMasterComponent;
  let fixture: ComponentFixture<DeclaredHolidayMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclaredHolidayMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclaredHolidayMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
