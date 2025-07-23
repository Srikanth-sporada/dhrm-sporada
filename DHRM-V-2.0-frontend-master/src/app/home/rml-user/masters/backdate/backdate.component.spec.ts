/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BackdateComponent } from './backdate.component';

describe('BackdateComponent', () => {
  let component: BackdateComponent;
  let fixture: ComponentFixture<BackdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
