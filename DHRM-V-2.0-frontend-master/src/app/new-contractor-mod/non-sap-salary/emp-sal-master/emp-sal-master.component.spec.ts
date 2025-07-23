import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSalMasterComponent } from './emp-sal-master.component';

describe('EmpSalMasterComponent', () => {
  let component: EmpSalMasterComponent;
  let fixture: ComponentFixture<EmpSalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpSalMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpSalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
