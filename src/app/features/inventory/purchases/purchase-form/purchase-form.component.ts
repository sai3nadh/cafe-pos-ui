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
  selectedPaymentMethodId: number = 1; // 1 = Cash, 2 = UPI
  amountPaid: number = 0;
  purchaseDate: string = ''; // or initialize with today's date if needed


  constructor(
    private supplierService: SupplierService,
    private ingredientService: IngredientService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.purchaseDate = new Date().toISOString().substring(0, 10); // e.g., "2025-05-01"
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
    console.log(this.purchaseItems);
    this.purchaseItems.push({
      ingredientId: 0,
      quantity: 0,
      unitPrice: 0
      // totalPrice:0
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

  getExpectedTotal(): number {
    return this.purchaseItems.reduce((sum, item) => {
      return sum + ((item.quantity || 0) * (item.unitPrice || 0));
    }, 0);
  }
  
  manualActualTotal: number = 0;
  // getUnitByIngredientId(id: number): string {
  //   console.log(id+"dd");
  //   console.log(this.ingredients);
    
  //   return this.ingredients.find(i => i.ingredientId === id)?.status || 'w';
  // }
  getUnitByIngredientId(id: number): string {
    console.log('Looking for ingredientId:', id);
    const found = this.ingredients.find(i => i.ingredientId === +id);
    console.log('Found:', found);
    return found?.unit || '';
  }
  

  // getActualTotal(): number {
  //   return this.purchaseItems.reduce((sum, item) => {
  //     return sum + (item.totalPrice || 0);
  //   }, 0);
  // }
  // manualTotals: { [index: number]: number } = {};

  // getActualTotal(): number {
  //   return Object.values(this.manualTotals).reduce((sum, val) => sum + (val || 0), 0);
  // }
  
  
  // submit(): void {
  //   if (!this.selectedSupplierId || this.purchaseItems.length === 0) {
  //     alert('Please select a supplier and add at least one item.');
  //     return;
  //   }
  
  //   if (this.totalAmount <= 0) {
  //     alert('Total amount must be greater than zero.');
  //     return;
  //   }
  
  //   if (this.amountPaid < 0 || this.amountPaid > this.totalAmount) {
  //     alert('Invalid payment amount.');
  //     return;
  //   }
  
  //   const payload: PurchaseRequest = {
  //     supplierId: this.selectedSupplierId,
  //     note: this.note,
  //     items: this.purchaseItems,
  //     paymentMethodId: this.selectedPaymentMethodId,
  //     amountPaid: this.amountPaid,
  //     amountDue: this.totalAmount - this.amountPaid
  //   };
  
  //   this.purchaseService.createPurchase(payload).subscribe({
  //     next: () => {
  //       alert('Purchase saved!');
  //       this.saved.emit();
  //     },
  //     error: () => alert('Error saving purchase.')
  //   });
  // }
  submit(): void {

    // Validation
    if (!this.isManual && (!this.selectedSupplierId || this.purchaseItems.length === 0)) {
      alert('Please select a supplier and add at least one item.');
      return;
    }
  
    if (this.isManual && !this.customSupplierName) {
      alert('Please enter a custom supplier name for manual purchase.');
      return;
    }
  
    // ✅ Calculate the final total
    // const finalTotal = (this.isManual && this.purchaseItems.length === 0)
    //   ? this.manualAmount
    //   : this.totalAmount;

  //     const finalTotal = (this.isManual && this.purchaseItems.length === 0)
  // ? this.manualAmount
  // : this.getActualTotal();

      const finalTotal = (this.isManual && this.purchaseItems.length === 0)
  ? this.manualAmount
  : this.manualActualTotal;

  
    if (finalTotal <= 0) {
      alert('Total amount must be greater than zero.');
      return;
    }
  
    if (this.amountPaid < 0 || this.amountPaid > finalTotal) {
      alert('Invalid payment amount.');
      return;
    }
  
    // ✅ Build payload
    // const payload: PurchaseRequest = {
    //   supplierId: this.isManual ? null : this.selectedSupplierId,
    //   customSupplierName: this.isManual ? this.customSupplierName : null,
    //   isManual: this.isManual,
    //   purchaseDate: this.purchaseDate,
    //   note: this.note,
    //   items: this.purchaseItems,
    //   totalAmount: finalTotal,
    //   paymentMethodId: this.selectedPaymentMethodId,
    //   amountPaid: this.amountPaid,
    //   amountDue: finalTotal - this.amountPaid
    // };
    const payload: PurchaseRequest = {
      supplierId: !this.isManual ? this.selectedSupplierId : undefined,
      customSupplierName: this.isManual ? this.customSupplierName : undefined,
      isManual: this.isManual,
      purchaseDate: this.purchaseDate,
      note: this.note,
      items: this.purchaseItems,
      totalAmount: finalTotal,
      paymentMethodId: this.selectedPaymentMethodId,
      amountPaid: this.amountPaid,
      amountDue: finalTotal - this.amountPaid
    };
    
  
    this.purchaseService.createPurchase(payload).subscribe({
      next: () => {
        // alert('Purchase saved!');
        this.saved.emit();
      },
      error: () => alert('Error saving purchase.')
    });
  }
  

  isManual = false;
customSupplierName = '';
manualAmount = 0;

  
  // submit(): void {
  //   if (!this.selectedSupplierId || this.purchaseItems.length === 0) {
  //     alert('Please select a supplier and add at least one item.');
  //     return;
  //   }

  //   const payload: PurchaseRequest = {
  //     supplierId: this.selectedSupplierId,
  //     note: this.note,
  //     items: this.purchaseItems
  //   };

  //   this.purchaseService.createPurchase(payload).subscribe({
  //     next: () => {
  //       alert('Purchase saved!');
  //       this.saved.emit();
  //     },
  //     error: () => alert('Error saving purchase.')
  //   });
  // }
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
