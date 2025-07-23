/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OtApprComponent } from './Ot-appr.component';

describe('OtApprComponent', () => {
  let component: OtApprComponent;
  let fixture: ComponentFixture<OtApprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtApprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
