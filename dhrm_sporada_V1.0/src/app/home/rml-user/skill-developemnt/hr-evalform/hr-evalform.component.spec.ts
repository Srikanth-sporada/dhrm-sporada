import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HREvalformComponent } from './hr-evalform.component';

describe('HREvalformComponent', () => {
  let component: HREvalformComponent;
  let fixture: ComponentFixture<HREvalformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HREvalformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HREvalformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
