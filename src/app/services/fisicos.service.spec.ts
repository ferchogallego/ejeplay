import { TestBed } from '@angular/core/testing';

import { FisicosService } from './fisicos.service';

describe('FisicosService', () => {
  let service: FisicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FisicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
