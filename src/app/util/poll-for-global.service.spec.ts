import { TestBed } from '@angular/core/testing';

import { PollForGlobalService } from './poll-for-global.service';

describe('PollForGlobalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PollForGlobalService = TestBed.get(PollForGlobalService);
    expect(service).toBeTruthy();
  });
});
