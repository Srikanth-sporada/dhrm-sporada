/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NightCoffComponent } from './night-coff.component';

describe('NightCoffComponent', () => {
  let component: NightCoffComponent;
  let fixture: ComponentFixture<NightCoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NightCoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NightCoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
