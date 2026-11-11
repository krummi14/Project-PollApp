import { TestBed } from '@angular/core/testing';

import { ResponseStatistic } from './response-statistic';

describe('ResponseStatistic', () => {
  let service: ResponseStatistic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseStatistic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
