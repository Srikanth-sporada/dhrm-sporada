/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContworkingComponent } from './contworking.component';

describe('ContworkingComponent', () => {
  let component: ContworkingComponent;
  let fixture: ComponentFixture<ContworkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContworkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContworkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
