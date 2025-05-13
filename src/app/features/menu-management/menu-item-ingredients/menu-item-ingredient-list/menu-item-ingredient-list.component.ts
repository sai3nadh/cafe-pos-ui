import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItemService } from '../../services/menu-item.service';
import { IngredientMappingService } from '../../services/ingredient-mapping.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItemIngredient, MenuItemWithIngredients } from '../../models/ingredient-mapping.model';

@Component({
  selector: 'app-menu-item-ingredient-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './menu-item-ingredient-list.component.html',
  styleUrl: './menu-item-ingredient-list.component.scss'
})
export class MenuItemIngredientListComponent implements OnInit  {

  // @Output() viewItem = new EventEmitter<any>();
  @Output() viewItemEvent = new EventEmitter<MenuItemWithIngredients>();

  // menuItems: any[] = [];
  menuItems: MenuItemWithIngredients[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';

  constructor(private ingredientMappingService: IngredientMappingService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.ingredientMappingService.getAllMenuItemsWithIngredients()
      .subscribe(data => {
        this.menuItems = data;
        this.extractCategories();
      });
  }

  extractCategories(): void {
    const unique = new Set(this.menuItems.map(m => m.categoryName));
    this.categories = Array.from(unique);
    this.categories.unshift('All');
  }

  get filteredMenuItems(): MenuItemWithIngredients[] {
    if (this.selectedCategory === 'All') {
      return this.menuItems;
    }
    return this.menuItems.filter(m => m.categoryName === this.selectedCategory);
  }

  // viewItem(menuItem: any): void {
  //   // TODO: Open detail view or navigate to the mapping editor page.
  //   alert(`View/Edit Ingredients for: ${menuItem.menuItemName}`);
  // }

  // viewItem(menuItem: MenuItemWithIngredients): void {
  //   this.viewItem.emit(menuItem);
  // }
  viewItem(menuItem: MenuItemWithIngredients): void {
    this.viewItemEvent.emit(menuItem);
  }
  

  getIngredientNames(item: { ingredients: MenuItemIngredient[] }): string {
    if (!item.ingredients || item.ingredients.length === 0) {
      return '-';
    }
    return item.ingredients.map(i => i.ingredientName).join(', ');
  }
  
  // getIngredientNames(item: any): string {
  //   if (!item.ingredients || item.ingredients.length === 0) {
  //     return '-';
  //   }
  //   return item.ingredients.map((i:any) => i.ingredientName).join(', ');
  // }
  

}
