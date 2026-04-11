import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrMachinePunchComponent } from './pr-machine-punch.component';

describe('PrMachinePunchComponent', () => {
  let component: PrMachinePunchComponent;
  let fixture: ComponentFixture<PrMachinePunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrMachinePunchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrMachinePunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
