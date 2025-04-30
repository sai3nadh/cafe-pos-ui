import { Component, EventEmitter, Output } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent {

  suppliers: Supplier[] = [];

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    // this.supplierService.getAllSuppliers().subscribe(data => this.suppliers = data);
  }
  

  @Output() addPurchase = new EventEmitter<void>();
  @Output() viewPurchase = new EventEmitter<number>();

  purchases = [
    { id: 1, supplier: 'ABC Foods', total: 1200, status: 'unpaid' },
    { id: 2, supplier: 'Fresh Farm', total: 700, status: 'partial' },
    { id: 3, supplier: 'BulkMart', total: 950, status: 'paid' }
  ];

  onAdd() {
    this.addPurchase.emit();
  }

  onView(id: number) {
    this.viewPurchase.emit(id);
  }
}
