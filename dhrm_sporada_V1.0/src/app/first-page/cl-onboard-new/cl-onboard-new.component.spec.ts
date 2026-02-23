import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClOnboardNewComponent } from './cl-onboard-new.component';

describe('ClOnboardNewComponent', () => {
  let component: ClOnboardNewComponent;
  let fixture: ComponentFixture<ClOnboardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClOnboardNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClOnboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
