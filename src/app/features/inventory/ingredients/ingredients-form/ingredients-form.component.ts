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


  // unitOptionds = [
  //   'ml', 'l', 'liters', 'tsp', 'tbsp', 'cup',
  //   'g', 'kg',
  //   'pcs', 'unit', 'can', 'bottle',
  //   'pack', 'slice', 'box', 'carton'
  // ];

  unitOptions = [
    { label: 'millilitre (ml)', value: 'ml' },
    { label: 'litre (ltr)', value: 'l' },
    { label: 'teaspoon (tsp)', value: 'tsp' },
    { label: 'tablespoon (tbsp)', value: 'tbsp' },
    { label: 'cup', value: 'cup' },
  
    { label: 'gram (g)', value: 'g' },
    { label: 'kilogram (kg)', value: 'kg' },
  
    { label: 'piece (pcs)', value: 'pcs' },
    { label: 'unit', value: 'unit' },
    { label: 'can', value: 'can' },
    { label: 'bottle', value: 'bottle' },
    { label: 'pack', value: 'pack' },
    { label: 'slice', value: 'slice' },
    { label: 'box', value: 'box' },
    { label: 'carton', value: 'carton' }
  ];
  
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
