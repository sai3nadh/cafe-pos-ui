import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IngredientListComponent } from "./ingredient-list/ingredient-list.component";
import { IngredientsDetailComponent } from './ingredients-detail/ingredients-detail.component';
import { IngredientsFormComponent } from './ingredients-form/ingredients-form.component';

@Component({
  selector: 'app-ingredients',
  standalone:true,
  imports: [
    CommonModule,
    IngredientListComponent,
    IngredientsDetailComponent,
    IngredientsFormComponent
],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.scss'
})
export class IngredientsComponent {
  mode: 'list' | 'form' | 'detail' = 'list';
  selectedIngredientId?: number;

  openForm(ingredientId?: number) {
    this.selectedIngredientId = ingredientId;
    this.mode = 'form';
  }

  openDetail(ingredientId: number) {
    this.selectedIngredientId = ingredientId;
    this.mode = 'detail';
  }

  goBack() {
    this.mode = 'list';
    this.selectedIngredientId = undefined;
  }
}
