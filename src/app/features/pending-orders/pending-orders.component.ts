import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';  // Add this import
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
// import { CustomerService } from './add-customer.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';  // Import the Image Compress Service
import { OrderDto, OrderItemDto , OrderService } from '../home/order.service';
import { Order } from '../user/user.component';
import { UserComponent } from '../user/user.component';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';


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
    ) {
    }
      private notifSub!: Subscription;
      isLoading: boolean = false;
    
    ngOnInit() {
      this.isLoading=true;
      this.orderService.checkLogin();
      this.userId = this.storageService.getLocalVariable('userId');
      this.getOrders();
      this.filterOrdersBySittingArea(this.allOrders);
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
    }

    allOrders: OrderDto[] =[];
    orders: OrderDto[] =[];
    // OrderDto[] = [];
    userId = -1;
 

    frontOrders: OrderDto[] = [];
    backOrders: OrderDto[] = [];
    kitchenSummary: { name: string, qty: number }[] = [];



    filterOrdersBySittingArea(allOrders: OrderDto[]): void {
      this.frontOrders = allOrders.filter(order => order.sittingArea === 'front');
      this.backOrders = allOrders.filter(order => order.sittingArea === 'back' );
      this.orders = this.allOrders.filter(order => order.status === 'Pending');
    }

    filterOrders(area: 'all' | 'front' | 'back') {
      this.isLoading = true;
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
          this.orders = this.allOrders;
          break;
      }
      this.isLoading = false;
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
console.log("called here--kitchen");

  this.allOrders
    .filter(order => order.status === 'Pending')
    .forEach(order => {
      order.items.forEach(item => {
        if (item.kitchen) {
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
      alert("retuned--");
      this.isLoading = false; // Set here in case of early return
      return;
    }
    this.orderService.getOrdersForUserToday(this.userId).subscribe((orders: OrderDto[]) => {
      this.allOrders = orders;
      this.orders = this.allOrders.filter(order => order.status === 'Pending');
      this.filterOrdersBySittingArea(this.allOrders);
      this.isLoading = false; // Set here in case of early return
    },
    error => {
      console.error("Error fetching orders", error);
      this.isLoading = false; // ✅ Set false on error too
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
