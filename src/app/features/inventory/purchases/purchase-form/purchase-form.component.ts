import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';
import { PurchaseItem, PurchaseRequest } from '../../models/purchase.model';
import { IngredientService } from '../../services/ingredient.service';
import { PurchaseService } from '../../services/purchase.service';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.scss'
})


export class PurchaseFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  suppliers: Supplier[] = [];
  ingredients: Ingredient[] = [];

  selectedSupplierId?: number;
  note: string = '';
  purchaseItems: PurchaseItem[] = [];

  constructor(
    private supplierService: SupplierService,
    private ingredientService: IngredientService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: data => (this.suppliers = data),
      error: () => alert('Failed to load suppliers')
    });

    this.ingredientService.getAllIngredients().subscribe({
      next: data => (this.ingredients = data),
      error: () => alert('Failed to load ingredients')
    });

    this.addItem();
  }

  addItem(): void {
    this.purchaseItems.push({
      ingredientId: 0,
      quantity: 0,
      unitPrice: 0
    });
  }

  removeItem(index: number): void {
    this.purchaseItems.splice(index, 1);
  }

  get totalAmount(): number {
    return this.purchaseItems.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  }

  submit(): void {
    if (!this.selectedSupplierId || this.purchaseItems.length === 0) {
      alert('Please select a supplier and add at least one item.');
      return;
    }

    const payload: PurchaseRequest = {
      supplierId: this.selectedSupplierId,
      note: this.note,
      items: this.purchaseItems
    };

    this.purchaseService.createPurchase(payload).subscribe({
      next: () => {
        alert('Purchase saved!');
        this.saved.emit();
      },
      error: () => alert('Error saving purchase.')
    });
  }
}
// export class PurchaseFormComponent implements OnInit {
//   suppliers: Supplier[] = [];
//   ingredients: Ingredient[] = [];

//   selectedSupplierId!: number;
//   note: string = '';
//   purchaseItems: PurchaseItem[] = [];

//   constructor(
//     private purchaseService: PurchaseService,
//     private supplierService: SupplierService,
//     private ingredientService: IngredientService
//   ) {}

//   ngOnInit(): void {
//     this.supplierService.getAllSuppliers().subscribe(data => this.suppliers = data);
//     this.ingredientService.getAllIngredients().subscribe(data => this.ingredients = data);
//     this.addItem(); // initialize with 1 row
//   }

//   addItem(): void {
//     this.purchaseItems.push({
//       ingredientId: 0,
//       quantity: 0,
//       unitPrice: 0
//     });
//   }

//   removeItem(index: number): void {
//     this.purchaseItems.splice(index, 1);
//   }

//   get totalAmount(): number {
//     return this.purchaseItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
//   }

//   submit(): void {
//     const payload: PurchaseRequest = {
//       supplierId: this.selectedSupplierId,
//       note: this.note,
//       items: this.purchaseItems
//     };
//     this.purchaseService.createPurchase(payload).subscribe({
//       next: () => alert('Purchase saved!'),
//       error: err => alert('Error saving purchase.')
//     });
//   }
// }
// // export class PurchaseFormComponent {

// // }
