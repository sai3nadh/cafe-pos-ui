import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingredient } from '../../../inventory/models/ingredient.model';
import { IngredientService } from '../../../inventory/services/ingredient.service';
import { MenuItemIngredient } from '../../models/ingredient-mapping.model';
import { IngredientMappingService } from '../../services/ingredient-mapping.service';
import { MenuItemService } from '../../services/menu-item.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-menu-item-ingredient-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './menu-item-ingredient-form.component.html',
  styleUrl: './menu-item-ingredient-form.component.scss'
})
export class MenuItemIngredientFormComponent implements OnInit  {

  
  @Input() menuItemId!: number;
  @Output() cancel = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  // menuItemDetails: any = {};
  menuItemDetails!: MenuItem;

  ingredientMappings: MenuItemIngredient[] = [];
  allIngredients: Ingredient[] = [];

  // For adding new ingredient
  newIngredientId: number | null = null;
  newQuantity: number | null = null;
  newUnit: string = '';

  // For inline editing
  editId: number | null = null;
  editQuantity: number | null = null;
  editUnit: string = '';

  constructor(
    private menuItemService: MenuItemService,
    private ingredientMappingService: IngredientMappingService,
    private ingredientService: IngredientService
  ) {}

  ngOnInit(): void {
    this.loadMenuItem();
    this.loadIngredients();
  }

  loadMenuItem(): void {
    this.menuItemService.getMenuItemById(this.menuItemId).subscribe({
      next: (menuItem: MenuItem) => {
        this.menuItemDetails = menuItem;
      },
      error: (err) => {
        console.error('Failed to load menu item', err);
      }
    });
  
    this.ingredientMappingService.getMenuItemIngredientMapping(this.menuItemId).subscribe({
      next: (data) => {
        this.ingredientMappings = data.ingredients;
      },
      error: (err) => {
        console.error('Failed to load ingredient mappings', err);
      }
    });
  }
  

  loadIngredients(): void {
    this.ingredientService.getAllIngredients().subscribe(ingredients => {
      this.allIngredients = ingredients;
    });
  }

  startEdit(mapping: MenuItemIngredient): void {
    this.editId = mapping.menuIngrId;
    this.editQuantity = mapping.quantity;
    this.editUnit = mapping.unit;
  }

  saveEdit(mapping: MenuItemIngredient): void {
    this.ingredientMappingService.updateMapping(
      this.menuItemId,
      mapping.menuIngrId,
      this.editQuantity!,
      this.editUnit
    ).subscribe(() => {
      mapping.quantity = this.editQuantity!;
      mapping.unit = this.editUnit;
      this.editId = null;
    });
  }

  cancelEdit(): void {
    this.editId = null;
  }

  addMapping(): void {
    if (this.selectedIngredient && this.newQuantity !== null) {
      this.ingredientMappingService.addMapping(
        this.menuItemId,
        this.selectedIngredient.ingredientId,
        this.newQuantity,
        this.selectedIngredient.unit
      ).subscribe(() => {
        this.loadMenuItem();
        this.selectedIngredient = null;
        this.newQuantity = null;
      });
    }
  }
  
  // addMappingOld(): void {
  //   if (this.newIngredientId && this.newQuantity && this.newUnit) {
  //     this.ingredientMappingService.addMapping(
  //       this.menuItemId,
  //       this.newIngredientId,
  //       this.newQuantity,
  //       this.newUnit
  //     ).subscribe(() => {
  //       this.loadMenuItem();
  //       this.newIngredientId = null;
  //       this.newQuantity = null;
  //       this.newUnit = '';
  //     });
  //   }
  // }

  deleteMapping(mappingId: number): void {
    const confirmed = confirm('Are you sure you want to delete this mapping?');
    if (confirmed) {
      this.ingredientMappingService.deleteMapping(mappingId).subscribe(() => {
        this.loadMenuItem();
      });
    }
  }

  goBack(): void {
    this.cancel.emit();
  }

  selectedIngredient: any = null;
  // newQuantity: number = 0;

  // addMapping() {
  //   if (this.selectedIngredient && this.newQuantity > 0) {
  //     const newMapping = {
  //       menuIngrId: this.generateId(), // or your ID logic
  //       ingredientId: this.selectedIngredient.ingredientId,
  //       ingredientName: this.selectedIngredient.name,
  //       quantity: this.newQuantity,
  //       unit: this.selectedIngredient.unit
  //     };
  //     this.ingredientMappings.push(newMapping);
  //     // Clear form
  //     this.selectedIngredient = null;
  //     this.newQuantity = 0;
  //   }
  // }
}
