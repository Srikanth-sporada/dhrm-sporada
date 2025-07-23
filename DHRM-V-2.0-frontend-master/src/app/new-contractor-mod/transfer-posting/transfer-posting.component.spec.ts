import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPostingComponent } from './transfer-posting.component';

describe('TransferPostingComponent', () => {
  let component: TransferPostingComponent;
  let fixture: ComponentFixture<TransferPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferPostingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
