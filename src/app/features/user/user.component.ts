// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-user',
//   standalone: true,
//   imports: [],
//   templateUrl: './user.component.html',
//   styleUrl: './user.component.scss'
// })
// export class UserComponent {

// }


// == bleo old good
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Add this import
import { OrderDto, OrderService } from '../home/order.service'; // Import the service
import { CategoryService } from '../home/category.service'; // Import the service
import { StorageService } from '../services/storage.service';
import { ElementRef, HostListener } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';

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


interface User {
  id: number;
  name: string;
  avatar: string;
}
// interface Item {
//   id: number;
//   name: string;
//   price: number;
//   qty?: number;
// }

interface HistoricalItem {
  id: number;
  name: string;
  price: number;
  category: number;
  qty?: number;
  status?: 'Paid' | 'Pending';
}

// Define an interface that represents the category data from your API.
export interface ApiCategory {
  categoryId: number;
  name: string;
  version: number;
  menuItems: any[]; // You can create a more specific interface if needed
}

interface Order {
  id: number;
  time: string;
  status: string;
  items: Item[];
  total: number;
  orderNumber: string;      // Order number (e.g., "110220251001")
}
@Component({
    selector: 'app-home',
    imports: [
        FormsModule, // To enable ngModel for form binding
        RouterModule, // To enable routerLink
        CommonModule, // Add CommonModule here to make ngFor and ngIf work
    ],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
  categories: Category[] = [];
  constructor(private router: Router, private orderService: OrderService
    , private storageService: StorageService, private categoryService : CategoryService
    ,private elRef: ElementRef
    ,private wsService: WebSocketService
  ) {}
  ngOnInit() {
    console.log('Categories:', this.categories);
    console.log('Items:', this.items);
    this.userId = this.storageService.getLocalVariable("userId");
    const userId = this.storageService.getLocalVariable('userId');
    const username = this.storageService.getLocalVariable('username');

    if (!(userId && username)) {
      // If user data exists, redirect to home
      this.router.navigate(['/login']);
    }
    this.editOrderId=-1;
    if(localStorage.getItem('zoomLevel')!=null){
    document.body.style.zoom = `${Number(localStorage.getItem('zoomLevel')) * 100}%`;
  }
     // Find the category with the name "Beverages"
  // const selectedCategory = this.categories.find(category => category.name === "Beverages");
  
  // If the category is found, select it
  // if (selectedCategory) {
  //   this.selectCategory(selectedCategory);
  // }
  // this.testPrint();
  this.loadCat();
// //below to connect rabbit
//   this.wsService.connect(); // ✅ Ensure WebSocket connects on init
//   this.sendOrder();

// Call this function to test the printer
// this.testPrint();
  }
 
  order: string = "Order#123"; // Example order

  sendOrder() {
    console.log("🔍 Sending Order:", this.order);
    this.wsService.sendMessage(this.order);
  }

//    testPrint() {
// alert("call test method");
//     const printerIp = "192.168.0.2"; // Replace with your printer's IP
//     const printerPort = 9100; // Default network printer port

//     const socket = new WebSocket(`http://${printerIp}:${printerPort}`);

//     socket.onopen = function () {
//         console.log("✅ Connection to printer established!");

//         // ESC/POS Commands (Basic Test Print)
//         let printData = "\x1B\x40"; // Initialize printer
//         printData += "\x1B\x21\x30"; // Set large bold font
//         printData += "CAFE SISILI\n"; // Print a test title
//         printData += "\x1B\x21\x00"; // Reset font
//         printData += "Test Print Successful!\n";
//         printData += "\n\n";
//         printData += "\x1D\x56\x00"; // Cut paper

//         // Send data as an ArrayBuffer
//         socket.send(new TextEncoder().encode(printData));

//         setTimeout(() => {
//             socket.close();
//             console.log("🔌 Connection closed.");
//         }, 2000);
//     };

//     socket.onerror = function (error) {
//         console.error("❌ Printer connection failed!", error);
//     };

//     socket.onclose = function () {
//         console.log("🔌 Connection to printer closed.");
//     };
// }



  ngOnDestroy() {
    this.wsService.disconnect(); // ✅ Disconnect WebSocket when leaving
  }
  loadCat() {
    this.categoryService.loadCategories().subscribe(
      (data: ApiCategory[]) => {
        this.categories = data.map(cat => ({
          id: cat.categoryId, // ✅ Map API field to `id`
          name: cat.name
        }));

        console.log('Categories loaded:', this.categories);


        // ✅ Step 2: Extract and Store Items from API
        this.items = data.flatMap(cat =>
          cat.menuItems.map(item => ({
            id: item.menuItemId,
            name: item.name,
            category: cat.categoryId, // Assign the correct category
            price: item.price
          }))
        );

        console.log('Items loaded:', this.items);
        
        // Select default category if necessary
        // const selectedCategory = this.categories.find(cat => cat.name === 'Beverages');
        if (this.categories.length>0) {
          this.selectCategory(this.categories[0]);
        }
      },
      error => {
        console.error('Error loading categories', error);
      }
    );
  }

  
  // Example method to handle category selection
  selectCategory(category: Category) {
    this.selectedCategory = category;

    console.log('Selected category:', this.selectedCategory);
  }
  
  items: Item[] = [];

 // Define showUsers to control the visibility of user list
 showUsers: boolean = false;
 searchTerm: string = '';

  showOrders: boolean = false;  // Control visibility of orders modal
  showOrdersIcon: boolean = false;  // Control visibility of orders modal
  editOrderId: number = -1;
  // cart: Item[] = [];
  // orders: Order[] = [
  //   { id: 1, time: '10:00 AM', status: 'Pending', items: [{ id: 1, name: 'Coffee', price: 2.5 }, { id: 2, name: 'Tea', price: 2.0 }], total: 4.5 },
  //   { id: 2, time: '11:00 AM', status: 'Completed', items: [{ id: 3, name: 'Soda', price: 3.0 }, { id: 4, name: 'Chips', price: 1.5 }], total: 4.5 },
  //   // Add more orders as needed
  // ];
  
  orders: Order[] = [];
  //   { 
  //     id: 1, 
  //     time: '10:00 AM', 
  //     status: 'Pending', 
  //     items: [
  //       { id: 1, name: 'Coffee', price: 2.5, category: 1, qty: 2 },  // Coffee with qty 2
  //       { id: 2, name: 'Tea', price: 2.0, category: 1, qty: 3 }     // Tea with qty 3
  //     ], 
  //     total: 13.0  // total = (2 * 2.5) + (3 * 2.0)
  //   },
  //   { 
  //     id: 2, 
  //     time: '11:00 AM', 
  //     status: 'Completed', 
  //     items: [
  //       { id: 3, name: 'Soda', price: 3.0, category: 1, qty: 1 }, // Soda with qty 1
  //       { id: 4, name: 'Chips', price: 1.5, category: 2, qty: 5 }  // Chips with qty 5
  //     ], 
  //     total: 10.5  // total = (1 * 3.0) + (5 * 1.5)
  //   }
  // ];
  
   // Define an array of users
   users: User[] = [
    { id: 1, name: 'John Doe', avatar: 'https://github.com/nutlope.png' },
    { id: 2, name: 'Jane Doe', avatar: 'https://github.com/nutlope.png' },
    { id: 3, name: 'Bob Smith', avatar: 'https://github.com/nutlope.png' },
    { id: 4, name: 'Alice Johnson', avatar: 'https://github.com/nutlope.png' },
    { id: 5, name: 'Mike Brown', avatar: 'https://github.com/nutlope.png' },
    { id: 6, name: 'Emily Davis', avatar: 'https://github.com/nutlope.png' },
    { id: 7, name: 'David Lee', avatar: 'https://github.com/nutlope.png' },
  ];
  // All orders fetched from the API
  allOrders: OrderDto[] = [];
  // Orders to display after filtering
  filteredOrders: OrderDto[] = [];
  // Current filter status
  selectedStatus: string = 'All';
  selectedOrder: any = null;
  // Whether modal is open
  // showOrders: boolean = false;
  // You might have a logged-in user id
  userId: number = -1; // example user id
  
  // Call this method when you want to open the modal
  openModal(): void {
    this.showOrders = true;
    // Load orders only if they haven't been loaded before
    // if (this.allOrders.length === 0) {
      this.orderService.getOrdersForUserToday(this.userId).subscribe((orders: OrderDto[]) => {
        this.allOrders = orders;
        // Apply default filter (for example, "Pending")
        this.filterOrders(this.selectedStatus);
      });
    // }
  }


  // Call this method when you want to open the modal
  toggleOrdersModal(): void {
    // this.showOrdersIcon = !this.showOrdersIcon;
    // Load orders only if they haven't been loaded before
    // if (this.allOrders.length === 0) {
      this.selectedStatus= "Pending";
      this.orderService.getOrdersForUserToday(this.userId).subscribe((orders: OrderDto[]) => {
        this.allOrders = orders;
        // Apply default filter (for example, "Pending")
        // this.filterOrders(this.selectedStatus);
        this.handleFilterChange(this.selectedStatus);
      });
      console.log("all orders - test");
      console.log(this.allOrders);
    // }
  }
  toggleOrdersModalClose(){
    this.showOrdersIcon = false;
  }
  handleFilterChange(status: string): void {
    this.selectedStatus = status;
    
    if (status === 'All') {
      this.filteredOrders = this.allOrders;
    } else {
      this.filteredOrders = this.allOrders.filter(order => order.status === status);
    }
  }

  //move order to the finished state
  finishOrder(selectedOrder: Order){
    // alert("se"+selectedOrder);
    // console.log("seee--",selectedOrder);
      // Assuming selectedOrder is the ID of the order to complete
  this.orderService.completeOrder(selectedOrder.id).subscribe(
    response => {
      console.log('Order completed successfully', response);
      // Optionally, you can update the orders or handle UI changes here
      this.toggleOrdersModal();
      this.filterOrders(this.selectedStatus); // To reapply any filters you have
      // this.toggleOrdersModal();
    },
    error => {
      console.error('Error completing the order', error);
      // You can display a message or handle the error accordingly
    }
  );
  }
  
    // Function to handle the order click and show details
    showOrderDetails(order: any): void {
      if (this.selectedOrder === order) {
        this.selectedOrder = null;  // Close the order details if clicked again
      } else {
        this.selectedOrder = order;  // Show the order details
      }
    }

    emptyCart(){
      this.cart=[];
      this.guestName="";
      this.editOrderId=-1;
    }

  // Filter the already fetched orders based on the selected status
  // filterOrders(status: string): void {
  //   this.selectedStatus = status;
  //   this.filteredOrders = this.allOrders.filter(order => order.status === status);
  // }

  filterOrders(status: string): void {
    this.selectedStatus = status;
    this.filteredOrders = this.allOrders.filter(order =>
      order.status.toLowerCase() === status.toLowerCase()
    );
  }
// Method to populate the cart with the selected order's items
editOrder(order: Order) {
  this.cart = order.items.map(item => ({
    ...item,
    qty: item.qty || 1,      // Set default qty to 1 if not defined
    category: item.category,  // Ensure category is included
  }));
this.guestName="edit Order - #"+order.orderNumber.slice(-3);
this.editOrderId=order.id;

  // Close the modal after selecting the order
  this.showOrders = false;
}
usersmenu() {
  this.router.navigate(['/user']);
  console.log('Users page...');
}
// Method to toggle user list visibility
toggleUsers() {
  this.showUsers = !this.showUsers;
}
// Method to filter users based on search term
filteredUsers(): User[] {
  return this.users.filter(user =>
    user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
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
  selectedUser: User | null = null;

  selectedCategory: Category | null = null;
  cart: Item[] = [];
  guestName: string = '';
  // Somewhere near other properties
  // previousCart: Item[] = [];
  previousCart: HistoricalItem[] = [];

  // selectCategory(category: Category) {
  //   this.selectedCategory = category;
  // }

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

   // Close dropdown when clicked outside
   @HostListener('document:click', ['$event'])
   onClick(event: MouseEvent) {
     const dropdownElement = this.elRef.nativeElement.querySelector('.dropdown-menu');
     if (this.dropdownVisible && dropdownElement && !dropdownElement.contains(event.target as Node)) {
       this.dropdownVisible = false; // Close the dropdown
     }
   }
 
   // Close dropdown when Esc key is pressed
   @HostListener('document:keydown', ['$event'])
   onKeydown(event: KeyboardEvent) {
     if (event.key === 'Escape' && this.dropdownVisible) {
      //  this.dropdownVisible = false; // Close the dropdown
       this.closeAllModals();

     }
   }

   // Close all modals and dropdowns
  closeAllModals() {
    this.dropdownVisible = false;
    this.showOrders = false;
    this.showOrdersIcon = false;
    this.showUsers = false;
    this.showDeleteModal = false;
    this.showCheckoutModal = false;
  }

  remove(item: Item) {
    
    // remove(item: Item) {
      this.closeDropdown();
      this.cart = this.cart.filter(i => i.id !== item.id);
    // }
    
    // this.closeDropdown();
    // const existingItem = this.cart.find(i => i.id === item.id);
    // if (existingItem) {
    //   this.cart.pop({...item, qty :0});
    //   // existingItem.qty = (existingItem.qty || 1) - 1;
    // } 
    // else {
    //   this.cart.push({ ...item, qty: 1 });
    // }
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
  // getTotal(): number {
  //   return this.cart.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
  // }

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

  // // Handle Full Pay
  // confirmFullPay() {
  //   const totalAmount = this.getTotal();
  //   console.log(`Payment Confirmed: ${totalAmount}, Type: ${this.selectedPaymentType}`);
  //   this.closeCheckoutModal();
  //   // Add your payment processing logic here
  // }

  
  // Handle Full Pay
  confirmFullPay() {
    const totalAmount = this.getTotal();
    console.log(`Payment Confirmed: ${totalAmount}, Type: ${this.selectedPaymentType}`);
    this.closeCheckoutModal();
   
    if(this.editOrderId != -1){

        // Create the order object with the required format
      const editOrderData = {
        orderId:this.editOrderId,
        userId: this.storageService.getLocalVariable('userId'),//this.selectedUser?.id, // You'll need to replace this with the logged-in user's ID if applicable
        status: 'Pending', // Status can be adjusted based on your system's logic
        total: totalAmount,
        customerId: this.selectedUser?.id, // Replace with customer ID, if applicable
        orderItems: this.cart.map(item => ({
          orderId: this.editOrderId, // Set to the appropriate order ID if needed
          menuItemId: item.id,
          quantity: item.qty || 1,
          price: item.price
        }))
      };

      // Call the service to create the order
      this.orderService.editOrder(editOrderData).subscribe(
        response => {
          console.log('Order created successfully:', response);
          this.closeCheckoutModal();
          this.cart = []; // Clear the cart after order creation
          this.previousCart = [];
          this.guestName = "";
        },
        error => {
          console.error('Error creating order:', error);
        }
      );
      this.cart = []; // Clear the cart after order creation
          this.previousCart = [];
          this.guestName='';
    }else{
    // Create the order object with the required format
    const orderData = {
      userId: this.storageService.getLocalVariable('userId'),//this.selectedUser?.id, // You'll need to replace this with the logged-in user's ID if applicable
      status: 'Pending', // Status can be adjusted based on your system's logic
      total: totalAmount,
      customerId: this.selectedUser?.id, // Replace with customer ID, if applicable
      orderItems: this.cart.map(item => ({
        orderId: 0, // Set to the appropriate order ID if needed
        menuItemId: item.id,
        quantity: item.qty || 1,
        price: item.price
      }))
    };

    // Call the service to create the order
    this.orderService.createOrder(orderData).subscribe(
      (response: any) => {
        console.log('Order created successfully:', response);
        // Fire and forget the print request
        // Fire and forget the print order request
        this.orderService.printOrder(response.id).subscribe();
        // console.log('Order created successfully:-- id', response.id);
        // const createdOrder = {
        //   orderId: response.orderId,
        //   orderNumber: response.orderNumber,
        //   total: response.total,
        //   orderItems: response.orderItems.map((item: any) => ({
        //     name: item.menuItem.name, // Extract item name
        //     quantity: item.quantity,
        //     price: item.price
        //   }))
        // };


        // console.log("abcc");
        // console.log(createdOrder);
        // this.printReceiptOld();
        // this.printReceipt(response);
        this.closeCheckoutModal();
        this.cart = []; // Clear the cart after order creation
        this.previousCart = [];

      },
      error => {
        this.orderService.printOrder(66).subscribe();
     
        console.error('Error creating order:', error);
      }
    );
  }
  }

//   printReceipt(order : Order) {
//     alert("🖨️ Printing Order: " + order.id);

//     const printerIp = "192.168.0.2"; // Replace with your printer's IP
//     const printerPort = 9100; // Default network printer port

//     const socket = new WebSocket(`ws://${printerIp}:${printerPort}`);

//     socket.onopen = function () {
//         console.log("✅ Connection to printer established!");

//         // ESC/POS Commands (Basic Print)
//         let printData = "\x1B\x40"; // Initialize printer
//         printData += "\x1B\x21\x30"; // Set large bold font
//         printData += "CAFE SISILI\n"; // Print cafe name
//         printData += "\x1B\x21\x00"; // Reset font
//         printData += `Order ID: ${order.id || "N/A"}\n`;
//         printData += "--------------------------\n";

//         // Print Order Items
//         order.items.forEach((item : Item) => {
//             printData += `${item.id} x${item.qty} - ${item.price}\n`;
//         });

//         printData += "--------------------------\n";
//         printData += `Total: ₹${order.total}\n`;
//         printData += "\n\n";
//         printData += "\x1D\x56\x00"; // Cut paper

//         // Send data to printer
//         socket.send(new TextEncoder().encode(printData));

//         setTimeout(() => {
//             socket.close();
//             console.log("🔌 Connection closed.");
//         }, 2000);
//     };

//     socket.onerror = function (error) {
//         console.error("❌ Printer connection failed!", error);
//     };

//     socket.onclose = function () {
//         console.log("🔌 Connection to printer closed.");
//     };
// }

// printReceiptOldd() {
//   alert("dfadfd");
//   // 🔹 Mock order data
//   const order = {
//     orderId: 999, 
//     orderNumber: "200225118",
//     total: 80,
//     status: "Pending",
//     items: [
//       { id: 14, name: "Tea SP", qty: 4, price: 20 }
//     ]
//   };
//   alert("🖨️ Printing Order: " + order.orderId);

//   // 🔹 Replace with your printer's IP and port
//   const printerIp = "192.168.0.2"; // Change to your actual printer IP
//   const printerPort = 9100; // Default port for network receipt printers

//   // 🔹 Create a WebSocket connection
//   // const socket = new WebSocket(`ws://${printerIp}:${printerPort}`);
//   const socket = new WebSocket(`${printerIp}:${printerPort}`);
//   console.log("Connection to printer established!22");

//   socket.onopen = function () {
//       console.log("Connection to printer established!");

//       // 🔹 ESC/POS Print Commands (Format Receipt)
//       let printData = "\x1B\x40"; // Initialize printer
//       printData += "\x1B\x21\x30"; // Set large bold font
//       printData += "CAFE SISILI\n"; // Print cafe name
//       printData += "\x1B\x21\x00"; // Reset font
//       printData += `Order ID: ${order.orderNumber.substring(order.orderNumber.length - 3)}\n`;
//       printData += "--------------------------\n";

//       // 🔹 Print Order Items
//       order.items.forEach((item: any) => {
//           printData += `${item.name} x${item.qty} - ₹${item.price * item.qty}\n`;
//       });

//       printData += "--------------------------\n";
//       printData += `Total: ₹${order.total}\n`;
//       printData += "\n\n";
//       printData += "\x1D\x56\x00"; // Cut paper

//       // 🔹 Send data to printer
//       socket.send(new TextEncoder().encode(printData));

//       setTimeout(() => {
//           socket.close();
//           alert("closeeee");
//           console.log("🔌 Connection closed.");
//       }, 2000);
//   };

//   socket.onerror = function (error) {
//       console.error("❌ Printer connection failed!", error);
//       alert("⚠️ Failed to connect to printer. Check the network.");
//   };

//   socket.onclose = function () {
//       console.log("🔌 Connection to printer closed.");
//   };
// }

//   printReceiptOld() {
//     alert("🖨️ Simulating Order Print...");

//     // 🔹 Mock order data
//     const order = {
//       orderId: 999, 
//       orderNumber: "200225118",
//       total: 80,
//       status: "Pending",
//       items: [
//         { id: 14, name: "Tea SP", qty: 4, price: 20 }
//       ]
//     };

//     console.log("✅ Printing Order:", order);

//     // 🔹 ESC/POS Formatted Print Data (Simulated)
//     let printData = "\x1B\x40"; // Initialize printer
//     printData += "\x1B\x21\x30"; // Set large bold font
//     printData += "CAFE SISILI\n"; // Print cafe name
//     printData += "\x1B\x21\x00"; // Reset font
//     printData += `Order ID: ${order.orderNumber.substring(order.orderNumber.length - 3)}\n`;
//     printData += "--------------------------\n";

//     // 🔹 Print Order Items
//     order.items.forEach((item) => {
//         printData += `${item.name} x${item.qty} - ₹${item.price * item.qty}\n`;
//     });

//     printData += "--------------------------\n";
//     printData += `Total: ₹${order.total}\n`;
//     printData += "\n\n";
//     printData += "\x1D\x56\x00"; // Cut paper

//     console.log("🖨️ Print Data:", printData);

//     alert("✅ Mock Print Complete!");
//   }


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

  goToHome() {
    this.cart=[];
    // console.log('Going to Drafts...');
    this.router.navigate(['/user']);
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

  
// // Add a map of user IDs to “historical items” to simulate data (or fetch from API later)
// private userCartHistoryMap: { [userId: number]: Item[] } = {
//   1: [ { id: 100, name: 'Latte (history)', price: 3.0, category: 1, qty: 2 } ],
//   2: [ { id: 101, name: 'Cookies (history)', price: 1.0, category: 2, qty: 5 } ],
//   // etc.
// };

// This method is called when user is clicked in the users list
selectUser(user: User) {
  // For clarity, store the selected user if you want
  this.selectedUser = user;

  // Load the previous cart from your userCartHistoryMap (or from an API)
  this.previousCart = this.userCartHistoryMap[user.id] || [];

  // Optionally, clear the new cart or do other logic
  this.cart = [];

  // Hide or keep the users panel open
  this.showUsers = false; // if you want to auto-close
   // Automatically set the guestName input value
   this.guestName = user.name;
}

getPendingAmount(): number {
  // Sum up only the “Pending” items in this.previousCart
  return this.previousCart
    .filter(item => item.status === 'Pending')
    .reduce((acc, item) => acc + (item.price * (item.qty ?? 1)), 0);
}


// If you're storing them in userCartHistoryMap...
private userCartHistoryMap: { [userId: number]: HistoricalItem[] } = {
  1: [
    { id: 100, name: 'Latte (history)', price: 3.0, category: 1, qty: 2, status: 'Pending' },
    { id: 101, name: 'Croissant (history)', price: 2.0, category: 2, qty: 1, status: 'Paid' },
  ],
  2: [
    { id: 102, name: 'Cookies (history)', price: 1.0, category: 2, qty: 5, status: 'Pending' }
  ],
  
};


// // zoomLevel: number = 1; // Default zoom level (100%)
// // zoomModalVisible: boolean = false; // To track modal visibility

// // // Show Zoom Settings Modal
openZoomSettings(): void {
  this.zoomModalVisible = true;
}

// // // Close Zoom Settings Modal
closeZoomSettings(): void {
  this.zoomModalVisible = false;
}

// // Adjust Zoom Level (Triggered by slider)
// adjustZoom(event: any): void {
//   document.body.style.zoom = event.target.value; // Apply zoom to the body content
// }
zoomLevel = 1; // Default zoom level

zoomModalVisible = false; // Control visibility of the zoom modal

adjustZoom(event: any) {
  this.zoomLevel = event.target.value;
  this.applyZoom();
}

changeZoom(delta: number) {
  this.zoomLevel = Math.min(2, Math.max(0.5, this.zoomLevel + delta));
  // this.applyZoom();
  this.saveAndApplyZoom();

}


applyZoom() {
  // Adjust the zoom level in your application as needed
  document.body.style.zoom = `${this.zoomLevel * 100}%`;
}
saveAndApplyZoom(): void {
  localStorage.setItem('zoomLevel', this.zoomLevel.toString()); // Save zoom level
  this.applyZoom();
}

// applyZoom() {
//   // Adjust the zoom level in your application as needed
//   document.body.style.zoom = this.zoomLevel;
//     // document.body.style.zoom = event.target.value; // Apply zoom to the body content

// }

}
