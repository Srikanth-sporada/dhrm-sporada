import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillQuestionComponent } from './skill-question.component';

describe('SkillQuestionComponent', () => {
  let component: SkillQuestionComponent;
  let fixture: ComponentFixture<SkillQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
