import { TestBed } from '@angular/core/testing';

import { ClamAPIService } from './clam-api.service';

describe('ClamAPIService', () => {
  let service: ClamAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClamAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
