import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArsDumbComponent } from './admin-ars-dumb.component';

describe('AdminArsDumbComponent', () => {
  let component: AdminArsDumbComponent;
  let fixture: ComponentFixture<AdminArsDumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminArsDumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminArsDumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
