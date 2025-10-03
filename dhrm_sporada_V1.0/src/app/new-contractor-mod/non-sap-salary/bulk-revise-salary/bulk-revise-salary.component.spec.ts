import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReviseSalaryComponent } from './bulk-revise-salary.component';

describe('BulkReviseSalaryComponent', () => {
  let component: BulkReviseSalaryComponent;
  let fixture: ComponentFixture<BulkReviseSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReviseSalaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkReviseSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
