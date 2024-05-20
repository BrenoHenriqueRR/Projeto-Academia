import { TestBed } from '@angular/core/testing';

import { UserTreinoService } from './user-treino.service';

describe('UserTreinoService', () => {
  let service: UserTreinoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTreinoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
