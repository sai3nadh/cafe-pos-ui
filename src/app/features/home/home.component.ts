import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Add this import

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  category: number;
  price: number;
  qty?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,  // To enable ngModel for form binding
    RouterModule, // To enable routerLink
    CommonModule, // Add CommonModule here to make ngFor and ngIf work
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  ngOnInit() {
    console.log('Categories:', this.categories);
    console.log('Items:', this.items);
  }
  
  categories: Category[] = [
    { id: 1, name: 'Beverages' },
    { id: 2, name: 'Snacks' },
    { id: 3, name: 'Meals' },
    { id: 4, name: 'Desserts' },
    { id: 5, name: 'Drinks' },
    { id: 6, name: 'Fruits' },
    { id: 7, name: 'Vegetables' },
  ];

  items: Item[] = [
    { id: 1, name: 'Coffee', category: 1, price: 2.50 },
    { id: 2, name: 'Tea', category: 1, price: 2.00 },
    { id: 3, name: 'Soda', category: 1, price: 3.00 },
    { id: 4, name: 'Chips', category: 2, price: 1.50 },
    { id: 5, name: 'Popcorn', category: 2, price: 2.00 },
    { id: 6, name: 'Burger', category: 3, price: 5.00 },
    { id: 7, name: 'Sandwich', category: 3, price: 4.50 },
    { id: 8, name: 'Coffee', category: 1, price: 2.50 },
    { id: 9, name: 'Tea', category: 1, price: 2.00 },
    { id: 10, name: 'Soda', category: 1, price: 3.00 },
    { id: 11, name: 'Coffee', category: 1, price: 2.50 },
    { id: 12, name: 'Tea', category: 1, price: 2.00 },
    { id: 13, name: 'Soda', category: 1, price: 3.00 },
  ];

  selectedCategory: Category | null = null;
  cart: Item[] = [];
  guestName: string = '';

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  getItemsByCategory(categoryId: number): Item[] {
    return this.items.filter(item => item.category === categoryId);
  }

  addToCart(item: Item) {
    const existingItem = this.cart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      this.cart.push({ ...item, qty: 1 });
    }
  }

  updateCartItem(item: Item) {
    if (item.qty && item.qty <= 0) {
      this.cart = this.cart.filter(i => i.id !== item.id);
    }
  }

  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
  }

  checkout() {
    console.log('Checking out:', { guestName: this.guestName, cart: this.cart });
  }

  logout() {
    console.log('Logging out...');
  }

  goToDrafts() {
    console.log('Going to Drafts...');
  }

  goToPrevOrders() {
    console.log('Going to Previous Orders...');
  }

  goToAllOrders() {
    console.log('Going to All Orders...');
  }
}
