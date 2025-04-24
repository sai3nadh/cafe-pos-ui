import { Component } from '@angular/core';
import { OrderService } from '../home/order.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../services/websocket.service';
import { NotificationApiService } from '../services/notification-api.service';

@Component({
  selector: 'app-ready-orders-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ready-orders-display.component.html',
  styleUrl: './ready-orders-display.component.scss'
})
export class ReadyOrdersDisplayComponent {
  
  allOrders: string[] = [];
  visibleOrders: string[] = [];
  currentPage = 0;
  intervalSubscription!: Subscription;
  private notifSub!: Subscription;

  constructor(private orderService: OrderService
        ,private wsService: WebSocketService
        ,private notifcationService : NotificationApiService // to send the notifications
  ) {}

  ngOnInit(): void {
    this.fetchReadyOrders();

    this.intervalSubscription = interval(5000).subscribe(() => {
      this.nextPage();
    });
    this.wsService.connect(); // ✅ Ensure WebSocket connects on init

    window.addEventListener('resize', this.handleResize);

    this.notifSub = this.wsService.subscribeToTopic('/topic/order-display').subscribe(msg => {
      const order = typeof msg.body === 'string' ? JSON.parse(msg.body) : msg.body;
      // this.displayOrders.unshift(order); // add new orders to top
      console.log("new received--"+order);
      console.log('🔔 Raw message:', msg);

      this.fetchReadyOrders();
    });
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    if (this.notifSub) {
      this.notifSub.unsubscribe();
    }
    window.removeEventListener('resize', this.handleResize);
  }

  fetchReadyOrders() {
    this.orderService.getReadyOrdersToday().subscribe(data => {
      this.allOrders = data.map(order => '#' + order.orderNumber.slice(-3));
      this.updateVisibleOrders();
    });
  }

  updateVisibleOrders() {
    const itemsPerPage = this.calculateItemsPerPage();
    const start = this.currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    this.visibleOrders = this.allOrders.slice(start, end);

    if (this.visibleOrders.length === 0 && this.allOrders.length > 0) {
      this.currentPage = 0;
      this.updateVisibleOrders();
    }
  }

  // nextPageww() {
  //   const grid = document.querySelector('.orders-grid');
  //   if (grid) grid.classList.add('fade-out');
  
  //   setTimeout(() => {
  //     this.currentPage++;
  //     this.updateVisibleOrders();
  
  //     if (grid) {
  //       grid.classList.remove('fade-out');
  //     }
  //   }, 300); // Slightly less than the transition duration (400ms)
  // }
  

  nextPage() {
    const grid = document.querySelector('.orders-grid');
    if (!grid) return;
  
    // Fade out first
    grid.classList.add('fade-out');
  
    setTimeout(() => {
      this.currentPage++;
      this.updateVisibleOrders();
  
      // Fade in after content update
      grid.classList.remove('fade-out');
      grid.classList.add('fade-in');
  
      // Remove fade-in class after it completes
      setTimeout(() => {
        grid.classList.remove('fade-in');
      }, 300);
    }, 300);
  }
  
  calculateItemsPerPage(): number {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const minBoxWidth = 150;
    const minBoxHeight = 250;
    const cols = Math.floor(screenWidth / minBoxWidth);
    const rows = Math.floor((screenHeight - 200) / minBoxHeight); // 100 = header est.
    return Math.max(cols * rows, 1);
  }


  handleResize = () => {
    this.updateVisibleOrders();
  }

  
}

