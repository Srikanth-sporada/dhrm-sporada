/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OtpopupComponent } from './otpopup.component';

describe('OtpopupComponent', () => {
  let component: OtpopupComponent;
  let fixture: ComponentFixture<OtpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
