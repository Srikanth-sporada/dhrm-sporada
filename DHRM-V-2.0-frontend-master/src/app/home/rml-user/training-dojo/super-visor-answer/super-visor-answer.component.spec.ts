import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperVisorAnswerComponent } from './super-visor-answer.component';

describe('SuperVisorAnswerComponent', () => {
  let component: SuperVisorAnswerComponent;
  let fixture: ComponentFixture<SuperVisorAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperVisorAnswerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperVisorAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
