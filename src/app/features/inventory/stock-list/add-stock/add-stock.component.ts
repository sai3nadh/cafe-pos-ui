import { Component } from '@angular/core';
import { StockItem } from '../stock-list.component';
import { CommonModule } from '@angular/common';
import {  EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-stock',
  imports: [
    CommonModule
  ],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.scss'
})
export class AddStockComponent {

  showAddStockForm = false;

  // showAddStockForm = false;
  stocks: StockItem[] = [
    { id: 1, name: 'Sugar', unit: 'Kg', quantity: 10 },
    { id: 2, name: 'Flour', unit: 'Kg', quantity: 25 },
    { id: 3, name: 'Milk', unit: 'Litre', quantity: 15 },
  ];

  openAddStockForm() {
    this.showAddStockForm = true;
  }

  closeAddStockForm() {
    this.showAddStockForm = false;
  }

  addStock(newStock: StockItem) {
    this.stocks.push(newStock);
    this.closeAddStockForm();
  }

  deleteStock(id: number) {
    this.stocks = this.stocks.filter(stock => stock.id !== id);
  }
}
