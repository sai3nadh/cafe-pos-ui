// import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

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

  supplier: any;
  ledger: any[] = [];

  ngOnInit(): void {
    // Replace with API calls later
    this.supplier = {
      name: 'ABC Foods',
      phone: '9876543210',
      gst: 'GST1234ABC',
      address: '123 Market St',
      email: 'abc@foods.com',
      status: 'active'
    };

    this.ledger = [
      { date: '2024-04-01', type: 'Purchase', ref: 'P001', debit: 1000, credit: 0 },
      { date: '2024-04-02', type: 'Payment', ref: 'Cash', debit: 0, credit: 500 },
      { date: '2024-04-04', type: 'Purchase', ref: 'P002', debit: 700, credit: 0 }
    ];
  }

  getBalance(): number {
    return this.ledger.reduce((bal, row) => bal + (row.debit - row.credit), 0);
  }


  // payment adding
  showPaymentForm = false;

newPayment = {
  amount: 0,
  ref: '',
  type: 'cash'
};

addPayment(amount: string, ref: string, type: string) {
  if(true){
    console.log("amount not added");
    
    return;
  }
  const entry = {
    date: new Date().toISOString().split('T')[0],
    type: 'payment',
    ref: ref,
    debit: 0,
    credit: parseFloat(amount),
    paymentMethod: type // optional: if you want to store this
  };

  this.ledger.push(entry); // Add to the ledger
  this.showPaymentForm = false;
}

}
