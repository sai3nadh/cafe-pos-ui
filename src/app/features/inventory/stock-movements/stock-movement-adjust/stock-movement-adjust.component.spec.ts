import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementAdjustComponent } from './stock-movement-adjust.component';

describe('StockMovementAdjustComponent', () => {
  let component: StockMovementAdjustComponent;
  let fixture: ComponentFixture<StockMovementAdjustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovementAdjustComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMovementAdjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
