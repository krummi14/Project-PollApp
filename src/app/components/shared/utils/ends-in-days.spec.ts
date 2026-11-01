import { TestBed } from '@angular/core/testing';

import { EndsInDays } from './ends-in-days';

describe('EndsInDays', () => {
  let service: EndsInDays;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndsInDays);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
