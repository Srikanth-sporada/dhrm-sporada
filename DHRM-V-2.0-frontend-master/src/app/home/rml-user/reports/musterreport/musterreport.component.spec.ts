/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MusterreportComponent } from './musterreport.component';

describe('MusterreportComponent', () => {
  let component: MusterreportComponent;
  let fixture: ComponentFixture<MusterreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusterreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusterreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
