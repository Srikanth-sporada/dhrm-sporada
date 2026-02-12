import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTraineeDataComponent } from './update-trainee-data.component';

describe('UpdateTraineeDataComponent', () => {
  let component: UpdateTraineeDataComponent;
  let fixture: ComponentFixture<UpdateTraineeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTraineeDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTraineeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
