import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpTwoRecordComponent } from './emp-two-record.component';

describe('EmpTwoRecordComponent', () => {
  let component: EmpTwoRecordComponent;
  let fixture: ComponentFixture<EmpTwoRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpTwoRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpTwoRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
