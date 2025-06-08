import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { jobSelectGuard } from './job-select.guard';

describe('jobSelectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => jobSelectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
