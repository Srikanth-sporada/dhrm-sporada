import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelPopupComponent } from './del-popup.component';

describe('DelPopupComponent', () => {
  let component: DelPopupComponent;
  let fixture: ComponentFixture<DelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
