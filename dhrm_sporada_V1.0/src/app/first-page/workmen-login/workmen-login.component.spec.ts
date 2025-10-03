import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkmenLoginComponent } from './workmen-login.component';

describe('WorkmenLoginComponent', () => {
  let component: WorkmenLoginComponent;
  let fixture: ComponentFixture<WorkmenLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkmenLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkmenLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
