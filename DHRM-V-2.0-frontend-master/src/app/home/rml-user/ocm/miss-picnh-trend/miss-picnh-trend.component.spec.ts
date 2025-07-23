/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MissPicnhTrendComponent } from './miss-picnh-trend.component';

describe('MissPicnhTrendComponent', () => {
  let component: MissPicnhTrendComponent;
  let fixture: ComponentFixture<MissPicnhTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissPicnhTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissPicnhTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
