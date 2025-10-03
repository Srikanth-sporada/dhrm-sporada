import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpHRDashboardComponent } from './corp-hr-dashboard.component';

describe('CorpHRDashboardComponent', () => {
  let component: CorpHRDashboardComponent;
  let fixture: ComponentFixture<CorpHRDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorpHRDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpHRDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
