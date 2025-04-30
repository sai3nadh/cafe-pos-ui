import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './purchase-detail.component.html',
  styleUrl: './purchase-detail.component.scss'
})
export class PurchaseDetailComponent {
  @Input() purchaseId!: number;
  @Output() close = new EventEmitter<void>();

  // Mock data for display
  purchase = {
    id: 1,
    supplier: 'ABC Foods',
    items: [
      { name: 'Rice', qty: 10, price: 50 },
      { name: 'Oil', qty: 5, price: 100 }
    ],
    total: 950,
    payments: [
      { method: 'Cash', amount: 500 },
      { method: 'UPI', amount: 200 }
    ]
  };
}
