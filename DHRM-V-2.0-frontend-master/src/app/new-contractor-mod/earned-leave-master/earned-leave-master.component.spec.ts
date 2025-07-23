import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnedLeaveMasterComponent } from './earned-leave-master.component';

describe('EarnedLeaveMasterComponent', () => {
  let component: EarnedLeaveMasterComponent;
  let fixture: ComponentFixture<EarnedLeaveMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarnedLeaveMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarnedLeaveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
