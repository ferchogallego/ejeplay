import { TestBed } from '@angular/core/testing';

import { Productps5Service } from './productps5.service';

describe('Productps5Service', () => {
  let service: Productps5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Productps5Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
