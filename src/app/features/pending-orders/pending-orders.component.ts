import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';  // Add this import
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
// import { CustomerService } from './add-customer.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';  // Import the Image Compress Service
import { OrderDto, OrderItemDto , OrderService } from '../home/order.service';
import { cartItem, Order } from '../user/user.component';
import { UserComponent } from '../user/user.component';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { NotificationApiService } from '../services/notification-api.service';
import { HeaderEventsService } from '../services/header-events.service';


export interface ItemReadyResponse {
  orderId: number;
  orderItemId: number;
  itemStatus: string;
  menuItemName: string;
  orderStatus: string;
}

// export interface OrderItem {
//   id: number;
//   name: string;
//   price: number;
//   category: number;
//   qty: number;
// }

// export interface Orders {
//   id: number;
//   time: string;
//   status: string;
//   items: OrderItem[  ];
//   total: number;
//   orderNumber: string;
//   paidAmount: number;
// }


@Component({
  selector: 'app-pending-orders',
  imports: [RouterModule
    , CommonModule
            ,FormsModule // To enable ngModel for form binding
    ,ReactiveFormsModule],
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.scss'
})
export class PendingOrdersComponent {
 dropdownVisible = false;
  showOrdersIcon: boolean = false; 
  
   constructor(private router: Router,
    private fb: FormBuilder, 
    // private adcustomerService: CustomerService,
    //  private orderService: OrderService
       private storageService: StorageService,
       private imageCompress: NgxImageCompressService  // Inject Image Compress Service
       ,private orderService: OrderService
    //  private categoryService : CategoryService
    //   ,private elRef: ElementRef
      ,private wsService: WebSocketService
      ,private notifcationService : NotificationApiService
      ,private headerEventsService: HeaderEventsService
    ) {
    }
      private notifSub!: Subscription;
      isLoading: boolean = false;
    
    ngOnInit() {
      this.isLoading=true;
      this.orderService.checkLogin();
      this.userId = this.storageService.getLocalVariable('userId');
      this.getOrders();
      // this.filterOrdersBySittingArea(this.allOrders);
      this.wsService.connect(); // ✅ Ensure WebSocket connects on init
      this.notifSub = this.wsService.subscribeToTopic('/topic/notifications').subscribe((msg) => {
        console.log('🔔 Notification:', msg);
          if(msg === "🆕 New Order Placed"){
            console.log("notification received");
            this.isLoading = true;
            this.getOrders();
          }else{
            console.log("outside");
            
          }
      });
      // this.isLoading=false;
      this.headerEventsService.topBarHeight$.subscribe(height => {
        this.topBarHeight = height;
        console.log('TopBar height in PendingOrdersComponent:', height);
      });
    }

    allOrders: OrderDto[] =[];
    pendingOrders: OrderDto[] =[];
    orders: OrderDto[] =[];
    // OrderDto[] = [];
    userId = -1;
 

    frontOrders: OrderDto[] = [];
    backOrders: OrderDto[] = [];
    kitchenSummary: { name: string, qty: number }[] = [];


    showTopBar: boolean = true;
    topBarHeight: number = 0;

toggleTopBar() {
  this.showTopBar = !this.showTopBar;
  if(this.showTopBar){
    this.showTopBar1();
  }else{
    this.hideTopBar();
  }
}


hideTopBar() {
  this.headerEventsService.triggerHideTopBar();
}

showTopBar1() {
  this.headerEventsService.triggerShowTopBar();
}

    filterOrdersBySittingArea(allOrders: OrderDto[]): void {
      this.frontOrders = allOrders.filter(order => order.sittingArea === 'front');
      this.backOrders = allOrders.filter(order => order.sittingArea === 'back' );
      this.orders = this.allOrders;//this.allOrders.filter(order => order.status === 'Pending');
    }
    activeFilter: string = 'all';
    noOrdersTimer: any; // Add this at the top of your component

    filterOrders(area: 'all' | 'front' | 'back') {
      this.filterOrdersBySittingArea(this.pendingOrders);
      this.activeFilter = area;
      this.isLoading = true;

      
  // Clear any previous auto-switch timeout
  clearTimeout(this.noOrdersTimer);

      switch (area) {
        case 'front':
          this.orders =this.frontOrders;
          break;
    
        case 'back':
          console.log("entered here")
          this.orders = this.backOrders;
          break;
    
        case 'all':
        default:
          this.orders = this.pendingOrders;
          break;
      }
      this.isLoading = false;
      
  // 🌟 Logic to auto-switch if no orders in current filter but there ARE orders overall
  if (this.orders.length === 0 && this.pendingOrders.length > 0 && area !== 'all') {
    this.noOrdersTimer = setTimeout(() => {
      this.filterOrders('all');
    }, 5000); // 3 seconds delay
  }
    }
    

    showKitchenModal = false;


openKitchenSummary() {
  this.generateKitchenSummary();
  this.showKitchenModal = true;
}

closeKitchenSummary() {
  this.showKitchenModal = false;
}

generateKitchenSummary() {
  this.showKitchenModal=true;
  const summaryMap = new Map<string, number>();
console.log("generating kitchen--kitchen");

  // this.allOrders
  //   .filter(order => order.status === 'Pending')
  //   .forEach(order => {
  //     order.items.forEach(item => {
  //       if (item.kitchen) {
  //         const currentQty = summaryMap.get(item.name) || 0;
  //         summaryMap.set(item.name, currentQty + item.qty);
  //       }
  //     });
  //   });

    
  this.allOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.kitchen && item.itemStatus === 'pending') {
        const currentQty = summaryMap.get(item.name) || 0;
        summaryMap.set(item.name, currentQty + item.qty);
      }
    });
  });
  this.kitchenSummary = Array.from(summaryMap.entries()).map(([name, qty]) => ({ name, qty }));
}


closeKitchenPopup(){
  this.showKitchenModal = false;
}

  getOrders(){
   
    if(this.userId == -1){
      // alert("retuned--");
      this.isLoading = false; // Set here in case of early return
      return;
    }

    
  this.orderService.getOrdersForUserTodayAll(this.userId).subscribe(
    (ordersData: OrderDto[]) => {
      this.allOrders = ordersData;

      // ✅ Filter orders if **any item** has status 'pending'
      this.orders = this.allOrders.filter(order => 
        order.items.some(item => item.itemStatus === 'pending')
      );
      console.log("all order before-- aa =="+this.allOrders);
      console.log(this.allOrders);
console.log("back order before-- =="+this.allOrders);
      this.pendingOrders = this.orders;
this.allOrders=this.pendingOrders;
console.log(this.allOrders);
      // this.filterOrdersBySittingArea(this.orders);
    // 👇 Only now filter by area
    this.filterOrdersBySittingArea(this.pendingOrders);
    this.filterOrders('all');
      this.isLoading = false;
    },
    error => {
      console.error("Error fetching orders", error);
      this.isLoading = false;
    }
  );
  //   this.orderService.getOrdersForUserToday(this.userId).subscribe((ordersData: OrderDto[]) => {
  //     this.allOrders = ordersData;
  //     this.orders = this.allOrders.filter(order => order.status === 'Pending');
  //     this.pendingOrders = this.orders;
  //     this.filterOrdersBySittingArea(this.allOrders);
  //     this.isLoading = false; // Set here in case of early return 
  //   },
  //   error => {
  //     console.error("Error fetching orders", error);
  //     this.isLoading = false; // ✅ Set false on error too
  //   }
  // );   
    
  }
  

    NotifyUser(){
        this.notifcationService.sendOrderEvent('🆕 Order Placed ready').subscribe(() => {
        console.log('Notification sent -- order ready');
        });
    }

    // need to fix this method still pending
    readyItem(item: cartItem, selectedOrder: Order) {
      console.log("Marking item as ready:", item);
      const orderItemId = (item as any).orderItemId;
      if (!orderItemId) {
        console.error("❌ orderItemId missing for item:", orderItemId);
        return;
      }
      // console.log("orderItemId for item:", orderItemId);
        
      // First, update the status of the current item
      // item.itemStatus = 'ready';
      // item.statusUpdated = new Date().toISOString();
    
      // // Now check if all kitchen items are ready
      // const pendingItems = selectedOrder.items.filter(i => 
      //   i.kitchen && i.itemStatus === 'pending'
      //   &&
      //   i.id !== item.id // ignore the current item
      // );
    
      // if (pendingItems.length === 0) {
      //   console.log("All items ready – calling readyOrder()");
      //   // this.readyOrder(selectedOrder);  // All items are done – mark order as ready
      // } else {
      //   console.log("Item marked ready – more items left to finish.");
      //   // optionally update the backend here for this one item only if needed
      // }

      
  this.orderService.markItemAsReady(orderItemId).subscribe({
    next: (res) => {
      console.log("✅ Backend updated item:", res);

      // Update local item status
      item.itemStatus = 'ready';
      item.statusUpdated = new Date().toISOString();
// ✅ Show a quick success message
this.successMessage = `${item.name} marked as ready ✅`;

// // ⏳ Clear message after 1 second
// setTimeout(() => {
//   this.successMessage = '';
//   this.selectedOrder = null;
// }, 1000);

      // Check if all kitchen items are now ready
      const pendingItems = selectedOrder.items.filter(i => 
        i.kitchen && i.itemStatus === 'pending'
      );

      if (pendingItems.length === 0) {
        console.log("🎉 All items ready – removing order from list");

        this.orders = this.orders.filter(order => order.id !== selectedOrder.id);
        this.pendingOrders = this.pendingOrders.filter(order => order.id !== selectedOrder.id);
        this.allOrders = this.allOrders.filter(order => order.id !== selectedOrder.id);
        this.frontOrders = this.frontOrders.filter(order => order.id !== selectedOrder.id);
        this.backOrders = this.backOrders.filter(order => order.id !== selectedOrder.id);
      }else{
        const pendingItems = selectedOrder.items.filter(i => 
        i.kitchen && i.itemStatus === 'pending'
        &&
        i.id !== item.id
      );
      }
// ⏳ Clear message after 1 second
setTimeout(() => {
  this.successMessage = '';
  this.selectedOrder = null;
}, 1000);
      this.isLoading = false;
      this.NotifyUser();
    },
    error: (err) => {
      console.error("❌ Failed to mark item ready:", err);
      this.isLoading = false;
    }
  });
    }
    
    successMessage: string = '';

    //move order to the finished state
    readyOrder(selectedOrder: Order){
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
              // return;
            }
            else{
              //this is working on select of ok
              // alert("222");
              // return;
            }
          }
  
    // const paymentData = {
    //   orderId: this.selectedOrder?.id,
    //   amount: (this.selectedOrder?.total ?? 0) -( this.selectedOrder?.paidAmount ?? 0),
    //   paymentMethodId:1
    // }
  
    // commented update payment from the kithen
    // this.orderService.updateOrderPayment(paymentData).subscribe(
    //   (response: any) => {
    //     console.log('Order payment updated successfully:', response);
    //   },
    //   error => {
    //     console.error('Error updating payment:', error);
    //   }
    // );
  
   

    this.orderService.updateOrderStatus(selectedOrder.id, 'Ready').subscribe(
      response => {
        console.log('Order status updated successfully', response);
        // Optionally, you can update the orders or handle UI changes here
        this.isLoading = false;
        this.selectedOrder = null;
        this.isLoading = true;
        this.getOrders();
        // this.NotifyKitchen();
        // Notify user here if needed
        this.NotifyUser();
      },
      error => {
        console.error('Error updating the order status', error);
        this.isLoading = false;
        // You can display a message or handle the error accordingly
      }
    );
  }
    
  // ngOnDestroy to unsubscribe from WebSocket notifications and clean up
  ngOnDestroy() {
    if (this.notifSub) {
      this.notifSub.unsubscribe(); // Unsubscribe from WebSocket notifications to avoid memory leaks
      console.log('WebSocket subscription cleaned up');
    }
  }


  
    selectedOrder: Order | null = null;

selectOrder(order: Order) {
  this.selectedOrder = order;
}

closeOrderPopup() {
  this.selectedOrder = null;
}

closeDropdownPopup(){
  this.dropdownVisible = false;
}

finishOrder() {
  console.log('Finish logic for', this.selectedOrder);
  this.selectedOrder = null;
}

cancelOrder() {
  console.log('Cancel logic for', this.selectedOrder);
  this.selectedOrder = null;
}


  //below header functions
  goToHome() {
    // this.cart=[];
    // console.log('Going to Drafts...');
    this.router.navigate(['/user']);
    this.closeDropdown();
  }
  closeDropdown() {
    this.dropdownVisible = false;
  }
  usersmenu() {
    this.router.navigate(['/user']);
    console.log('Users page...');
  }
  // Toggle dropdown visibility
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
// // // Show Zoom Settings Modal
openZoomSettings(): void {
  this.zoomModalVisible = true;
}

// // // Close Zoom Settings Modal
closeZoomSettings(): void {
  this.zoomModalVisible = false;
}
 

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


logout() {
    
  // Clear all session data from storage
  this.storageService.clearAllLocalVariables();
  this.router.navigate(['/login']);
  console.log('Logging out...');
}

}
