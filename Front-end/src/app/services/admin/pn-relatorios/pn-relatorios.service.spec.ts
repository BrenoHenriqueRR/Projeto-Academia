
import { TestBed } from '@angular/core/testing';

import { PnRelatoriosService } from './pn-relatorios.service';

describe('PnFuncionarioService', () => {
  let service: PnRelatoriosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnRelatoriosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
