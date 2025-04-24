import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyOrdersDisplayComponent } from './ready-orders-display.component';

describe('ReadyOrdersDisplayComponent', () => {
  let component: ReadyOrdersDisplayComponent;
  let fixture: ComponentFixture<ReadyOrdersDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyOrdersDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyOrdersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
