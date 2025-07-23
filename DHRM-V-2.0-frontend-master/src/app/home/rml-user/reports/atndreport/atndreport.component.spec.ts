/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AtndreportComponent } from './atndreport.component';

describe('AtndreportComponent', () => {
  let component: AtndreportComponent;
  let fixture: ComponentFixture<AtndreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtndreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtndreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
