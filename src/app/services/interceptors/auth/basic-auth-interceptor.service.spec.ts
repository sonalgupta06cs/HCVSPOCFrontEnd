import { TestBed } from '@angular/core/testing';

import { BasicAuthHttpInterceptorService } from './basic-auth-interceptor.service';

describe('BasicAuthInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicAuthHttpInterceptorService = TestBed.get(BasicAuthHttpInterceptorService);
    expect(service).toBeTruthy();
  });
});
