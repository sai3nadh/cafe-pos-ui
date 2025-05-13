import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Categories
import { CategoriesComponent } from './categories/categories.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryFormComponent } from './categories/category-form/category-form.component';

// Menu Items
import { MenuItemsComponent } from './menu-items/menu-items.component';
import { MenuItemListComponent } from './menu-items/menu-item-list/menu-item-list.component';
import { MenuItemFormComponent } from './menu-items/menu-item-form/menu-item-form.component';
import { MenuItemDetailComponent } from './menu-items/menu-item-detail/menu-item-detail.component';

// Ingredient Mapping
import { MenuItemIngredientsComponent } from './menu-item-ingredients/menu-item-ingredients.component';
import { MenuItemIngredientListComponent } from './menu-item-ingredients/menu-item-ingredient-list/menu-item-ingredient-list.component';
import { MenuItemIngredientFormComponent } from './menu-item-ingredients/menu-item-ingredient-form/menu-item-ingredient-form.component';

// Modifiers
import { ModifiersComponent } from './modifiers/modifiers.component';
import { ModifierListComponent } from './modifiers/modifier-list/modifier-list.component';
import { ModifierFormComponent } from './modifiers/modifier-form/modifier-form.component';
import { MenuDashboardComponent } from './menu-dashboard/menu-dashboard.component';

// (Optional) Menu Item Modifier Mapping if you want in future

// const routes: Routes = [];

const routes: Routes = [
  { path: '', redirectTo: 'menu-items', pathMatch: 'full' },

  //dashboard 
   //
   { path: 'dashboard', component: MenuDashboardComponent },
 
  // Categories
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/list', component: CategoryListComponent },
  { path: 'categories/add', component: CategoryFormComponent },
  { path: 'categories/edit/:id', component: CategoryFormComponent },

  // Menu Items
  { path: 'menu-items', component: MenuItemsComponent },
  { path: 'menu-items/list', component: MenuItemListComponent },
  { path: 'menu-items/add', component: MenuItemFormComponent },
  { path: 'menu-items/edit/:id', component: MenuItemFormComponent },
  { path: 'menu-items/detail/:id', component: MenuItemDetailComponent },

  // Menu Item Ingredients Mapping
  // { path: 'menu-items/:id/ingredients', component: MenuItemIngredientsComponent }, no need 
  { path: 'menu-items/ingredients', component: MenuItemIngredientsComponent }, // main with sub pages
  { path: 'menu-items/:id/ingredients/list', component: MenuItemIngredientListComponent },
  { path: 'menu-items/ingredients/list', component: MenuItemIngredientListComponent },
  { path: 'menu-items/ingredients/form', component: MenuItemIngredientFormComponent },

  // Modifiers
  { path: 'modifiers', component: ModifiersComponent },
  { path: 'modifiers/list', component: ModifierListComponent },
  { path: 'modifiers/add', component: ModifierFormComponent },
  { path: 'modifiers/edit/:id', component: ModifierFormComponent }

  // (Future) Menu Item Modifier Mapping can follow same pattern
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuManagementRoutingModule { 
  
}
