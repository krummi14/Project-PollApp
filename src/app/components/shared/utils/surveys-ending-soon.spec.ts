import { TestBed } from '@angular/core/testing';

import { SurveysEndingSoon } from './surveys-ending-soon';

describe('SurveysEndingSoon', () => {
  let service: SurveysEndingSoon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveysEndingSoon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
