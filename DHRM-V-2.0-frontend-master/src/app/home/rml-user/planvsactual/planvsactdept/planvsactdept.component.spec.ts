/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlanvsactdeptComponent } from './planvsactdept.component';

describe('PlanvsactdeptComponent', () => {
  let component: PlanvsactdeptComponent;
  let fixture: ComponentFixture<PlanvsactdeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanvsactdeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanvsactdeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
