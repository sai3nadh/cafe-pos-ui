import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredients-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ingredients-form.component.html',
  styleUrl: './ingredients-form.component.scss'
})
export class IngredientsFormComponent {
  @Input() ingredientId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  ingredient: Ingredient = {
    ingredientId: 0,
    name: '',
    unit: '',
    currentStock: 0,
    isInternal: false,
    status: 'active'
  };

  constructor(private ingredientService: IngredientService) {}

  ngOnInit() {
    if (this.ingredientId) {
      this.ingredientService.getIngredientById(this.ingredientId).subscribe(data => {
        this.ingredient = data;
      });
    }
  }

  submit() {
    if (this.ingredientId) {
      this.ingredientService.updateIngredient(this.ingredientId, this.ingredient).subscribe(() => {
        alert('Ingredient updated!');
        this.saved.emit();
      });
    } else {
      this.ingredientService.createIngredient(this.ingredient).subscribe(() => {
        alert('Ingredient added!');
        this.saved.emit();
      });
    }
  }
}
