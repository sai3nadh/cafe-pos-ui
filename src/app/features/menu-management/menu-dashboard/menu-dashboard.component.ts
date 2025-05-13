import { Component } from '@angular/core';
import { CategoryFormComponent } from "../categories/category-form/category-form.component";
import { MenuItemIngredientsComponent } from "../menu-item-ingredients/menu-item-ingredients.component";
import { MenuItemFormComponent } from "../menu-items/menu-item-form/menu-item-form.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-dashboard',
  imports: [CategoryFormComponent, MenuItemIngredientsComponent, MenuItemFormComponent
    , CommonModule, RouterModule
  ],
  templateUrl: './menu-dashboard.component.html',
  styleUrl: './menu-dashboard.component.scss'
})
export class MenuDashboardComponent {
  mode: 'menu-item-form' | 'category-form' | 'ingredient-mapping' | null = null;

  openMenuItemForm(): void {
    this.mode = 'menu-item-form';
  }

  openCategoryForm(): void {
    this.mode = 'category-form';
  }

  openIngredientMapping(): void {
    this.mode = 'ingredient-mapping';
  }

  goBack(): void {
    this.mode = null;
  }
}
