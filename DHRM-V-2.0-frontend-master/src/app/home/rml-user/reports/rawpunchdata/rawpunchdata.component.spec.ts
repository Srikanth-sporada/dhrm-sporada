/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RawpunchdataComponent } from './rawpunchdata.component';

describe('RawpunchdataComponent', () => {
  let component: RawpunchdataComponent;
  let fixture: ComponentFixture<RawpunchdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawpunchdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawpunchdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
