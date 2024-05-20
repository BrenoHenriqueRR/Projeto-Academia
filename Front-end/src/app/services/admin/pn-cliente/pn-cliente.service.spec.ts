import { TestBed } from '@angular/core/testing';

import { PnClienteService } from './pn-cliente.service';

describe('PnClienteService', () => {
  let service: PnClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
