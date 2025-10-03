import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftUploadComponent } from './shift-upload.component';

describe('ShiftUploadComponent', () => {
  let component: ShiftUploadComponent;
  let fixture: ComponentFixture<ShiftUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
