import { TestBed } from '@angular/core/testing';

import { PlanosServiceService } from './planos-service.service';

describe('PlanosServiceService', () => {
  let service: PlanosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
