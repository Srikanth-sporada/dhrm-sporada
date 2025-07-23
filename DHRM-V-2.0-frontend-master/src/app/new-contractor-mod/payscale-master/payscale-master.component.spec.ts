import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayscaleMasterComponent } from './payscale-master.component';

describe('PayscaleMasterComponent', () => {
  let component: PayscaleMasterComponent;
  let fixture: ComponentFixture<PayscaleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayscaleMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayscaleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
