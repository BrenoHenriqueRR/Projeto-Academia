import { TestBed } from '@angular/core/testing';
import { PnLojaService } from './pn-loja.service';


describe('PnLojaService', () => {
  let service: PnLojaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnLojaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
