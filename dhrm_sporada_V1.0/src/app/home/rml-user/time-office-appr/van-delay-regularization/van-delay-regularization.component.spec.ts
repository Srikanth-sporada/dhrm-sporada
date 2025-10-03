import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanDelayRegularizationComponent } from './van-delay-regularization.component';

describe('VanDelayRegularizationComponent', () => {
  let component: VanDelayRegularizationComponent;
  let fixture: ComponentFixture<VanDelayRegularizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanDelayRegularizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VanDelayRegularizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
