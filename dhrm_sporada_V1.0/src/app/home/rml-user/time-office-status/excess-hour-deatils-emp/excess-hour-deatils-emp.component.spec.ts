/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExcessHourDeatilsEmpComponent } from './excess-hour-deatils-emp.component';

describe('ExcessHourDeatilsEmpComponent', () => {
  let component: ExcessHourDeatilsEmpComponent;
  let fixture: ComponentFixture<ExcessHourDeatilsEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcessHourDeatilsEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcessHourDeatilsEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
