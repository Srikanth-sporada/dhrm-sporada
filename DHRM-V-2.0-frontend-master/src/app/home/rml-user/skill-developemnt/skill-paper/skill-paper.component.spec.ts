import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillPaperComponent } from './skill-paper.component';

describe('SkillPaperComponent', () => {
  let component: SkillPaperComponent;
  let fixture: ComponentFixture<SkillPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillPaperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
