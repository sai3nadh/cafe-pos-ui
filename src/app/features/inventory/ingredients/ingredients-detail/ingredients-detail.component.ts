import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredients-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './ingredients-detail.component.html',
  styleUrl: './ingredients-detail.component.scss'
})
export class IngredientsDetailComponent {
  @Input() ingredientId?: number;
  @Output() close = new EventEmitter<void>();

  ingredient?: Ingredient;

  constructor(private ingredientService: IngredientService) {}

  ngOnInit() {
    if (this.ingredientId) {
      this.ingredientService.getIngredientById(this.ingredientId).subscribe(data => {
        this.ingredient = data;
      });
    }
  }
}
