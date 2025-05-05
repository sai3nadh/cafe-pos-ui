import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { PurchasePaymentRequest, PurchaseResponse } from '../../models/purchase.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './purchase-detail.component.html',
  styleUrl: './purchase-detail.component.scss'
})
export class PurchaseDetailComponent {
  @Input() purchaseId!: number;
  @Output() close = new EventEmitter<void>();

  purchase!: PurchaseResponse;
  loading = false;
  error: string | null = null;

  showPaymentForm: boolean = false;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadPurchase();
  }

  loadPurchase(): void {
    this.loading = true;
    this.error = null;

    this.purchaseService.getPurchaseById(this.purchaseId).subscribe({
      next: (data) => {
        this.purchase = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading purchase:', err);
        this.error = 'Failed to load purchase details.';
        this.loading = false;
      }
    });
  }

  getTotalPaid(): number {
    return this.purchase.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  selectedPaymentMethodId: number = 1; // 1 = Cash, 2 = UPI
  addPayment(amount: string, ref: string) {
alert("sd");
    const numericAmount = +amount;
    if (numericAmount <= 0) return;

    
  const paymentRequest: PurchasePaymentRequest = {
    amount: numericAmount,
    paymentMethodId: this.selectedPaymentMethodId,
    note: ref || ''
  };
    // {
    //   amount: numericAmount,
    //   paymentMethodId: this.selectedPaymentMethodId,
    //   note: ref // optional if you track references
    // }
    // 1️⃣ Call the backend to save the payment here (I'll show this next)
    this.purchaseService.addPayment(this.purchaseId, paymentRequest
    
  ).subscribe({
      next: () => {
        this.showPaymentForm = false;
        this.loadPurchase();  // 🔥 Refresh the purchase data
      },
      error: (err) => {
        console.error('Error adding payment:', err);
      }
    });
  }
  
  // addPayment(amount: string, ref: string, method: string) {
  //   const numericAmount = +amount;
  //   if (numericAmount <= 0) return;

  //   // For now, just hide the form after clicking save
  //   // Later you will send this payment to the backend
  //   this.showPaymentForm = false;

  //   // Optional: Reload the purchase data after payment (future enhancement)
  // }


  // Mock data for display
//   purchase = {
//     id: 1,
//     supplier: 'ABC Foods',
//     items: [
//       { name: 'Rice', qty: 10, price: 50 },
//       { name: 'Oil', qty: 5, price: 100 }
//     ],
//     total: 950,
//     payments: [
//       { method: 'Cash', amount: 500 },
//       { method: 'UPI', amount: 200 }
//     ]
//   };

//   showPaymentForm:boolean = false;

//   // purchase-detail.component.ts
// getTotalPaid(): number {
//   return this.purchase.payments.reduce((sum, payment) => sum + payment.amount, 0);
// }

// addPayment(amount: string, ref: string, method: string) {
//   const numericAmount = +amount;
//   if (numericAmount <= 0) return;

//   // this.purchase.payments.push({
//   //   method,
//   //   amount: numericAmount,
//   //   ref
//   // });

//   this.showPaymentForm = false;
// }


}
