import { TestBed } from '@angular/core/testing';

import { FaceidService } from './faceid.service';

describe('FaceidService', () => {
  let service: FaceidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
