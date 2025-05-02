import { Component } from '@angular/core';
import { PurchaseFormComponent } from "../purchases/purchase-form/purchase-form.component";
import { SupplierFormComponent } from "../suppliers/supplier-form/supplier-form.component";
import { IngredientsFormComponent } from "../ingredients/ingredients-form/ingredients-form.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    PurchaseFormComponent,
    SupplierFormComponent,
    IngredientsFormComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  mode?: string;
selectedSupplierId?: number;
selectedIngredientId?: number;

openPurchaseForm() {
  this.mode = 'purchase-form';
}

openSupplierForm() {
  this.mode = 'supplier-form';
  this.selectedSupplierId = undefined; // For new supplier
}

openIngredientForm() {
  this.mode = 'ingredient-form';
  this.selectedIngredientId = undefined; // For new ingredient
}

goBack() {
  this.mode = undefined;
  this.selectedSupplierId = undefined;
  this.selectedIngredientId = undefined;
}

}
