/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlanvsactualComponent } from './planvsactual.component';

describe('PlanvsactualComponent', () => {
  let component: PlanvsactualComponent;
  let fixture: ComponentFixture<PlanvsactualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanvsactualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanvsactualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
