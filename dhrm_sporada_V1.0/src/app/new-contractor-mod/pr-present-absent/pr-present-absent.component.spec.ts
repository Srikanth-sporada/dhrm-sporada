import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrPresentAbsentComponent } from './pr-present-absent.component';

describe('PrPresentAbsentComponent', () => {
  let component: PrPresentAbsentComponent;
  let fixture: ComponentFixture<PrPresentAbsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrPresentAbsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrPresentAbsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
