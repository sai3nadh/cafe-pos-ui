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
     // Find the category with the name "Beverages"
  const selectedCategory = this.categories.find(category => category.name === "Beverages");
  
  // If the category is found, select it
  if (selectedCategory) {
    this.selectCategory(selectedCategory);
  }
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

  showDeleteModal = false;
  itemToDeleteIndex: number | null = null;
  showToast = false;

  dropdownVisible = false;
  //below for checkout confirmation
  showCheckoutModal = false;
  partialPayMode = false;
  partialPayAmount: number = 0;
  isPartialAmountValid = false;
  selectedPaymentType: string = 'cash'; // Default payment type

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

  //  // Method to show confirmation and delete item
  //  confirmDeleteItem(index: number) {
  //   const isConfirmed = confirm('Do you really want to remove this item from your cart?');
  //   if (isConfirmed) {
  //     this.cart.splice(index, 1);  // Remove the item from the cart array
  //   }
  // }

   // Method to show the confirmation modal
   confirmDeleteItem(index: number) {
    this.itemToDeleteIndex = index;  // Store the index of the item to be deleted
    this.showDeleteModal = true;     // Show the modal
    console.log("clicked here...");
    // Hide the toast after 5 seconds
    setTimeout(() => {
      console.log("Timer triggered: Hiding toast...");
      this.showToast = false;
      this.showDeleteModal = false;     // Show the modal
    }, 5000); // 5000 ms = 5 seconds
    
  }

  // Method to delete the item from the cart
  deleteItem() {
    if (this.itemToDeleteIndex !== null) {
      this.cart.splice(this.itemToDeleteIndex, 1);  // Remove the item from the cart
    }
    this.showToast = false;  // Hide the toast
    this.showDeleteModal = false;  // Close the modal
    this.itemToDeleteIndex = null; // Reset the index
  }

  // Method to cancel the deletion
  cancelDelete() {
    this.showDeleteModal = false;  // Close the modal without deleting
    this.itemToDeleteIndex = null; // Reset the index
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

   // Toggle dropdown visibility
   toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // View Profile action
  viewProfile() {
    // Add your logic for viewing profile here
    console.log('Viewing profile');
  }

  // // Logout action
  // logout() {
  //   // Add your logic for logging out here
  //   console.log('Logging out');
  // }

  // Report action
  report() {
    // Add your logic for reporting here
    console.log('Reporting');
  }
}
