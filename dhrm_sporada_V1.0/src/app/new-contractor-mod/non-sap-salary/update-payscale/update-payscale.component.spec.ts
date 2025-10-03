import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePayscaleComponent } from './update-payscale.component';

describe('UpdatePayscaleComponent', () => {
  let component: UpdatePayscaleComponent;
  let fixture: ComponentFixture<UpdatePayscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePayscaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePayscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
