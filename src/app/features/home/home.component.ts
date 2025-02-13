import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Add this import
import { OrderService } from './order.service'; // Import the service
import { StorageService } from '../services/storage.service';

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


interface Item {
  id: number;
  name: string;
  price: number;
  qty?: number;
}

interface Order {
  id: number;
  time: string;
  status: string;
  items: Item[];
  total: number;
}
@Component({
    selector: 'app-home',
    imports: [
        FormsModule, // To enable ngModel for form binding
        RouterModule, // To enable routerLink
        CommonModule, // Add CommonModule here to make ngFor and ngIf work
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router, private orderService: OrderService
    , private storageService: StorageService
  ) {}
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
    { id: 8, name: 'Iced Coffee', category: 1, price: 2.50 },
    { id: 9, name: 'Green Tea', category: 1, price: 2.00 },
    { id: 10, name: 'Lemonade', category: 1, price: 2.50 },
    { id: 11, name: 'Hot Chocolate', category: 1, price: 3.00 },
    { id: 12, name: 'Fruit Punch', category: 1, price: 2.50 },
    { id: 13, name: 'Sparkling Water', category: 1, price: 3.00 }
  ];

  showOrders: boolean = false;  // Control visibility of orders modal

  ordersq: Order[] = [
    { 
      id: 1, 
      time: '10:00 AM', 
      status: 'Pending', 
      items: [
        { id: 1, name: 'Coffee', price: 2.5, category: 1 },  // Add the category
        { id: 2, name: 'Tea', price: 2.0, category: 1 }     // Add the category
      ], 
      total: 4.5 
    },
    { 
      id: 2, 
      time: '11:00 AM', 
      status: 'Completed', 
      items: [
        { id: 3, name: 'Soda', price: 3.0, category: 1 },
        { id: 4, name: 'Chips', price: 1.5, category: 2 }
      ], 
      total: 4.5 
    },
    // Add more orders as needed
  ];
  orders: Order[] = [
    { 
      id: 1, 
      time: '10:00 AM', 
      status: 'Pending', 
      items: [
        { id: 1, name: 'Coffee', price: 2.5, category: 1, qty: 2 },  // Coffee with qty 2
        { id: 2, name: 'Tea', price: 2.0, category: 1, qty: 3 }     // Tea with qty 3
      ], 
      total: 13.0  // total = (2 * 2.5) + (3 * 2.0)
    },
    { 
      id: 2, 
      time: '11:00 AM', 
      status: 'Completed', 
      items: [
        { id: 3, name: 'Soda', price: 3.0, category: 1, qty: 1 }, // Soda with qty 1
        { id: 4, name: 'Chips', price: 1.5, category: 2, qty: 5 }  // Chips with qty 5
      ], 
      total: 10.5  // total = (1 * 3.0) + (5 * 1.5)
    }
  ];
  
  
// Method to populate the cart with the selected order's items
editOrder(order: Order) {
  this.cart = order.items.map(item => ({
    ...item,
    qty: item.qty || 1,      // Set default qty to 1 if not defined
    category: item.category,  // Ensure category is included
  }));

  // Close the modal after selecting the order
  this.showOrders = false;
}


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
    this.closeDropdown();
    const existingItem = this.cart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      this.cart.push({ ...item, qty: 1 });
    }
  }

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

  // Method to select payment type
  selectPaymentType(type: string) {
    this.selectedPaymentType = type;
  }

  // Trigger Checkout Modal
  checkout() {
    this.showCheckoutModal = true;
    this.closeDropdown();
  }

  // Close Checkout Modal
  closeCheckoutModal() {
    this.showCheckoutModal = false;
    this.partialPayMode = false;
    this.partialPayAmount = 0;
    this.isPartialAmountValid = false;
  }

  // Handle Full Pay
  // confirmFullPay() {
  //   const totalAmount = this.getTotal();
  //   console.log(`Payment Confirmed: ${totalAmount}, Type: ${this.selectedPaymentType}`);
  //   this.closeCheckoutModal();
  //   // Add your payment processing logic here
  // }

  // Handle Partial Pay
  confirmPartialPay() {
    this.partialPayMode = true;
  }

  // Validate Partial Payment Amount
  validatePartialPayAmount() {
    const totalAmount = this.getTotal();
    this.isPartialAmountValid = this.partialPayAmount > 0 && this.partialPayAmount <= totalAmount;
  }

  // Submit Partial Pay
  submitPartialPay() {
    console.log(`Partial Payment Confirmed: ${this.partialPayAmount}, Type: ${this.selectedPaymentType}`);
    this.closeCheckoutModal();
    // Add your payment processing logic here
  }

  // Example Function to Calculate Total
  getTotal() {
    return this.cart.reduce((acc, item) => acc + (item.price * (item.qty ?? 1)), 0);
  }

  logout() {
    // Clear all session data from storage
    this.storageService.clearAllLocalVariables();
    this.router.navigate(['/login']);
    console.log('Logging out...');
  }

  users() {
    this.router.navigate(['/user']);
    console.log('Users page...');
  }

  goToHome() {
    this.cart=[];
    console.log('Going to Drafts...');
    this.closeDropdown();
  }

  goToDrafts() {
    this.closeDropdown();
    console.log('Going to Drafts...');
  }

  goToPrevOrders() {
    this.closeDropdown();
    console.log('Going to Previous Orders...');
  }

  goToAllOrders() {
    this.closeDropdown();
    console.log('Going to All Orders...');
  }

   // Toggle dropdown visibility
   toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Toggle dropdown visibility
  closeDropdown() {
    this.dropdownVisible = false;
  }
  // View Profile action
  viewProfile() {
    // Add your logic for viewing profile here
    console.log('Viewing profile');
  }

  // Report action
  report() {
    // Add your logic for reporting here
    console.log('Reporting');
  }



  // Handle Full Pay
  confirmFullPay() {
    const totalAmount = this.getTotal();
    console.log(`Payment Confirmed: ${totalAmount}, Type: ${this.selectedPaymentType}`);
    this.closeCheckoutModal();
   
    // Create the order object with the required format
    const orderData = {
      userId: null, // You'll need to replace this with the logged-in user's ID if applicable
      status: 'Pending', // Status can be adjusted based on your system's logic
      total: totalAmount,
      customerId: null, // Replace with customer ID, if applicable
      orderItems: this.cart.map(item => ({
        orderId: 0, // Set to the appropriate order ID if needed
        menuItemId: item.id,
        quantity: item.qty || 1,
        price: item.price
      }))
    };

    // Call the service to create the order
    this.orderService.createOrder(orderData).subscribe(
      response => {
        console.log('Order created successfully:', response);
        this.closeCheckoutModal();
        this.cart = []; // Clear the cart after order creation
      },
      error => {
        console.error('Error creating order:', error);
      }
    );
  }

}
