/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LineatndReportComponent } from './lineatndReport.component';

describe('LineatndReportComponent', () => {
  let component: LineatndReportComponent;
  let fixture: ComponentFixture<LineatndReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineatndReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineatndReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
