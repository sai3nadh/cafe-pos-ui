import { Component, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.scss'
})
export class IngredientListComponent {
  @Output() addIngredient = new EventEmitter<void>();
  @Output() editIngredient = new EventEmitter<number>();
  @Output() viewIngredient = new EventEmitter<number>();

  ingredients: Ingredient[] = [];

  constructor(private ingredientService: IngredientService) {}

  ngOnInit() {
    this.ingredientService.getAllIngredients().subscribe(data => {
      this.ingredients = data;
    });
  }

  onAdd() {
    this.addIngredient.emit();
  }

  onEdit(id: number) {
    this.editIngredient.emit(id);
  }

  onView(id: number) {
    this.viewIngredient.emit(id);
  }
}
