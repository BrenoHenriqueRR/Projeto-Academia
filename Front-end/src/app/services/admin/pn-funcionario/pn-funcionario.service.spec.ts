import { TestBed } from '@angular/core/testing';

import { PnFuncionarioService } from './pn-funcionario.service';

describe('PnFuncionarioService', () => {
  let service: PnFuncionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnFuncionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
