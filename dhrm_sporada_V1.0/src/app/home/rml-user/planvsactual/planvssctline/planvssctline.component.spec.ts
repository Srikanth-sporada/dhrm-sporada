/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlanvssctlineComponent } from './planvssctline.component';

describe('PlanvssctlineComponent', () => {
  let component: PlanvssctlineComponent;
  let fixture: ComponentFixture<PlanvssctlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanvssctlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanvssctlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
