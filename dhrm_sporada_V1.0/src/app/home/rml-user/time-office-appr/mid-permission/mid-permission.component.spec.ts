import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidPermissionComponent } from './mid-permission.component';

describe('MidPermissionComponent', () => {
  let component: MidPermissionComponent;
  let fixture: ComponentFixture<MidPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
