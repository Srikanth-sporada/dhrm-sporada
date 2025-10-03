import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisePayscaleComponent } from './revise-payscale.component';

describe('RevisePayscaleComponent', () => {
  let component: RevisePayscaleComponent;
  let fixture: ComponentFixture<RevisePayscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisePayscaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisePayscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
