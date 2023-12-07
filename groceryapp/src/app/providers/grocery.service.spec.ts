import { TestBed } from '@angular/core/testing';

import { GroceriesService } from './grocery.service';

describe('GroceryServiceService', () => {
  let service: GroceriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
