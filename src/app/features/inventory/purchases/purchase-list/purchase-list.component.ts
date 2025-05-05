import { Component, EventEmitter, Output } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { PurchaseResponse } from '../../models/purchase.model';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent {

  
  purchases: PurchaseResponse[] = [];
  loading: boolean = false;
  error: string | null = null;
  suppliers: Supplier[] = [];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadPurchases();
    // this.supplierService.getAllSuppliers().subscribe(data => this.suppliers = data);
  }
  

  @Output() addPurchase = new EventEmitter<void>();
  @Output() viewPurchase = new EventEmitter<number>();

  // purchases = [
  //   { id: 1, supplier: 'ABC Foods', total: 1200, status: 'unpaid' },
  //   { id: 2, supplier: 'Fresh Farm', total: 700, status: 'partial' },
  //   { id: 3, supplier: 'BulkMart', total: 950, status: 'paid' }
  // ];

  getShortPurchaseNumber(purchaseNumber: string): string {
    if (!purchaseNumber) return '';
    const year = purchaseNumber.substring(6, 8); // "25"
    // PUR-2025-05-0011
    const month = purchaseNumber.substring(9, 11); // "05"
    const sequence = purchaseNumber.slice(-4); // "0001"
    return `P-${year}${month}-${sequence}`;
  }
  
  loadPurchases(): void {
    this.loading = true;
    this.error = null;

    this.purchaseService.getAllPurchases().subscribe({
      next: (data) => {
        this.purchases = data;
        console.log('Purchases loaded:', data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading purchases:', err);
        this.error = 'Failed to load purchases.';
        this.loading = false;
      }
    });
  }
  getItemSummary(purchase: PurchaseResponse): string {
    return purchase.items
      .map(item => `${item.ingredientName} x${item.quantity}`)
      .join(', ');
  }

  getBalance(purchase: PurchaseResponse): number {
    return purchase.totalAmount - purchase.paidAmount;
  }

  onAdd() {
    this.addPurchase.emit();
  }

  onView(id: number) {
    this.viewPurchase.emit(id);
  }
}
