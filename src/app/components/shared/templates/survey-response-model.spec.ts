import { TestBed } from '@angular/core/testing';

import { SurveyResponseModel } from './survey-response-model';

describe('SurveyResponseModel', () => {
  let service: SurveyResponseModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyResponseModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
