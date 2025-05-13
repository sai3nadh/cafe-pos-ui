import { TestBed } from '@angular/core/testing';

import { IngredientMappingService } from './ingredient-mapping.service';

describe('IngredientMappingService', () => {
  let service: IngredientMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
