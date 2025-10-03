import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekOffMasterComponent } from './week-off-master.component';

describe('WeekOffMasterComponent', () => {
  let component: WeekOffMasterComponent;
  let fixture: ComponentFixture<WeekOffMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekOffMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekOffMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
