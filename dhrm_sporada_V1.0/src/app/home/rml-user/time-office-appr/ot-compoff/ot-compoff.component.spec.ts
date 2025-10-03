/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OtCompoffComponent } from './ot-compoff.component';

describe('OtCompoffComponent', () => {
  let component: OtCompoffComponent;
  let fixture: ComponentFixture<OtCompoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtCompoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtCompoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
