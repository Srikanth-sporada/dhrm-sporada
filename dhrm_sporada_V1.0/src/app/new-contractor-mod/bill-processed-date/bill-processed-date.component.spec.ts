import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillProcessedDateComponent } from './bill-processed-date.component';

describe('BillProcessedDateComponent', () => {
  let component: BillProcessedDateComponent;
  let fixture: ComponentFixture<BillProcessedDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillProcessedDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillProcessedDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
