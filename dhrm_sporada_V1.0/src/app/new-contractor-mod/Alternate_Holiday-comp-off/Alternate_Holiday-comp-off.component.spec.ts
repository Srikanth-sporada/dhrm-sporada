import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaredCompOffComponent } from './Alternate_Holiday-comp-off.component';

describe('DeclaredCompOffComponent', () => {
  let component: DeclaredCompOffComponent;
  let fixture: ComponentFixture<DeclaredCompOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclaredCompOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclaredCompOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
