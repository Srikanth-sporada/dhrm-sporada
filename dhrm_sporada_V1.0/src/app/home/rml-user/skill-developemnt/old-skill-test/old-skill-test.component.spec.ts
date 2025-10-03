import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldSkillTestComponent } from './old-skill-test.component';

describe('OldSkillTestComponent', () => {
  let component: OldSkillTestComponent;
  let fixture: ComponentFixture<OldSkillTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldSkillTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldSkillTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
