/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OtapprAddComponent } from './otappr-add.component';

describe('OtapprAddComponent', () => {
  let component: OtapprAddComponent;
  let fixture: ComponentFixture<OtapprAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtapprAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtapprAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
