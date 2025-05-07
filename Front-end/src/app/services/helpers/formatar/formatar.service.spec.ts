import { TestBed } from '@angular/core/testing';

import { FormatarService } from './formatar.service';

describe('FormatarService', () => {
  let service: FormatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
