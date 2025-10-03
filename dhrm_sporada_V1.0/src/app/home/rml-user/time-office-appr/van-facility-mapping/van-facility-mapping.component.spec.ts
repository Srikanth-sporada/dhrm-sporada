import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanFacilityMappingComponent } from './van-facility-mapping.component';

describe('VanFacilityMappingComponent', () => {
  let component: VanFacilityMappingComponent;
  let fixture: ComponentFixture<VanFacilityMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanFacilityMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VanFacilityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
