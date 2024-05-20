import { TestBed } from '@angular/core/testing';

import { CadTreinoService } from './cad-treino.service';

describe('CadTreinoService', () => {
  let service: CadTreinoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadTreinoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
