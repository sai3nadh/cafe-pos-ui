import { Component } from '@angular/core';
import { AddStockComponent } from './add-stock/add-stock.component';
import { CommonModule } from '@angular/common';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../models/ingredient.model';

export interface StockItem {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

@Component({
  selector: 'app-stock-list',
  imports: [
    CommonModule],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss'
})
export class StockListComponent {


  constructor(private ingredientService: IngredientService) {}
  ingredients: Ingredient[] = [];
  isLoading:boolean = true;
  error: string = '';

 
  ngOnInit(): void {
    this.loadIngredients();
  }
  // showAddStockForm = false; // control visibility
  // // showAddStockForm = false;
  // stocks: StockItem[] = [
  //   { id: 1, name: 'Sugar', unit: 'Kg', quantity: 10 },
  //   { id: 2, name: 'Flour', unit: 'Kg', quantity: 25 },
  //   { id: 3, name: 'Milk', unit: 'Litre', quantity: 15 },
  // ];

  // openAddStockForm() {
  //   this.showAddStockForm = true;
  // }

  // closeAddStockForm() {
  //   this.showAddStockForm = false;
  // }

  // addStock(newStock: StockItem) {
  //   this.stocks.push(newStock);
  //   this.closeAddStockForm();
  // }

  // deleteStock(id: number) {
  //   this.stocks = this.stocks.filter(stock => stock.id !== id);
  // }

  loadIngredients(): void {
    this.ingredientService.getAllIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load ingredients';
        this.isLoading = false;
      },
    });
  }

  // constructor(private dialog: MatDialog) {}

  // openAddStockDialog() {
  //   this.dialog.open(AddStockComponent, {
  //     width: '500px',
  //     data: {} // you can pass initial data if needed
  //   });
  // }
  // openAddStockForm() {
  //   this.showAddStockForm = true;
  // }

  // closeAddStockForm() {
  //   // this.showAddStockForm = false;
  // }
}
