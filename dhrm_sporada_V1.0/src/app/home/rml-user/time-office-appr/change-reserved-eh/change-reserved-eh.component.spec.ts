import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReservedEhComponent } from './change-reserved-eh.component';

describe('ChangeReservedEhComponent', () => {
  let component: ChangeReservedEhComponent;
  let fixture: ComponentFixture<ChangeReservedEhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeReservedEhComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeReservedEhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
