/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OcmComponent } from './ocm.component';

describe('OcmComponent', () => {
  let component: OcmComponent;
  let fixture: ComponentFixture<OcmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
