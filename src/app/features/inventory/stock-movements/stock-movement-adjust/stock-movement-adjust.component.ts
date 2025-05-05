import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StockMovement } from '../stock-movement.model';
import { StockMovementService } from '../stock-movement.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Ingredient } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';
type MovementType = 'adjustment' | 'purchase' | 'sale' | 'stock_return';

// import { IngredientService } from
@Component({
  selector: 'app-stock-movement-adjust',
  standalone:true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './stock-movement-adjust.component.html',
  styleUrl: './stock-movement-adjust.component.scss'
})
export class StockMovementAdjustComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  // @Output() saved = new EventEmitter<void>();
  @Output() saved = new EventEmitter<boolean>();

  ingredients: Ingredient[] = [];

  formData: Partial<StockMovement> = {
    ingredientId: 0,
    movementType: 'adjustment',
    reference: 'Manual',
    quantity: 0,
    note: ''
  };

  constructor(
    private stockMovementService: StockMovementService,
    private ingredientService: IngredientService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientService.getAllIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
      },
      error: (err) => {
        console.error('Failed to load ingredients:', err);
      }
    });
  }

  submit(): void {
    if (!this.formData.ingredientId || this.formData.quantity === 0) {
      alert('Please select an ingredient and enter a non-zero quantity.');
      return;
    }

    // Make sure movementType and reference are correct (if user changed/reset form fields)
    this.formData.movementType = 'adjustment' as MovementType;
    this.formData.reference = 'Manual';

    this.stockMovementService.addMovement(this.formData).subscribe({
      next: () => {
        alert('Stock adjustment saved.');
        // this.saved.emit();
        this.saved.emit(true);
        this.resetForm();
      },
      error: (err) => {
        console.error('Failed to save adjustment:', err);
        alert('Failed to save adjustment.');
      }
    });
  }

  cancelForm(): void {
    this.cancel.emit();
  }

  resetForm(): void {
    this.formData = {
      ingredientId: 0,
      movementType: 'adjustment',
      reference: 'Manual',
      quantity: 0,
      note: ''
    };
  }
  //   @Output() cancel = new EventEmitter<void>();
//   @Output() saved = new EventEmitter<void>();

//   ingredients: Ingredient[] = [];

//   formData = {
//     ingredientId: 0,
//     movementType: 'adjustment',
//     reference: 'Manual',
//     quantity: 0,
//     note: ''
//   };

//   constructor(
//     private stockMovementService: StockMovementService,
//     private ingredientService: IngredientService
//   ) {}

//   ngOnInit(): void {
//     this.loadIngredients();
//   }

//   loadIngredients(): void {
//     this.ingredientService.getAllIngredients().subscribe({
//       next: (data) => {
//         this.ingredients = data;
//       },
//       error: (err) => {
//         console.error('Failed to load ingredients:', err);
//       }
//     });
//   }

//   // submit(): void {
//   //   if (!this.formData.ingredientId || this.formData.quantity === 0) {
//   //     alert('Please select an ingredient and enter a non-zero quantity.');
//   //     return;
//   //   }
//   //   type MovementType = 'adjustment' | 'purchase' | 'sale' | 'stock_return';

//   //   this.formData = {
//   //       ingredientId: 0,
//   //       movementType: 'adjustment' as MovementType,
//   //       reference: 'Manual',
//   //       quantity: 0,
//   //       note: ''
//   //   };
//   //   this.stockMovementService.addMovement(this.formData).subscribe({
//   //     next: () => {
//   //       alert('Stock adjustment saved.');
//   //       this.saved.emit();
//   //     },
//   //     error: (err) => {
//   //       console.error('Failed to save adjustment:', err);
//   //       alert('Failed to save adjustment.');
//   //     }
//   //   });
//   // }



// resetForm(): void {
//     this.formData = {
//         ingredientId: 0,
//         movementType: 'adjustment',
//         reference: 'Manual',
//         quantity: 0,
//         note: ''
//     };
// }

//   cancelForm(): void {
//     this.cancel.emit();
//   }
}
