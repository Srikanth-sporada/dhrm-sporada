import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayscaleHeaderMasterComponent } from './payscale-header-master.component';

describe('PayscaleHeaderMasterComponent', () => {
  let component: PayscaleHeaderMasterComponent;
  let fixture: ComponentFixture<PayscaleHeaderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayscaleHeaderMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayscaleHeaderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
