/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HrcompoffComponent } from './hrcompoff.component';

describe('HrcompoffComponent', () => {
  let component: HrcompoffComponent;
  let fixture: ComponentFixture<HrcompoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrcompoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrcompoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
