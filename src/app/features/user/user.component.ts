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
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Add this import
import { OrderDto, OrderService } from '../home/order.service'; // Import the service
import { CategoryService } from '../home/category.service'; // Import the service
import { StorageService } from '../services/storage.service';
import { ElementRef, HostListener } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { NotificationApiService } from '../services/notification-api.service';
import { environment } from '../../../environments/environment';

interface Category {
  id: number;
  name: string;
}

export interface DisplayItem extends Item {
  imagePath: string;
}
interface Item {
  id: number;
  name: string;
  category: number;
  price: number;
  qty?: number;
  kitchen: boolean;
}

export interface cartItem{
  orderItemId?: number; 
  id: number;
  name: string;
  category: number;
  price: number;
  qty: number;
  kitchen: boolean;
  itemNote: string;
  itemStatus?: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | null;
  statusUpdated?: string; // ISO timestamp string
}

// src/app/models/order-summary.model.ts
export interface OrderSummary {
  orderId: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
}

// interface ItemKitchen {
//   id: number;
//   name: string;
//   category: number;
//   price: number;
//   qty?: number;
//   kitchen: boolean;
// }

interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface Customer {
  customerId: number;
  firstName: string;
  image: string; // Base64 image string
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

export interface Order {
  id: number;
  time: string;
  status: string;
  // items: Item[];
  items:cartItem[];
  total: number;
  paidAmount : number;
  orderNumber: string;      // Order number (e.g., "110220251001")
  sittingArea: string;
}

interface Modifier {
  modifierId: number;
  name: string;
  default: boolean;
  qty: number;
}


export function isCustomerAssignedForOrder(
  order: Order,
  orderSummaries: OrderSummary[]
): boolean {
  const match = orderSummaries.find(
    summary => summary.orderNumber === order.orderNumber
  );
  return !!(match && match.customerId); // returns true if customerId exists
}

export function getMatchingOrderSummary(
  order: Order,
  orderSummaries: OrderSummary[]
): OrderSummary | undefined {
  return orderSummaries.find(
    summary => summary.orderNumber === order.orderNumber
  );
}
type CustomizingItem = cartItem & { modifiers: Modifier[] };


export interface PurchaseItem {
  id: number;
  name: string;
  price: number;
  category: number;
  qty: number;
}

export interface PurchaseRecord {
  id: number;
  time: string;
  status: string;
  items: PurchaseItem[];
  total: number;
  orderNumber: string;
  paidAmount: number;
}

export interface PurchaseHistoryResponse {
  [userId: number]: PurchaseRecord[];
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
  customers: { id: number; name: string; avatar: string }[] = [];
  purchaseHistoryData: { [customerId: number]: PurchaseRecord[] } = {};

  isPopupOpen: boolean = false;
  customerCheckoutPopup: boolean = false;
  paymentOption: 'full' | 'partial' | null = null;
  // selectedOrder: number | null = null;
  customAmount: string = '0';
  isLoading: boolean = false; // This will control the spinner visibility
  selectedSittingArea: string = 'front'; 
  customizeCartItemModal : boolean= false;
  //this to add the custom itemNote
  // selectedItem: cartItem[]=[];
  // selectedItem: cartItem | null = null;  // Single cart item for customization
  // selectedItem: any = null;  // Single cart item for customization
  selectedItem: CustomizingItem | null = null;
  canEdit: boolean = false;

  todayCustomerOrders: OrderSummary[] = [];

  //pending order
  constructor(private router: Router, private orderService: OrderService
    , private storageService: StorageService, private categoryService : CategoryService
    ,private elRef: ElementRef
    ,private wsService: WebSocketService
    ,private cdr: ChangeDetectorRef
    ,private notifcationService : NotificationApiService
  ) {}
  items: DisplayItem[] = [];

  // private sub!: Subscription;
  private notifSub!: Subscription;
  imageBaseUrl = environment.imageBaseUrl;

  ngOnInit() {
    this.isLoading=true;
    this.orderService.checkLogin();
    console.log('Categories:', this.categories);
    console.log('Items:', this.items);
    this.userId = this.storageService.getLocalVariable("userId");
    this.role = this.storageService.getLocalVariable("role");
    if(this.role.toLocaleLowerCase() == "admin" || this.role.toLocaleLowerCase() == "owner" ){
      this.canEdit = true;
    }
    // const userId = this.storageService.getLocalVariable('userId');
    // const username = this.storageService.getLocalVariable('username');

    // if (!(userId && username)) {
    //   // If user data exists, redirect to home
    //   this.router.navigate(['/login']);
    // }
    this.editOrderId=-1;
    this.alreadyPaidAmount = 0;
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
  this.loadCustomers() 
// //below to connect rabbit
  this.wsService.connect(); // ✅ Ensure WebSocket connects on init
  // this.wsService.subscribeToTopic('/topic/notifications').subscribe(msg => {
  //   // this.toastService.show(msg); // or update alert UI
  //   alert("notif--- "+ msg);
  //   console.log("msg"+msg);
    // this.sub = this.wsService.subscribeToTopic('/topic/kitchen').subscribe(...);
    // console.log("subbb"+this.sub);
    // this.notifSub = this.wsService.subscribeToTopic('/topic/notifications').subscribe((msg) => {
    //   console.log('🔔 Notification:', msg);
    //   // alert('notif--- ' + msg);
    // });

    this.notifSub = this.wsService.subscribeToTopic('/topic/orders').subscribe((msg) => {
      console.log('🔔 Notification:', msg);
        if(msg === "🆕 Order Placed ready"){
          console.log("notification received");
          this.isLoading = true;
          this.toggleOrdersModal();
        }else{
          console.log("outside");
          
        }
    });
    
    // this.notifSub = this.wsService.subscribeToTopic('/topic/user').subscribe((msg) => {
    //   console.log('🔔 Notification:', msg);
    //     if(msg === "🆕 Order Placed ready"){
    //       console.log("notification received"+msg);
    //       this.isLoading = true;
    //       // this.getOrders();
    //       this.toggleOrdersModal();
    //     }else{
    //       console.log("outside");
          
    //     }
    // });
    
  // });
  
  // this.sendOrder();
  // console.log("subb ordddd");
 
  // this.wsService.sendAndPublishOrder(JSON.stringify({
  //   orderId: 123,
  //   item: "Coffee",
  //   quantity: 2
  // }));
  // this.wsService.sendAndPublishOrder(JSON.stringify({
  //   orderId: 123,
  //   item: "Coffee",
  //   quantity: 2
  // }));

  // this.wsService.subscribeToOrders();

// Call this function to test the printer
// this.testPrint();
    this.isLoading=false;
  }
 
  // order: string = "Order#123"; // Example order

  // sendOrder() {
  //   console.log("🔍 Sending Order:", this.order);
  //   this.wsService.sendMessage(JSON.stringify({ orderId: 101, item: "Teaaa", quantity: 10 }));

  //   this.wsService.sendMessage(this.order);
  // }

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
 // Default to 'front'
  
// Method to select sitting area
toggleSittingArea(sittingArea: string) {
  this.selectedSittingArea = sittingArea;
 
}
//  // Function to toggle sitting area between 'front' and 'back'
//  toggleSittingArea(sittingArea: string) {
//   this.selectedSittingArea = sittingArea;
// }



  ngOnDestroy() {
    // this.wsService.disconnect(); // ✅ Disconnect WebSocket when leaving
    // this.loadPurchaseHistory();
    
      // this.kitchenSub?.unsubscribe();
      this.notifSub?.unsubscribe();

  }
  loadCat() {
    this.categoryService.loadCategories().subscribe(
      (data: ApiCategory[]) => {
        this.categories = data.map(cat => ({
          id: cat.categoryId, // ✅ Map API field to `id`
          name: cat.name
        }));

        console.log('Categories loaded:', this.categories);


        // // ✅ Step 2: Extract and Store Items from API
        // this.items = data.flatMap(cat =>
        //   cat.menuItems.map(item => ({
        //     id: item.menuItemId,
        //     name: item.name,
        //     category: cat.categoryId, // Assign the correct category
        //     price: item.price,
        //     kitchen: item.kitchenItem
        //   }))
        // );

        this.items = data.flatMap(cat =>
          cat.menuItems.map(item => ({
            id: item.menuItemId,
            name: item.name,
            category: cat.categoryId,
            price: item.price,
            kitchen: item.kitchenItem,
            imagePath: item.imagePath  // only in DisplayItem
          }))
        );
        
        console.log('Items loaded:', this.items);

        
        // // ✅ Step 2: Extract and Store Items from API
        // this.itemsKitchen = data.flatMap(cat =>
        //   cat.menuItems.map(itemsKitchen => ({
        //     id: itemsKitchen.menuItemId,
        //     name: itemsKitchen.name,
        //     category: cat.categoryId, // Assign the correct category
        //     price: itemsKitchen.price,
        //     kitchen: itemsKitchen.kitchenItem
        //   }))
        // );
        // console.log('Items loaded: kitchenn', this.itemsKitchen);

       

        
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

  loadPurchaseHistory() {
    this.orderService.fetchPurchaseHistory().subscribe((data) => {
      this.purchaseHistoryData = data;
      console.log('Updated Purchase History:', this.purchaseHistoryData);
    });
  }

  loadPurchaseHistorynew(userId: number) {
    this.previousCart = this.purchaseHistoryData[userId] 
        ? this.purchaseHistoryData[userId].flatMap(order => order.items) 
        : [];
      // this.purchaseCart = this.purchaseHistoryData[userId] 
      //   ? this.purchaseHistoryData[userId].flatMap(order => order.items) 
      //   : [];
      this.purchaseHistory = this.purchaseHistoryData[userId] || [];

    // this.orderService.fetchPurchaseHistory().subscribe((data) => {
    //   this.purchaseHistoryData = data;
  
    //   // Fetch the selected user's purchase history
    //   this.previousCart = this.purchaseHistoryData[userId] 
    //     ? this.purchaseHistoryData[userId].flatMap(order => order.items) 
    //     : [];
  
    //   console.log(`Updated Purchase History for User ${userId}:`, this.previousCart);
    // });
  }

  getTotalPendingAmount(): number {
    if (!this.purchaseHistory || this.purchaseHistory.length === 0) {
      return 0;
    }
  
    return this.purchaseHistory
      .map(order => order.total - order.paidAmount) // Calculate pending for each order
      .reduce((acc, pending) => acc + pending, 0); // Sum up all pending amounts
  }
  
  
  loadCustomers() {
    this.orderService.getCustomers().subscribe(
      (data) => {
        this.customers = data;
        this.loadPurchaseHistory()
      },
      (error) => {
        console.error('Error fetching customers', error);
      }
    );
  }

  reprintOrder(order: any): void {
    console.log("Reprinting order with ID:", order.id);
  this.isLoading = true;
    this.orderService.reprintOrder(order.id).subscribe(
      (response) => {
        console.log("Reprint successful", response);
        this.isLoading = false;
        // Handle success (e.g., show a success message, update the UI, etc.)
      },
      (error) => {
        console.error('Error reprinting order', error);
        this.isLoading = false;
        // Handle error (e.g., show an error message to the user)
      }
    );
  }
  
  // loadCustomersold() {
  //   this.orderService.getCustomers().subscribe(
  //     (data) => {
  //       // Map over the data to add a fullName field
  //       this.customers = data.map(customer => ({
  //         ...customer,
  //         fullName: `${customer.firstName} ${customer.lastName}`  // Combine firstName and lastName
  //       }));
  //     },
  //     (error) => {
  //       console.error('Error fetching customers', error);
  //     }
  //   );
  // }
  // loadCustomers() {
  //   this.orderService.getCustomers().subscribe(
  //     (data) => {
  //       this.customers = data.map(customer => {
  //         const [firstName, ...lastNameParts] = customer.name.split(' ');
  //         const lastName = lastNameParts.join(' ');
          
  //         return {
  //           ...customer,
  //           fullName: customer.name,
  //           firstName,
  //           lastName
  //         };
  //       });
  //     },
  //     (error) => {
  //       console.error('Error fetching customers', error);
  //     }
  //   );
  // }
  
  
  
  // Example method to handle category selection
  selectCategory(category: Category) {
    this.selectedCategory = category;

    console.log('Selected category:', this.selectedCategory);
  }
  
  // items: Item[] = [];
  // itemsKitchen: ItemKitchen[] = [];

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
  //  users: User[] = [
  //   { id: 1, name: 'John Doe', avatar: 'https://github.com/nutlope.png' },
  //   { id: 2, name: 'Jane Doe', avatar: 'https://github.com/nutlope.png' },
  //   { id: 3, name: 'Bob Smith', avatar: 'https://github.com/nutlope.png' },
  //   { id: 4, name: 'Alice Johnson', avatar: 'https://github.com/nutlope.png' },
  //   { id: 5, name: 'Mike Brown', avatar: 'https://github.com/nutlope.png' },
  //   { id: 6, name: 'Emily Davis', avatar: 'https://github.com/nutlope.png' },
  //   { id: 7, name: 'David Lee', avatar: 'https://github.com/nutlope.png' },
  // ];
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
  role: string = ""; // example user id
  
  // Call this method when you want to open the modal
  // cmmnted this methos for the =============== no longer required
  // openModal(): void {
  //   this.showOrders = true;
  //   // Load orders only if they haven't been loaded before
  //   // if (this.allOrders.length === 0) {
  //     this.orderService.getOrdersForUserTodayAll(this.userId).subscribe((orders: OrderDto[]) => {
  //       this.allOrders = orders;
  //       // Apply default filter (for example, "Pending")
  //       this.filterOrders(this.selectedStatus);
  //     });
  //   // }
  // }


  // Call this method when you want to open the modal
  toggleOrdersModal(): void {
    // this.showOrdersIcon = !this.showOrdersIcon;
    // Load orders only if they haven't been loaded before
    // if (this.allOrders.length === 0) {
      // this.selectedStatus= "Pending";
      this.orderService.getOrdersForUserTodayAll(this.userId).subscribe((orders: OrderDto[]) => {
        this.allOrders = orders;
        // Apply default filter (for example, "Pending")
        // this.filterOrders(this.selectedStatus);
        this.handleFilterChange(this.selectedStatus);
        this.isLoading=false;
      });
      console.log("all orders - test");
      console.log(this.allOrders);
    // }
  }
  toggleOrdersModalClose(){
    this.showOrdersIcon = false;
    this.isFinishFlow = false;
  }
  handleFilterChange(status: string): void {
    this.selectedStatus = status;
    this.selectedOrder = null;
    if (status === 'All') {
      this.filteredOrders = this.allOrders;
    }
    else if(status === 'unpaid'){
      this.filteredOrders = this.allOrders.filter(order => (order.total - order.paidAmount) !== 0);
    }else if (status === 'CustomerOrders') {
      this.filteredOrders = this.allOrders.filter(order =>
        isCustomerAssignedForOrder(order, this.todayCustomerOrders)
      );
    }
        else {
      this.filteredOrders = this.allOrders.filter(order => order.status === status);
    }
      // Set selectedOrder to the first item of filteredOrders if it exists
    if (this.filteredOrders.length > 0) {
      this.selectedOrder = this.filteredOrders[0];
    }
  }


  isPaymentPopupOpen: boolean = true;
  selectedPaymentOrder: Order | null = null;
  openPaymentMethodPop(order: Order): void {
    console.log('Finish & Pay clicked for order:', order.orderNumber); // ✅ check console
    this.selectedPaymentOrder = order;
    this.isPaymentPopupOpen = true;
    this.selectedPaymentMethodId = 1;
  }
  isFinishFlow: boolean = false;

  openPaymentPopupForFinish(order: Order): void {
    const pendingAmount = order.total - order.paidAmount;
  
    if (pendingAmount > 0) {
      this.selectedPaymentOrder = order;
      this.isPaymentPopupOpen = true;
      this.selectedPaymentMethodId = 1; // default to Cash
      this.isFinishFlow = true;
    } else {
      // If nothing is pending, just finish the order directly
      this.finishOrder(order);
    }
  }
  handlePaymentConfirmation(): void {
    if (this.selectedPaymentOrder) {
      this.updatePendingPayment(this.selectedPaymentOrder); // 💰 pay first
  
      if (this.isFinishFlow) {
        this.finishOrder(this.selectedPaymentOrder); // ✅ then finish if needed
        this.isFinishFlow = false; // reset the flow
      }
  
      this.isPaymentPopupOpen = false;
      this.selectedPaymentOrder = null;
    }
  }
  
  
  updatePendingPayment(order: Order): void {
    // this.showOrdersIcon= false;
// this.isPopupOpen = true;
    this.isLoading = true;
    const paymentData = {
      orderId: order?.id,
      amount: (order?.total ?? 0) - (order?.paidAmount ?? 0),
      paymentMethodId: this.selectedPaymentMethodId
    };
  
    this.orderService.updateOrderPayment(paymentData).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.isPaymentPopupOpen = false;
        console.log('Order payment updated successfully:', response);
      },
      error => {
        this.isLoading = true;
        this.isPaymentPopupOpen = false;
        console.error('Error updating payment:', error);
      }
    );
  }
  
  get selectedOrderCustomerName(): string | null {
    const matched = getMatchingOrderSummary(this.selectedOrder, this.todayCustomerOrders);
    return matched?.customerName ?? null;
  }
  
  //move order to the finished state
  finishOrder(selectedOrder: Order){
    // alert("se"+selectedOrder);
    // console.log("seee--",selectedOrder);
      // Assuming selectedOrder is the ID of the order to complete
      this.isLoading = true; 
      if(selectedOrder.status == 'Completed'){
        // alert("already completed..!!")
        this.isLoading = false; 
        return;
      }
      // if(true){
      //   console.log("stopppp");
      //   console.log(selectedOrder);
        
      //   //return;
      // }

      // if(!this.selectedUser){
            // Check if the order has a pending balance
            console.log("printing matching");
            //  console.log(getMatchingOrderSummary(selectedOrder,this.todayCustomerOrders)?.customerName.toString());
            
const matchedSummary = getMatchingOrderSummary(selectedOrder, this.todayCustomerOrders);

console.log(matchedSummary?.customerName?.toString() ?? 'No customer found');

             console.log("printing matching---"+(!isCustomerAssignedForOrder(selectedOrder, this.todayCustomerOrders)));
        if ((selectedOrder.total - selectedOrder.paidAmount !== 0 )&& (!isCustomerAssignedForOrder(selectedOrder, this.todayCustomerOrders) )) {
          const confirmation = window.confirm("The full amount has not been paid. Are you sure you want to finish the order?");
          if (!confirmation) {
            // User clicked "No", return to avoid further actions
            //working on select of cancel \
            // CANCEL
            // alert("if block");
            this.isLoading = false;
            return;
          }
          else{
            //this is working on select of ok
            //OK button
           
            // return;
          }
        }
        
        // if(true){
        //   console.log("stopppp-- found customer");
        //   console.log(selectedOrder);
        //   this.isLoading = false;
        //   return;
        // }

        // remove amount settlement
  // const paymentData = {
  //   orderId: this.selectedOrder?.id,
  //   amount: (this.selectedOrder?.total ?? 0) -( this.selectedOrder?.paidAmount ?? 0),
  //   paymentMethodId:1
  // }

  // this.orderService.updateOrderPayment(paymentData).subscribe(
  //   (response: any) => {
  //     console.log('Order payment updated successfully:', response);
  //   },
  //   error => {
  //     console.error('Error updating payment:', error);
  //   }
  // );

  // above block for the adding the pending amount
      // }
  if(selectedOrder.status === 'Pending'){
    this.orderService.completeOrder(selectedOrder.id).subscribe(
      response => {
        console.log('Order completed successfully', response);
        // Optionally, you can update the orders or handle UI changes here
        this.toggleOrdersModal();
        this.filterOrders(this.selectedStatus); // To reapply any filters you have
        // this.toggleOrdersModal();
        this.isLoading = false;
        this.selectedOrder = null;
        this.NotifyKitchen();
      },
      error => {
        console.error('Error completing the order', error);
        this.isLoading = false;
        // You can display a message or handle the error accordingly
      }
    );
    }
      else if(selectedOrder.status.toLocaleLowerCase() === 'ready'){
    // this.readyOrder(selectedOrder);
    this.deliverOrder(selectedOrder);
        // this.orderService.updateOrderStatus(selectedOrder.id, 'Ready').subscribe(
        //   response => {
        //     console.log('Order status updated successfully', response);
        //     // Optionally, you can update the orders or handle UI changes here
        //     this.isLoading = false;
        //     this.selectedOrder = null;
        //     // this.NotifyKitchen();
        //     // Notify user here if needed
        //     // this.NotifyUser();
        //   },
        //   error => {
        //     console.error('Error updating the order status', error);
        //     this.isLoading = false;
        //     // You can display a message or handle the error accordingly
        //   }
        // );
    }
  }

  readyOrder(selectedOrder: Order){
    this.isLoading = true;
    this.orderService.updateOrderStatus(selectedOrder.id, 'Ready').subscribe(
      response => {
        console.log('Order status updated successfully', response);
        // Optionally, you can update the orders or handle UI changes here
        this.selectedOrder = null;
        this.NotifyKitchen();
        this.toggleOrdersModal();
        this.filterOrders(this.selectedStatus); // To reapply any filters you have
        this.isLoading = false;
       
        // Notify user here if needed
        // this.NotifyUser();
      },
      error => {
        console.error('Error updating the order status', error);
        this.isLoading = false;
        // You can display a message or handle the error accordingly
      }
    );
  }
  
    // Function to handle the order click and show details
    showOrderDetails(order: any): void {
      if (this.selectedOrder === order && false) {
        this.selectedOrder = null;  // Close the order details if clicked again
      } else {
        this.selectedOrder = order;  // Show the order details
      }
    }

    NotifyKitchen(){
             // Then send notification
      this.notifcationService.sendNotification('🆕 New Order Placed').subscribe(() => {
        console.log('Notification sent');
      });
    }

    emptyCart(){
      this.cart=[];
      this.guestName="";
      this.editOrderId=-1;
      this.alreadyPaidAmount = 0;
      this.partialPayAmount =0;
      this.selectedUser =null;
      this.previousCart =[];
      this.purchaseHistory= [];
      this.customAmount ="0";
    }

    handlePayment(paymentType: string) {
      switch(paymentType) {
        case 'full':
          if(this.editOrderId !== -1){
            // set -1 for the order editing
            this.partialPayAmount = -1;// this value calculated in the confirm full pay
          }else{
            // new order for full payment it whole amount is getting paid
            this.partialPayAmount = this.getTotal();
          }
          console.log("amount paid"+ this.partialPayAmount);
          this.confirmFullPay();
          break;
        // case 'half':
        //   this.processHalfPayment();
        //   break;
        case 'save':
           this.partialPayAmount = 0;
          console.log("amount paid"+ this.partialPayAmount);
          this.confirmFullPay();
          break;
        default:
          console.log('Unknown payment option');
      }
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

  editOrder(order: Order) {
    if(this.selectedUser != null){
      this.emptyCart();
    }
console.log("edit ordderrr--");
console.log(order);


    this.cart = order.items.map(item => ({
      ...item,
      qty: item.qty || 1,      // Set default qty to 1 if not defined
      category: item.category,  // Ensure category is included
      itemNote:item.itemNote,
      orderItemId: item.orderItemId ?? undefined
    }));
    console.log("edit ordderrr-- after cart");
console.log(this.cart);

  this.guestName="edit Order - #"+order.orderNumber.slice(-3);
  this.editOrderId=order.id;
  this.alreadyPaidAmount = order.paidAmount;
  
    // Close the modal after selecting the order
    this.showOrders = false;
  }

  //below is working old method edit order
// Method to populate the cart with the selected order's items
// editOrder(order: Order) {
//   this.cart = order.items.map(item => ({
//     ...item,
//     qty: item.qty || 1,      // Set default qty to 1 if not defined
//     category: item.category,  // Ensure category is included
//   }));
// this.guestName="edit Order - #"+order.orderNumber.slice(-3);
// this.editOrderId=order.id;
// this.alreadyPaidAmount = order.paidAmount;

//   // Close the modal after selecting the order
//   this.showOrders = false;
// }
usersmenu() {
  this.router.navigate(['/user']);
  console.log('Users page...');
}
// Method to toggle user list visibility
toggleUsers() {
  this.searchTerm='';
  this.loadPurchaseHistory();
  this.showUsers = !this.showUsers;
}
// Method to filter users based on search term
// filteredUsers(): User[] {
//   return this.users.filter(user =>
//     user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
//   );
// }

// Method to filter users based on search term
// filteredUsers(): User[] {
//   return this.users.filter(user =>
//     user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
//   );
// }

filteredCustomers(): any[] {
  const term = this.searchTerm.toLowerCase();
  return this.customers.filter(customer => {
    const nameMatches = customer.name?.toLowerCase().includes(term);
    const idMatches = customer.id?.toString().includes(term);
    return nameMatches || idMatches;
  });
}

closeUsersModal(){
  this.showUsers=false;
}

  showDeleteModal = false;
  itemToDeleteIndex: number | null = null;
  showToast = false;

  dropdownVisible = false;
  //below for checkout confirmation
  showCheckoutModal = false;
  partialPayMode = false;
  partialPayAmount: number = 0;
  alreadyPaidAmount: number = 0;
  isPartialAmountValid = false;
  selectedPaymentType: string = 'cash'; // Default payment type
  selectedUser: User | null = null;

  selectedCategory: Category | null = null;
  // cart: Item[] = [];
  cart: cartItem[] = [];
  guestName: string = '';
  // Somewhere near other properties
  // previousCart: Item[] = [];
  previousCart: HistoricalItem[] = [];
  purchaseCart: PurchaseItem[] = [];
  purchaseHistory: PurchaseRecord[] = []; // New variable for storing full orders

  // selectCategory(category: Category) {
  //   this.selectedCategory = category;
  // }

  getItemsByCategory(categoryId: number): DisplayItem[] {
    return this.items.filter(item => item.category === categoryId);
  }

  addToCartOld_working(item: Item) {
    // this.closeDropdown();
    const existingItem = this.cart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      this.cart.push({
        ...item, qty: 1,
        itemNote: ''
      });
    }
    // console.log("items after adding to cart"+this.cart..toString());
    console.log("Items in the cart:", JSON.stringify(this.cart, null, 2));

    
  }

  addToCartss(item: Item) {
    if (this.editOrderId === -1) {
      // Fresh order
      const existing = this.cart.find(i => i.id === item.id && i.itemStatus === 'pending');
      if (existing) {
        existing.qty += 1;
      } else {
        this.cart.push({
          ...item,
          qty: 1,
          itemNote: '',
          itemStatus: 'pending'
        });
      }
    } else {
      // Edit order mode
      const existingPending = this.cart.find(i =>
        i.id === item.id &&
        i.itemStatus === 'pending' &&
        i.orderItemId !== undefined // existing row from backend
      );
  
      if (existingPending) {
        existingPending.qty += 1;
      } else {
        // Add a new pending item (new row to be inserted)
        this.cart.push({
          ...item,
          qty: 1,
          itemNote: '',
          itemStatus: 'pending',
          // no orderItemId because it's new
        });
      }
    }
  
    console.log('Cart:', this.cart);
  }
  addToCart(item: Item) {
    if (this.editOrderId === -1) {
      // 🔰 Fresh order
      const existing = this.cart.find(i => i.id === item.id && i.itemStatus === 'pending');
      if (existing) {
        existing.qty += 1;
      } else {
        this.cart.push({
          ...item,
          qty: 1,
          itemNote: '',
          itemStatus: 'pending'
        });
      }
    } else {
      // ✏️ Edit existing order
  
      // 1. Update existing PENDING item from backend
      const existingPending = this.cart.find(i =>
        i.id === item.id &&
        i.itemStatus === 'pending' &&
        i.orderItemId !== undefined
      );
  
      // 2. Or update new local pending item (added during edit)
      const newPending = this.cart.find(i =>
        i.id === item.id &&
        i.itemStatus === 'pending' &&
        i.orderItemId === undefined
      );
  
      if (existingPending) {
        existingPending.qty += 1;
      } else if (newPending) {
        newPending.qty += 1;
      } else {
        // Add new pending item
        this.cart.push({
          ...item,
          qty: 1,
          itemNote: '',
          itemStatus: 'pending'
          // no orderItemId → backend will treat it as new
        });
      }
    }
  
    console.log('Cart:', this.cart);
  }
  

  cancelCartItemNote(){
    this.customizeCartItemModal = false;
  }
  
  // cusotmizeCartItem(item : cartItem){

  //   this.selectedItem = { ...item };  // Copy the item to avoid modifying the original one directly
  //   this.customizeCartItemModal = true;
  //   // console.log(item.);
  //   // const existingItem = this.cart.find(i => i.id === item.id);
  //   // if (existingItem) {
  //   //   // existingItem.qty = (existingItem.qty || 1) + 1;
  //   //   existingItem.itemNote = "";
  //   // } else {
  //   //   this.cart.push({
  //   //     ...item, qty: 1,
  //   //     itemNote: ''
  //   //   });
  //   // }
  //   // console.log("items after adding to cart"+this.cart..toString());
  //   console.log("Items in the cart:", JSON.stringify(this.cart, null, 2));

  // }
  modifierMap: { [key: number]: { modifierId: number, name: string, default: boolean }[] } = {
    13: [
      { modifierId: 1, name: 'sugar', default: true },
      { modifierId: 2, name: 'no sugar', default: false }
    ],
    9: [
      { modifierId: 3, name: 'extra cheese', default: true },
      { modifierId: 4, name: 'no cheese', default: false }
    ]
    // Add more item IDs and their modifiers here
  };
  
  
  cusotmizeCartItem(item: cartItem) {
    const rawModifiers = this.modifierMap[item.id] || [];
    const itemQty = item.qty ?? 1; // fallback if qty is undefined

    const modifiers = rawModifiers.map(mod => ({
      ...mod,
      qty: mod.default ? itemQty : 0
      // qty: 0
    }));
  
    this.selectedItem = {
      ...item,
      modifiers
      // : rawModifiers.map(mod => ({
      //   ...mod,
      //   qty: mod.default ? this.selectedItem : 0
      // }))
    } as cartItem & { modifiers: { modifierId: number, name: string, default: boolean, qty: number }[] };
    
    // this.selectedItem = {
    //   ...item,
      // itemNote:JSON.stringify(modifiersorderData, null, 2) // only used during customization, not saved to cart
      console.log("item note"+JSON.stringify(this.selectedItem, null, 2));
      if(this.selectedItem.modifiers.length>0){
        this.customizeCartItemModal = true;
      }else{
        // alert("NO MODIFIERS..!!")
    // };
  //set a popup msg like no options to customize
    this.customizeCartItemModal = false;}
  }
  getModifierTotalQty(): number {
    return this.selectedItem?.modifiers?.reduce((sum, mod) => sum + (mod.qty || 0), 0) || 0;
  }
  saveCustomization() {
    const totalModifierQty = this.getModifierTotalQty();
    if (totalModifierQty !== this.selectedItem?.qty) {
      alert(`Please make sure modifier quantities add up to ${this.selectedItem?.qty}`);
      return;
    }
  
    // Build string like "3x sugar, 4x no sugar"
    const noteParts = this.selectedItem.modifiers
      .filter(mod => mod.qty > 0)
      .map(mod => `${mod.qty}x ${mod.name}`);
  
    this.selectedItem.itemNote = noteParts.join(', ');
  
    // Save updated item back to cart
    const index = this.cart.findIndex(i => i.id === this.selectedItem?.id);
    if (index !== -1) {
      this.cart[index] = { ...this.selectedItem };
      console.log("print the cart whole"+JSON.stringify(this.cart, null, 2));
      
    }

    console.log("reprint itemss"+JSON.stringify(this.selectedItem, null, 2));
    console.log("reprint itemss"+JSON.stringify(this.selectedItem, null, 2));
    console.log("end");
    
  
    this.closeCustomizeModal();
  }
  
  
  // Method to save the customization
  saveCustomizationOld() {
    // // Find the item in the cart and update it with the new values from the modal
    // const index = this.cart.findIndex(item => item.id === this.selectedItem.id);
    // if (index !== -1) {
    //   this.cart[index] = { ...this.selectedItem };
    // }
    const existingItem = this.cart.find(//this.selectedItem?.id);
      i => i.id === this.selectedItem?.id);
    if (existingItem) {
      // existingItem.qty = (existingItem.qty || 1) + 1;
      existingItem.itemNote = "added note";
    } 
    else {
      // this.cart.push({
      //   ...item, 
      //   itemNote: ''
      // });
    }
    this.closeCustomizeModal();  // Close the modal after saving
  }

  // Method to close the customization modal
  closeCustomizeModal() {
    // this.showCustomizeModal = false;
    this.customizeCartItemModal = false;
    this.selectedItem = null;
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
     //on click of esc close the order checkout popup
     if (event.key === 'Escape' && (this.isPopupOpen || this.customerCheckoutPopup)) {
      this.handleCloseOrderPopup(); 
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

  removeOld(item: Item) {
    
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

  remove(item: Item) {
    this.closeDropdown();
  
    if (this.editOrderId === -1) {
      // 🔰 Fresh order logic
      const existing = this.cart.find(i => i.id === item.id && i.itemStatus === 'pending');
      if (existing) {
        if (existing.qty > 1) {
          existing.qty -= 1;
        } else {
          this.cart = this.cart.filter(i => !(i.id === item.id && i.itemStatus === 'pending'));
        }
      }
    } else {
      // ✏️ Edit existing order logic
  
      // 1. Check for existing pending item from backend
      const existingPending = this.cart.find(i =>
        i.id === item.id &&
        i.itemStatus === 'pending' &&
        i.orderItemId !== undefined
      );
  
      // 2. Check for new local pending item
      const newPending = this.cart.find(i =>
        i.id === item.id &&
        i.itemStatus === 'pending' &&
        i.orderItemId === undefined
      );
  
      const target = existingPending || newPending;
  
      if (target) {
        if (target.qty > 1) {
          target.qty -= 1;
        } else {
          this.cart = this.cart.filter(i => i !== target);
        }
      }
    }
  
    console.log('Cart after removal:', this.cart);
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
    if(this.selectedUser != null){
      this.customerCheckoutPopup = true;
    }else{
    this.showCheckoutModal = true;
    }
    this.closeDropdown();
  }

  // Close Checkout Modal
  closeCheckoutModal() {
    this.dropdownVisible = false;
    this.showCheckoutModal = false;
    this.partialPayMode = false;
    this.partialPayAmount = 0;
    this.isPartialAmountValid = false;
    this.customerCheckoutPopup = false;
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
    this.isLoading = true;
    const totalAmount = this.getTotal();
    console.log(`Payment Confirmed: ${totalAmount}, Type: ${this.selectedPaymentType}`);
    
   //updating existing 
    if(this.editOrderId != -1){
      const remainingAmount = totalAmount - this.alreadyPaidAmount;

      if((totalAmount - this.alreadyPaidAmount)<0){
        alert("Paid extra amount. refund amount is RS:"+(totalAmount - this.alreadyPaidAmount)+"/-");
        // return;
      }
      if(this.partialPayAmount == -1){
        this.partialPayAmount = totalAmount - this.alreadyPaidAmount;
        console.log("partial amount is:"+this.partialPayAmount);
      }
      else if(this.partialPayAmount>0){
        const remainingAmount = totalAmount - this.alreadyPaidAmount;
  
        if (this.partialPayAmount > remainingAmount) {
          console.error("Error: Partial payment exceeds the remaining amount.");
          alert("Partial payment exceeds the remaining amount. \n remaining amount is :"+remainingAmount);
          // You can also trigger a form error or show a toast here
          this.isLoading = false;
          return;
        }
      }
        // Create the order object with the required format
      const editOrderData = {
        orderId:this.editOrderId,
        userId: this.storageService.getLocalVariable('userId'),//this.selectedUser?.id, // You'll need to replace this with the logged-in user's ID if applicable
        status: 'Pending', // Status can be adjusted based on your system's logic
        total:  totalAmount,
        // amountPaid:((totalAmount) - (this.alreadyPaidAmount) -( this.partialPayAmount)),
        amountPaid:( ( this.partialPayAmount)),
        paymentMethodId:this.selectedPaymentMethodId,
        customAmount :this.customAmount,
        sittingArea: this.selectedSittingArea,
        // customerId: this.selectedUser?.id, // Replace with customer ID, if applicable
        customerId: this.selectedUser ? this.selectedUser.id : undefined,
        orderItems: this.cart.map(item => ({
          // orderId: this.editOrderId, // Set to the appropriate order ID if needed
          orderItemId: item.orderItemId ?? undefined,
          menuItemId: item.id,
          quantity: item.qty || 1,
          price: item.price,
          itemNote:item.itemNote,
          itemStatus: item.itemStatus
        }))
      };

      console.log("Sending edit order data:", JSON.stringify(editOrderData, null, 2));


      // Call the service to create the order
      this.orderService.editOrder(editOrderData).subscribe(
        response => {
          console.log('Order created successfully:', response);
          this.closeCheckoutModal();
          this.cart = []; // Clear the cart after order creation
          this.previousCart = [];
          this.guestName = "";
          this.emptyCart();
          this.NotifyKitchen();
        },
        error => {
          console.error('Error creating order:', error);
        }
      );
      this.cart = []; // Clear the cart after order creation
          this.previousCart = [];
          this.guestName='';
          this.alreadyPaidAmount = 0;
    }else{
    // Create the order object with the required format
    const orderData = {
      userId: this.storageService.getLocalVariable('userId'),//this.selectedUser?.id, // You'll need to replace this with the logged-in user's ID if applicable
      status: 'Pending', // Status can be adjusted based on your system's logic
      total: totalAmount,
      amountPaid:this.partialPayAmount,
      customAmount: this.customAmount,
      sittingArea:  this.selectedSittingArea,
      // amountPaid : this.partialPayAmount > 0 ? this.partialPayAmount : totalAmount,
      paymentMethodId: this.selectedPaymentMethodId,
      // customerId: this.selectedUser?.id, // Replace with customer ID, if applicable
      customerId: this.selectedUser ? this.selectedUser.id : undefined,
      orderItems: this.cart.map(item => ({
        orderId: 0, // Set to the appropriate order ID if needed
        menuItemId: item.id,
        quantity: item.qty || 1,
        price: item.price,
        kitchen:item.kitchen,
        name:item.name,
        itemNote:item.itemNote,
        itemStatus: item.kitchen ? 'pending' : 'delivered'
      }))
    };

    console.log(JSON.stringify(orderData, null, 2));
    console.log("tess"+orderData.amountPaid);
    console.log("tess"+orderData.toString);
    this.closeCheckoutModal();
    this.orderService.createOrderPayment(orderData).subscribe(
      (response: any) => {
        console.log('Order created successfully:', response);
        // Fire and forget the print request
        // Fire and forget the print order request
        // this.orderService.printOrder(response.orderId).subscribe();
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

        // Check if the response contains an orderId
    // if (response && response.orderId) {
    //   // Update orderData with the received orderId
    //   orderData.orderItems = orderData.orderItems.map(item => ({
    //     ...item,
    //     orderId: response.orderId  // Assigning the received orderId
    //   }));
    // }


    // below is actually good till 710 line -- this is RabittMQ sending msgs
    // if (response && response.orderId) {
    //   // Create a new variable for orderId
    //   const newOrderId = response.orderNumber.slice(-3);
    
    //   // Use 'let' to allow modification of orderData
    //   let updatedOrderData = { 
    //     ...orderData, 
    //     orderId: newOrderId // Assign orderId at the top level
    //   };
    
    //   // // Assign orderId inside each order item
    //   // updatedOrderData.orderItems = updatedOrderData.orderItems.map(item => ({
    //   //   ...item,
    //   //   orderId: newOrderId // Assigning the same orderId to all items
        
    //   // }));

    //   // updatedOrderData.orderItems = updatedOrderData.orderItems.map(item => ({
    //   //   ...item,
    //   //   orderId: newOrderId,  // Assign the same orderId to all items
    //   //   name: item.name       // Keep the name from the original cart item
    //   // }));

      
      
    
    //   // Send the updated orderData via WebSocket
    //   this.wsService.sendAndPublishOrder(JSON.stringify(updatedOrderData));
    //   console.log('Sent Order Data via WebSocket:', updatedOrderData);
    // }
    
    
    
    // Send the updated orderData via WebSocket
    // this.wsService.sendAndPublishOrder(JSON.stringify(orderData));
    // console.log('Sent Order Data via WebSocket:', orderData);
    

    

  // Send the whole updated orderData via WebSocket
  // this.wsService.sendAndPublishOrder(JSON.stringify(orderData));
  // console.log('Sent Order Data via WebSocket:', orderData);



        // console.log("abcc");
        // console.log(createdOrder);
        // this.printReceiptOld();
        // this.printReceipt(response);
        this.closeCheckoutModal();
        this.cart = []; // Clear the cart after order creation
        this.previousCart = [];
        this.selectedUser =null;
        this.emptyCart();
        this.NotifyKitchen();
      },
      error => {
        // this.orderService.printOrder(66).subscribe();
     
        console.error('Error creating order:', error);
      }
    );
  }
    // Call the service to create the order
  //   this.orderService.createOrder(orderData).subscribe(
  //     (response: any) => {
  //       console.log('Order created successfully:', response);
  //       // Fire and forget the print request
  //       // Fire and forget the print order request
  //       // this.orderService.printOrder(response.orderId).subscribe();
  //       // console.log('Order created successfully:-- id', response.id);
  //       // const createdOrder = {
  //       //   orderId: response.orderId,
  //       //   orderNumber: response.orderNumber,
  //       //   total: response.total,
  //       //   orderItems: response.orderItems.map((item: any) => ({
  //       //     name: item.menuItem.name, // Extract item name
  //       //     quantity: item.quantity,
  //       //     price: item.price
  //       //   }))
  //       // };

  //       // Check if the response contains an orderId
  //   // if (response && response.orderId) {
  //   //   // Update orderData with the received orderId
  //   //   orderData.orderItems = orderData.orderItems.map(item => ({
  //   //     ...item,
  //   //     orderId: response.orderId  // Assigning the received orderId
  //   //   }));
  //   // }


  //   // below is actually good till 710 line -- this is RabittMQ sending msgs
  //   // if (response && response.orderId) {
  //   //   // Create a new variable for orderId
  //   //   const newOrderId = response.orderNumber.slice(-3);
    
  //   //   // Use 'let' to allow modification of orderData
  //   //   let updatedOrderData = { 
  //   //     ...orderData, 
  //   //     orderId: newOrderId // Assign orderId at the top level
  //   //   };
    
  //   //   // // Assign orderId inside each order item
  //   //   // updatedOrderData.orderItems = updatedOrderData.orderItems.map(item => ({
  //   //   //   ...item,
  //   //   //   orderId: newOrderId // Assigning the same orderId to all items
        
  //   //   // }));

  //   //   // updatedOrderData.orderItems = updatedOrderData.orderItems.map(item => ({
  //   //   //   ...item,
  //   //   //   orderId: newOrderId,  // Assign the same orderId to all items
  //   //   //   name: item.name       // Keep the name from the original cart item
  //   //   // }));

      
      
    
  //   //   // Send the updated orderData via WebSocket
  //   //   this.wsService.sendAndPublishOrder(JSON.stringify(updatedOrderData));
  //   //   console.log('Sent Order Data via WebSocket:', updatedOrderData);
  //   // }
    
    
    
  //   // Send the updated orderData via WebSocket
  //   // this.wsService.sendAndPublishOrder(JSON.stringify(orderData));
  //   // console.log('Sent Order Data via WebSocket:', orderData);
    

    

  // // Send the whole updated orderData via WebSocket
  // // this.wsService.sendAndPublishOrder(JSON.stringify(orderData));
  // // console.log('Sent Order Data via WebSocket:', orderData);



  //       // console.log("abcc");
  //       // console.log(createdOrder);
  //       // this.printReceiptOld();
  //       // this.printReceipt(response);
  //       this.closeCheckoutModal();
  //       this.cart = []; // Clear the cart after order creation
  //       this.previousCart = [];
  //       this.selectedUser =null;
  //     },
  //     error => {
  //       // this.orderService.printOrder(66).subscribe();
     
  //       console.error('Error creating order:', error);
  //     }
  //   );
  // }
  this.isLoading = false;
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
    this.partialPayAmount =0;
    this.partialPayMode = !this.partialPayMode; 
    this.isPartialAmountValid = true;   
  }

  // Validate Partial Payment Amount
  validatePartialPayAmount() {
    const totalAmount = this.getTotal();
    this.isPartialAmountValid = this.partialPayAmount >= 0 && this.partialPayAmount <= totalAmount;
  }

  // Submit Partial Pay
  submitPartialPay() {
    console.log(`Partial Payment Confirmed: ${this.partialPayAmount}, Type: ${this.selectedPaymentType}`);
    this.confirmFullPay();
  }

  // Example Function to Calculate Total
  getTotal() {
    return this.cart.reduce((acc, item) => acc + (item.price * (item.qty ?? 1)), 0)+parseFloat(this.customAmount) || 0;;
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

  viewReports() {
    this.router.navigate(['/report']);
    this.closeDropdown();
  }

  registerUser(){
    this.router.navigate(['/register']);
    this.closeDropdown();
  }
  
  addCustomer() {

    // console.log('Going to Drafts...');
    this.router.navigate(['/add-customer']);
    this.closeDropdown();
  }
 
  pendingOrders(){
    this.closeDropdown();
    this.router.navigate(['/pending-orders']);
  }

  editItems(){
    this.closeDropdown();
    this.router.navigate(['/edit-menu']);
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
  // this.previousCart = this.userCartHistoryMap[user.id] || [];

  // Load purchase history before setting the cart
  this.loadPurchaseHistorynew(user.id);
  
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
// private userCartHistoryMap: { [userId: number]: HistoricalItem[] } = {
//   1: [
//     { id: 100, name: 'Latte (history)', price: 3.0, category: 1, qty: 2, status: 'Pending' },
//     { id: 101, name: 'Croissant (history)', price: 2.0, category: 2, qty: 1, status: 'Paid' },
//   ],
//   2: [
//     { id: 102, name: 'Cookies (history)', price: 1.0, category: 2, qty: 5, status: 'Pending' }
//   ],
  
// };


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

// cartItems = [
//   { id: 1, name: 'Item 1', price: 25.00 },
//   { id: 2, name: 'Item 2', price: 35.00 },
//   { id: 3, name: 'Item 3', price: 40.00 }
// ];

unpaidOrders = this.purchaseHistoryData;
// [
//   { id: 1, orderId: 'ORD123456', date: '2023-10-01', time: '10:30 AM', pendingAmount: 60.00 },
//   { id: 2, orderId: 'ORD123457', date: '2023-10-02', time: '11:45 AM', pendingAmount: 85.00 }
// ];

get cartAmount(): string {
  // return
  //  this.cart.reduce((acc, item) => acc + (item.price * (item.qty ?? 1)), 0);
  const baseCartAmount = this.cart.reduce((acc, item) => acc + (item.price * (item.qty ?? 1)), 0);
  // this.cartItems.reduce((total, item) => total + item.price, 0);
  const totalCustomAmount = parseFloat(this.customAmount) || 0;
  return (baseCartAmount + totalCustomAmount).toFixed(2);
}

get totalUnpaidOrders(): string {
  // return "null"; 
  return this.purchaseHistory
      .map(order => order.total - order.paidAmount) // Calculate pending for each order
      .reduce((acc, pending) => acc + pending, 0).toString(); // Sum up all pending amounts
  // this.unpaidOrders.reduce((total, order) => total + order.pendingAmount, 0).toFixed(2);
}

handleOpenPopup(orderId: number): void {
  // alert("order id -"+orderId);
  this.isPopupOpen = true;
  this.selectedOrder = orderId;
}

handleClosePopup(): void {
  this.isPopupOpen = false;
  this.paymentOption = null;
  this.selectedOrder = null;
}

handlePaymentOption(option: 'full' | 'partial'): void {
  this.isLoading = true;  // Show the spinner when the request starts
  this.paymentOption = option;
  console.log("Selected Order Details:", this.selectedOrderDetails);
  if (!this.selectedOrderDetails || !this.selectedPaymentMethodId) {
    console.warn('Missing order details or payment method.');

    return;
  }
  const paymentData = {
    orderId: this.selectedOrderDetails?.id,
    amount: (this.selectedOrderDetails?.total ?? 0) -( this.selectedOrderDetails?.paidAmount ?? 0),
    paymentMethodId:this.selectedPaymentMethodId
  }

  // console.log(JSON.stringify(orderData, null, 2));
  // console.log("tess"+orderData.amountPaid);
  // console.log("tess"+orderData.toString);
  this.orderService.updateOrderPayment(paymentData).subscribe(
    (response: any) => {
      console.log('Order payment updated successfully:', response);
      // Fire and forget the print request
       // Remove the paid order from the user's unpaid orders list
       if (this.selectedUser && this.selectedOrderDetails) {
        this.removePaidOrder(this.selectedUser.id, this.selectedOrderDetails.id);
      }
      // this.getTotalPendingAmount();
      // this.totalUnpaidOrders;
      // Update the total unpaid orders after removal
      // this.getTotalPendingAmount();
      console.log('Updated Pending Amount:', this.getTotalPendingAmount());

      // this.cdr.detectChanges(); // Manually trigger change detection

      this.isPopupOpen = false;
      this.isLoading = false;
      this.selectedPaymentMethodId = 1;
    },
    error => {
      // this.orderService.printOrder(66).subscribe();
      this.isLoading = false;
      console.error('Error updating payment:', error);
    }
  );


}

handlePay(): void {
  if (this.paymentOption && this.selectedOrder) {
    alert(`Payment processed for Order ID ${this.selectedOrder} with ${this.paymentOption === 'full' ? 'Full Pay' : 'Partial Pay'}`);
    this.handleClosePopup();
  } else if (parseFloat(this.customAmount) > 0) {
    alert(`Custom payment of $${parseFloat(this.customAmount).toFixed(2)} processed`);
    this.customAmount = '0';
  }
}

// get selectedOrderDetails() {
//   return null;
//   // return this.unpaidOrders.find(order => order.id === this.selectedOrder) || null;
// }

// Method to get orders for the selected user
getUserOrders(userId: number): PurchaseRecord[] {
  return this.purchaseHistoryData[userId] || [];
}


// This will fetch the order details for the selected order
// This will fetch the order details for the selected order
get selectedOrderDetails() {
  // Ensure selectedUser is not null or undefined before accessing its id
  if (this.selectedUser) {
    return this.purchaseHistoryData[this.selectedUser.id]?.find(
      order => order.id === this.selectedOrder
    ) || null;
  }
  return null;  // Return null if selectedUser is not defined
}

selectedOrders: any[] = []; // Array to store selected orders

    // Toggle selection of an order
  toggleOrderSelection(order: any) {
    const index = this.selectedOrders.findIndex(o => o.id === order.id);
    if (index > -1) {
      this.selectedOrders.splice(index, 1); // Remove if already selected
    } else {
      this.selectedOrders.push(order); // Add if not selected
    }
  }

  // Function to handle payment for selected orders
  // unnceccsary. remove later
  handlePaySelectedOrders() {
    if (this.selectedOrders.length === 0) return;
    
    // Here, handle the payment logic (API call, etc.)
    console.log("Processing payment for orders:", this.selectedOrders);
    
    // Clear selected orders after payment
    this.selectedOrders = [];
  }

    // Close modal if the overlay (background) is clicked
    handleOverlayClick(event: MouseEvent) {
      if (event.target === event.currentTarget) {
        this.handleCloseOrderPopup();
      }
    }
  
    // Close modal method
    handleCloseOrderPopup() {
      this.isPopupOpen = false;
      this.customerCheckoutPopup = false;
    }

    // removePaidOrder(userId: number, orderId: number): void {
    //   // Find the user's purchase history and remove the order by ID
    //   const userPurchaseHistory = this.purchaseHistoryData[userId];
    //   // Filter out the paid order
    //   this.purchaseHistoryData[userId] = userPurchaseHistory.filter(order => order.id !== orderId);
    // }

    removePaidOrder(userId: number, orderId: number): void {
      // Find the user's purchase history (if you need to do any other logic with user data)
      const userPurchaseHistory = this.purchaseHistoryData[userId];
      
      // Remove the paid order from the user's purchase history
      this.purchaseHistoryData[userId] = userPurchaseHistory.filter(order => order.id !== orderId);
      
      // Now, filter the paid order from the global purchase history (if required)
      this.purchaseHistory = this.purchaseHistory.filter(order => order.id !== orderId);
    
      // Optionally, you may want to call `getTotalPendingAmount()` to update the pending amount after removing the order.
      this.getTotalPendingAmount();
    }
    

    //remove this method no use
    sendAllPendingOrdersOld(userId: number) {
      const allOrders = this.getUserOrders(userId);
      const pendingOrders = allOrders
        .filter(order => order.total > order.paidAmount)
        .map(order => ({
          orderId: order.id,
          pendingAmount: +(order.total - order.paidAmount).toFixed(2)
        }));
    
      // Do something with pendingOrders
      console.log('Sending pending orders:', pendingOrders);
    
      // Example: call a service method to send this data
      // this.orderService.sendPendingOrders(pendingOrders).subscribe(...);
    }

    isPaymentMethodPopupOpen: boolean = false;
selectedPaymentMethodId: number = 1;

openPaymentMethodPopup() {
  if (!this.canEdit) return;
  this.isPaymentMethodPopupOpen = true;
}

    confirmSettleAll(methodId: number) {
      this.selectedPaymentMethodId = methodId;
      this.isPaymentMethodPopupOpen = false;
      if (this.selectedUser) {
        this.sendAllPendingOrders(this.selectedUser.id, methodId);
      }
          
      // Call the actual method with payment type
      // this.sendAllPendingOrders(this.selectedUser?.id, methodId);
    }
    
    closePaymentMethodPopup() {
      this.isPaymentMethodPopupOpen = false;
    }
    
    finishSettleAll() {
      if (this.selectedUser && this.selectedPaymentMethodId) {
        this.isPaymentMethodPopupOpen = false;
        this.sendAllPendingOrders(this.selectedUser.id, this.selectedPaymentMethodId);
        this.selectedPaymentMethodId = 1;
      }
    }
    // closePaymentMethodPopup() {
    //   this.isPaymentMethodPopupOpen = false;
    //   this.selectedPaymentMethodId = null;
    // }
    // sendAllPendingOrders(userId: number): void {
    sendAllPendingOrders(userId: number, paymentMethodId: number) {
      const allOrders = this.getUserOrders(userId);
      const paymentDataList = allOrders
        .filter(order => order.total > order.paidAmount)
        .map(order => ({
          orderId: order.id,
          paymentMethodId: paymentMethodId, // assuming method is fixed
          amount: +(order.total - order.paidAmount).toFixed(2)
        }));
    
      if (paymentDataList.length === 0) {
        console.log("No pending payments to send.");
        return;
      }
    
      this.isLoading = true;
    
      this.orderService.updateMultipleOrderPayments(paymentDataList).subscribe(
        (response) => {
          console.log('Payments processed:', response);
          // Remove paid orders from UI
          for (const payment of paymentDataList) {
            this.removePaidOrder(userId, payment.orderId);
          }
    
          this.isLoading = false;
          console.log('All selected payments processed successfully');
        },
        (error) => {
          this.isLoading = false;
          console.error('Error processing multiple payments:', error);
        }
      );
    }
    
    getOrderCircleClass(order: Order): string {
      // console.log("++"+order.total+"==="+order.paidAmount);
      const isCompleted = order.status === 'Completed';
      const isReady = order.status === 'Ready';
      const isPaid = order.paidAmount >= order.total;
    // console.log("--"+isCompleted+"==dd=="+isPaid);
      if (isCompleted && !isPaid) {
        // console.log("warinng");
        return 'order-circle warning-payment'; // partial payment
      } else if (isCompleted && isPaid) {
        // console.log("else if -- paid");
        return 'order-circle paid-completed'; // fully paid
      } else if (isReady) {
        return 'order-circle ready'; // ready to collect
      }
      else {
        return 'order-circle'; // default for Pending, Ready, etc.
      }
    }
    
    getCustomerOrdersToday(){
      this.orderService.getTodayOrders().subscribe({
        next: (data) => this.todayCustomerOrders = data,
        error: (err) => console.error('Failed to load orders:', err)
      });
    }
    
        //move order to the finished state
        deliverOrder(selectedOrder: Order){
          // alert("se"+selectedOrder);
          // console.log("seee--",selectedOrder);
            // Assuming selectedOrder is the ID of the order to complete
            this.isLoading = true; 
            if(selectedOrder.status == 'Completed'){
              // alert("already completed..!!")
              this.isLoading = false; 
              return;
            }
      
            // if(!this.selectedUser){
                  // Check if the order has a pending balance
              if (selectedOrder.total - selectedOrder.paidAmount !== 0  ) {
                const confirmation = window.confirm("The full amount has not been paid. Are you sure you want to finish the order?");
                if (!confirmation) {
                  // User clicked "No", return to avoid further actions
                  //working on select of cancel
                  // alert("111");
                  this.isLoading = false;
                  return;
                }
                else{
                  //this is working on select of ok
                  // alert("222");
                  // return;
                }
              }
      
      
       
    
        this.orderService.deliverOrder(selectedOrder.id).subscribe(
          response => {
            console.log('Order status updated successfully', response);
            // Optionally, you can update the orders or handle UI changes here
            this.toggleOrdersModal();
            this.filterOrders(this.selectedStatus); // To reapply any filters you have
        
            this.isLoading = false;
            this.selectedOrder = null;
            this.NotifyKitchen();
            // Notify user here if needed
            // this.NotifyUser();
          },
          error => {
            console.error('Error updating the order status', error);
            this.isLoading = false;
            // You can display a message or handle the error accordingly
          }
        );
      }

}
