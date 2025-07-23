import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTLimitMasterComponent } from './otlimit-master.component';

describe('OTLimitMasterComponent', () => {
  let component: OTLimitMasterComponent;
  let fixture: ComponentFixture<OTLimitMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTLimitMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OTLimitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
