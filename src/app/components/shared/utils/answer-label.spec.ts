import { TestBed } from '@angular/core/testing';

import { AnswerLabel } from './answer-label';

describe('AnswerLabel', () => {
  let service: AnswerLabel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerLabel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
