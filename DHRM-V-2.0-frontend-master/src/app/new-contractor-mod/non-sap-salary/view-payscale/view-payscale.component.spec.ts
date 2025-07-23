import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayscaleComponent } from './view-payscale.component';

describe('ViewPayscaleComponent', () => {
  let component: ViewPayscaleComponent;
  let fixture: ComponentFixture<ViewPayscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPayscaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPayscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
