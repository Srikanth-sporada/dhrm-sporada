import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusMasterComponent } from './bonus-master.component';

describe('BonusMasterComponent', () => {
  let component: BonusMasterComponent;
  let fixture: ComponentFixture<BonusMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
