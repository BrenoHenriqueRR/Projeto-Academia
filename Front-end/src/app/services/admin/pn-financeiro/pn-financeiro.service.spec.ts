import { TestBed } from '@angular/core/testing';

import { PnFinanceiroService } from './pn-financeiro.service';

describe('PnFinanceiroService', () => {
  let service: PnFinanceiroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnFinanceiroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
