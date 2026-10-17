import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffReservedHoursComponent } from './coff-reserved-hours.component';

describe('CoffReservedHoursComponent', () => {
  let component: CoffReservedHoursComponent;
  let fixture: ComponentFixture<CoffReservedHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoffReservedHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoffReservedHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
