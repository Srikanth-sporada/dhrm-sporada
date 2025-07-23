import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejoinProcessComponent } from './rejoin-process.component';

describe('RejoinProcessComponent', () => {
  let component: RejoinProcessComponent;
  let fixture: ComponentFixture<RejoinProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejoinProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejoinProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
