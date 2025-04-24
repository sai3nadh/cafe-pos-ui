import { Component } from '@angular/core';
import { OrderService } from '../home/order.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchReadyOrders();

    this.intervalSubscription = interval(5000).subscribe(() => {
      this.nextPage();
    });

    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
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

  // nextPage() {
  //   this.currentPage++;
  //   this.updateVisibleOrders();
  // }
  nextPageww() {
    const grid = document.querySelector('.orders-grid');
    if (grid) grid.classList.add('fade-out');
  
    setTimeout(() => {
      this.currentPage++;
      this.updateVisibleOrders();
  
      if (grid) {
        grid.classList.remove('fade-out');
      }
    }, 300); // Slightly less than the transition duration (400ms)
  }
  

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

  // calculateItemsPerPage(): number {
  //   const grid = document.querySelector('.orders-grid') as HTMLElement;
  //   const header = document.querySelector('.header') as HTMLElement;
  
  //   if (!grid || !header) return 6;
  
  //   // Create a temporary test box to measure actual size
  //   const testBox = document.createElement('div');
  //   testBox.className = 'order-box';
  //   testBox.innerText = '#000';
  //   testBox.style.visibility = 'hidden';
  //   testBox.style.position = 'absolute';
  //   testBox.style.pointerEvents = 'none';
  
  //   document.body.appendChild(testBox);
  
  //   const boxWidth = testBox.offsetWidth;
  //   const boxHeight = testBox.offsetHeight;
  
  //   document.body.removeChild(testBox);
  
  //   const screenWidth = window.innerWidth;
  //   const screenHeight = window.innerHeight;
  //   const headerHeight = header.offsetHeight;
  
  //   const verticalGap = 20;   // Adjust if your .orders-grid uses different gap
  //   const horizontalGap = 20;
  
  //   const cols = Math.floor((screenWidth + horizontalGap) / (boxWidth + horizontalGap));
  //   const rows = Math.floor((screenHeight - headerHeight + verticalGap) / (boxHeight + verticalGap));
  
  //   return Math.max(cols * rows, 1);
  // }
  

  handleResize = () => {
    this.updateVisibleOrders();
  }

  
}



  // constructor(private orderService: OrderService) {}

  // fetchReadyOrders() {
  //   this.orderService.getReadyOrdersToday().subscribe(data => {
  //     this.allOrders = data.map(order => '#' + order.orderNumber.slice(-3));
  //     this.updateVisibleOrders();
  //   });
  // }

  // allOrders: string[] = [];
  // visibleOrders: string[] = [];
  // currentPage = 0;
  // ordersPerPage = 6;
  // intervalSubscription!: Subscription;


  // // ngOnInit(): void {
  // //   this.fetchReadyOrders();
  // //   this.intervalSubscription = interval(5000).subscribe(() => {
  // //     this.nextPage();
  // //   });
  // // }

  // // fetchReadyOrders() {
  // //   this.http.get<any[]>('http://localhost:8083/api/orders/today/ready/display')
  // //     .subscribe(data => {
  // //       this.allOrders = data.map(order => '#' + order.orderNumber.slice(-3));
  // //       this.updateVisibleOrders();
  // //     });
  // // }

  // // updateVisibleOrders() {
  // //   const start = this.currentPage * this.ordersPerPage;
  // //   const end = start + this.ordersPerPage;
  // //   this.visibleOrders = this.allOrders.slice(start, end);

  // //   if (this.visibleOrders.length === 0) {
  // //     this.currentPage = 0;
  // //     this.updateVisibleOrders();
  // //   }
  // // }

  // updateVisibleOrders() {
  //   const itemsPerPage = this.calculateItemsPerPage(); // 👈 NEW
  //   const start = this.currentPage * itemsPerPage;
  //   const end = start + itemsPerPage;
  //   this.visibleOrders = this.allOrders.slice(start, end);
  
  //   if (this.visibleOrders.length === 0) {
  //     this.currentPage = 0;
  //     this.updateVisibleOrders();
  //   }
  // }

  // calculateItemsPerPage(): number {
  //   const screenWidth = window.innerWidth;
  //   const screenHeight = window.innerHeight;
  
  //   const minBoxWidth = 300; // px
  //   const minBoxHeight = 300; // px
  
  //   const cols = Math.floor(screenWidth / minBoxWidth);
  //   const rows = Math.floor(screenHeight / minBoxHeight);
  
  //   return cols * rows;
  // }
  
  

  // nextPage() {
  //   this.currentPage++;
  //   this.updateVisibleOrders();
  // }

  // // ngOnDestroy(): void {
  // //   if (this.intervalSubscription) {
  // //     this.intervalSubscription.unsubscribe();
  // //   }
  // // }

  // ngOnInit(): void {
  //   this.fetchReadyOrders();
  //   this.intervalSubscription = interval(5000).subscribe(() => {
  //     this.nextPage();
  //   });
  
  //   window.addEventListener('resize', () => {
  //     this.updateVisibleOrders();
  //   });
  // }
  
  // ngOnDestroy(): void {
  //   if (this.intervalSubscription) {
  //     this.intervalSubscription.unsubscribe();
  //   }
  //   window.removeEventListener('resize', this.updateVisibleOrders);
  // }
  
// }
