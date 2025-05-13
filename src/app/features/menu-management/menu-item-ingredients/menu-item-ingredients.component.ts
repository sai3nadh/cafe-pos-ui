import { Component, ViewChild } from '@angular/core';
import { MenuItemIngredientListComponent } from "./menu-item-ingredient-list/menu-item-ingredient-list.component";
import { MenuItemIngredientFormComponent } from "./menu-item-ingredient-form/menu-item-ingredient-form.component";
import { CommonModule } from '@angular/common';
import { MenuItemWithIngredients } from '../models/ingredient-mapping.model';

@Component({
  selector: 'app-menu-item-ingredients',
  imports: [MenuItemIngredientListComponent
    // , MenuItemIngredientFormComponent
    ,
    CommonModule, MenuItemIngredientFormComponent],
  templateUrl: './menu-item-ingredients.component.html',
  styleUrl: './menu-item-ingredients.component.scss'
})
export class MenuItemIngredientsComponent {
  @ViewChild(MenuItemIngredientListComponent)
  ingredientListComponent!: MenuItemIngredientListComponent;


  mode: 'list' | 'form' = 'list';
  selectedMenuItemId: number | null = null;

  openForm(menuItem: MenuItemWithIngredients): void {
    this.selectedMenuItemId = menuItem.menuItemId;
    this.mode = 'form';
  }

  goBackToList(): void {
    this.mode = 'list';
    this.selectedMenuItemId = null;
    
    // ✅ Refresh list when going back from the form
    this.ingredientListComponent.loadMenuItems();
  }
}
