import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectHeadCountMasterComponent } from './indirect-head-count-master.component';

describe('IndirectHeadCountMasterComponent', () => {
  let component: IndirectHeadCountMasterComponent;
  let fixture: ComponentFixture<IndirectHeadCountMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndirectHeadCountMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndirectHeadCountMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
