import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveDaysMappingComponent } from './five-days-mapping.component';

describe('FiveDaysMappingComponent', () => {
  let component: FiveDaysMappingComponent;
  let fixture: ComponentFixture<FiveDaysMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiveDaysMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiveDaysMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
