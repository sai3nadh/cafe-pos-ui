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

  showPaymentForm:boolean = false;

  // purchase-detail.component.ts
getTotalPaid(): number {
  return this.purchase.payments.reduce((sum, payment) => sum + payment.amount, 0);
}

addPayment(amount: string, ref: string, method: string) {
  const numericAmount = +amount;
  if (numericAmount <= 0) return;

  // this.purchase.payments.push({
  //   method,
  //   amount: numericAmount,
  //   ref
  // });

  this.showPaymentForm = false;
}


}
