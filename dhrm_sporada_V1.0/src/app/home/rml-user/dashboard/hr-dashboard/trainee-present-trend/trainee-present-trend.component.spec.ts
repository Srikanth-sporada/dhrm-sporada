import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineePresentTrendComponent } from './trainee-present-trend.component';

describe('TraineePresentTrendComponent', () => {
  let component: TraineePresentTrendComponent;
  let fixture: ComponentFixture<TraineePresentTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineePresentTrendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineePresentTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
