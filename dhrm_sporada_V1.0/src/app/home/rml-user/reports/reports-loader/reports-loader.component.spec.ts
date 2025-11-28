import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsLoaderComponent } from './reports-loader.component';

describe('ReportsLoaderComponent', () => {
  let component: ReportsLoaderComponent;
  let fixture: ComponentFixture<ReportsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
