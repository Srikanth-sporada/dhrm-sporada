import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorOnboardComponent } from './contractor-onboard.component';

describe('ContractorOnboardComponent', () => {
  let component: ContractorOnboardComponent;
  let fixture: ComponentFixture<ContractorOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorOnboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
