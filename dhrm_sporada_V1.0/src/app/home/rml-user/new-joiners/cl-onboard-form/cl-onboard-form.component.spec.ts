import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClOnboardFormComponent } from './cl-onboard-form.component';

describe('ClOnboardFormComponent', () => {
  let component: ClOnboardFormComponent;
  let fixture: ComponentFixture<ClOnboardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClOnboardFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClOnboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
