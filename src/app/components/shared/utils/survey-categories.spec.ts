import { TestBed } from '@angular/core/testing';

import { SurveyCategories } from './survey-categories';

describe('SurveyCategories', () => {
  let service: SurveyCategories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyCategories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
