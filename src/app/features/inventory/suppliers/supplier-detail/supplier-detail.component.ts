// import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,

  imports: [
    CommonModule
  ],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss'
})
export class SupplierDetailComponent {
  @Input() supplierId?: number;
  @Output() close = new EventEmitter<void>();


  supplier?: Supplier;
  ledger: any[] = [];
  loading = false;
  error: string | null = null;

  // Payment form
  showPaymentForm = false;
  newPayment = {
    amount: 0,
    ref: '',
    type: 'cash'
  };

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    if (this.supplierId) {
      this.loadSupplierAndLedger(this.supplierId);
      this.getsummary(this.supplierId);
    } else {
      console.error('No supplierId provided to SupplierDetailComponent');
    }
  }

  loadSupplierAndLedger(id: number): void {
    this.loading = true;
    this.error = null;

    // Fetch supplier (real API)
    this.supplierService.getSupplierById(id).subscribe({
      next: (data) => {
        console.log('Supplier loaded:', data);
        this.supplier = data;
        // 🚨 TODO: Replace this with a real ledger API call once available.
        // this.ledger = [
        //   { date: '2024-04-01', type: 'Purchase', ref: 'P001', debit: 1000, credit: 0 },
        //   { date: '2024-04-02', type: 'Payment', ref: 'Cash', debit: 0, credit: 500 },
        //   { date: '2024-04-04', type: 'Purchase', ref: 'P002', debit: 700, credit: 0 }
        // ];

          // Get recent purchases
      this.supplierService.getSupplierPurchases(id).subscribe({
        next: (purchaseData) => {
          this.ledger = purchaseData.content.map((p: any) => ({
            date: p.purchaseDate,
            type: 'Purchase',
            ref: p.purchaseNo || 'No Ref',
            debit: null,
            credit: p.amount
          }));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading purchases:', err);
          this.error = 'Failed to load purchases.';
          this.loading = false;
        }
      });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading supplier:', err);
        this.error = 'Failed to load supplier data.';
        this.loading = false;
      }
    });
  }

  getBalance(): number {
    return this.ledger.reduce((bal, row) => bal + (row.debit - row.credit), 0);
  }

  addPayment(amountStr: string, ref: string, type: string) {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid amount entered');
      return;
    }

    const entry = {
      date: new Date().toISOString().split('T')[0],
      type: 'Payment',
      ref: ref,
      debit: 0,
      credit: amount,
      paymentMethod: type
    };

    this.ledger.push(entry);
    this.showPaymentForm = false;

    console.log('New payment added:', entry);
  }

  paymentMethods(): string[] {
    return this.purchaseSummary ? Object.keys(this.purchaseSummary.amountByPaymentMethod) : [];
  }
  
  // summary
  purchaseSummary: any = null;
getsummary(id: number){
  this.supplierService.getSupplierPurchaseSummary(id).subscribe({
    next: (summaryData) => {
      this.purchaseSummary = summaryData;
    },
    error: (err) => {
      console.error('Failed to load purchase summary', err);
    }
  });
}
  /// popup full ledger

  detailedLedger: any[] = [];
showDetailedLedger:boolean = false;

showLedgerPopup() {
  if (!this.supplierId) return;

  this.supplierService.getSupplierLedger(this.supplierId).subscribe({
    next: (ledgerData) => {
      this.detailedLedger = ledgerData.map((entry: any) => ({
        date: entry.txnDate,
        type: entry.txnType,
        ref: entry.reference,
        debit: entry.debit || 0,
        credit: entry.credit || 0,
        balance: entry.runningBalance
      }));
      this.showDetailedLedger = true;
    },
    error: (err) => {
      console.error('Error loading ledger:', err);
      this.error = 'Failed to load detailed ledger.';
    }
  });
}

//   supplier: any;
//   ledger: any[] = [];

//   ngOnInit(): void {
//     // Replace with API calls later
//     this.supplier = {
//       name: 'ABC Foods',
//       phone: '9876543210',
//       gst: 'GST1234ABC',
//       address: '123 Market St',
//       email: 'abc@foods.com',
//       status: 'active'
//     };

//     this.ledger = [
//       { date: '2024-04-01', type: 'Purchase', ref: 'P001', debit: 1000, credit: 0 },
//       { date: '2024-04-02', type: 'Payment', ref: 'Cash', debit: 0, credit: 500 },
//       { date: '2024-04-04', type: 'Purchase', ref: 'P002', debit: 700, credit: 0 }
//     ];
//   }

//   getBalance(): number {
//     return this.ledger.reduce((bal, row) => bal + (row.debit - row.credit), 0);
//   }


//   // payment adding
//   showPaymentForm = false;

// newPayment = {
//   amount: 0,
//   ref: '',
//   type: 'cash'
// };

// addPayment(amount: string, ref: string, type: string) {
//   if(true){
//     console.log("amount not added");
    
//     return;
//   }
//   const entry = {
//     date: new Date().toISOString().split('T')[0],
//     type: 'payment',
//     ref: ref,
//     debit: 0,
//     credit: parseFloat(amount),
//     paymentMethod: type // optional: if you want to store this
//   };

//   this.ledger.push(entry); // Add to the ledger
//   this.showPaymentForm = false;
// }

}
