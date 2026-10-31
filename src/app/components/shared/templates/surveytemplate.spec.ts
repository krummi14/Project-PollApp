import { TestBed } from '@angular/core/testing';

import { Surveytemplate } from './surveytemplate';

describe('Surveytemplate', () => {
  let service: Surveytemplate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Surveytemplate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
