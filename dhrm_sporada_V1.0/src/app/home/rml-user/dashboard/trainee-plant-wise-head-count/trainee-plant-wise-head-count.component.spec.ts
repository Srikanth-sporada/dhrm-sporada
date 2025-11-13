import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineePlantWiseHeadCountComponent } from './trainee-plant-wise-head-count.component';

describe('TraineePlantWiseHeadCountComponent', () => {
  let component: TraineePlantWiseHeadCountComponent;
  let fixture: ComponentFixture<TraineePlantWiseHeadCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineePlantWiseHeadCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineePlantWiseHeadCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
