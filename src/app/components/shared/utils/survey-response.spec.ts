import { TestBed } from '@angular/core/testing';

import { SurveyResponse } from './survey-response';

describe('SurveyResponse', () => {
  let service: SurveyResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyResponse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
