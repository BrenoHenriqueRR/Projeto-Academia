import { TestBed } from '@angular/core/testing';

import { ModalEditarService } from './modal-editar.service';

describe('ModalEditarService', () => {
  let service: ModalEditarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
