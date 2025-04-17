import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { OrderService } from '../home/order.service';
import { NotificationApiService } from '../services/notification-api.service';
import { StorageService } from '../services/storage.service';
import { WebSocketService } from '../services/websocket.service';

export interface SummaryDTO {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
}

export interface DailySales {
  date: string;          // or Date
  orderCount: number;
  totalSales: number;
}

export interface ItemReportDTO {
  name: string;
  quantity: number;
  revenue: number;
}

export interface PaymentMethodDTO {
  method: string;
  count: number;
  total: number;
}

export interface CategoryReportDTO {
  name: string;
  total: number;
}

export interface ReportDTO {
  summary: SummaryDTO;
  topItems: ItemReportDTO[];
  paymentBreakdown: PaymentMethodDTO[];
  categorySales: CategoryReportDTO[];
  allItemSales: ItemReportDTO[];
}

@Component({
  selector: 'app-report',
  imports: [RouterModule
      , CommonModule
              ,FormsModule // To enable ngModel for form binding
      ,ReactiveFormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
reportFromDate: any;
reportToDate: any;

   
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
      ) {
      }

      isLoading: boolean = false;
    
      ngOnInit() {
        this.isLoading=true;
        this.orderService.checkLogin();
        this.fetchReport();
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
throw new Error('Method not implemented.');
}


logout() {
  // Clear all session data from storage
  this.storageService.clearAllLocalVariables();
  this.router.navigate(['/login']);
  console.log('Logging out...');
}

toggleDropdown() {
throw new Error('Method not implemented.');
}
dropdownVisible: any;
closeDropdownPopup() {
throw new Error('Method not implemented.');
}
openZoomSettings() {
throw new Error('Method not implemented.');
}
zoomModalVisible: any;
changeZoom(arg0: number) {
throw new Error('Method not implemented.');
}
zoomLevel: any;
adjustZoom($event: Event) {
throw new Error('Method not implemented.');
}
closeZoomSettings() {
throw new Error('Method not implemented.');
}
showTopBar: any;
activeFilter: any;
filterOrders(arg0: string) {
throw new Error('Method not implemented.');
}
generateKitchenSummary() {
throw new Error('Method not implemented.');
}
toggleTopBar() {
throw new Error('Method not implemented.');
}

// above is common
// reportDate: string = ''; // bind to date input

totalSales = 0;
totalOrders = 0;
avgOrderValue = 0;

// topItems = [
//   // Example structure
//   // { name: 'Latte', quantity: 12, revenue: 180.00 }
// ];

// paymentBreakdown = [
//   // { name: 'Cash', count: 20, total: 500.00 }
// ];

// categorySales = [
//   // { name: 'Food', total: 300.00 }
// ];

// fetchReport() {
//   // Call your backend using reportDate
//   // Assign values to the variables above
// }

reportDate: string = this.getToday(); // default to today
fromDate: string = this.getToday();
toDate: string = this.getToday();

// Summary values
// totalSales: number = 0;
// totalOrders: number = 0;
// avgOrderValue: number = 0;

// Tables
// topItems: any[] = [];
// paymentBreakdown: any[] = [];
// categorySales: any[] = [];
// allItemSales: any[] = [];


// Tables
topItems: ItemReportDTO[] = [];
paymentBreakdown: PaymentMethodDTO[] = [];
categorySales: CategoryReportDTO[] = [];
allItemSales: ItemReportDTO[] = [];
dailySales: DailySales[] = [];

// fromDate: string = this.getToday();
// toDate: string = this.getToday();

reportData!: ReportDTO;
// isLoading: boolean = false;

fetchReport(): void {
  this.lastGenerated = new Date;
  this.reportFromDate = this.fromDate;
  this.reportToDate = this.toDate;
  this.isLoading = true;
  this.orderService.getSalesReport(this.fromDate, this.toDate)
    .subscribe({
      next: (data) => {
        // this.reportData = data;
        this.handleReportData(data);
        this.isLoading = false;
        // console.log(this.reportData);
        // this.topItems = data.topItems;
        // this.paymentBreakdown = data.paymentBreakdown;
        // this.allItemSales = data.allItemSales;
        // this.categorySales = data.categorySales;
        // this.totalSales = data.summary.totalSales;
        // this.totalOrders = data.summary.totalOrders;
        // this.avgOrderValue = data.summary.avgOrderValue;
      },
      error: (err) => {
        console.error('Error loading report', err);
        this.isLoading = false;
      }
    });

  
  
}
loading = false;
error = '';

fetchDailySales():void{
  this.orderService.getDailySales(this.fromDate, this.toDate)
  .subscribe({
    next: (data) => {
      this.dailySales = data;
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Error loading report.';
      this.loading = false;
    }
  });
}

private handleReportData(data: ReportDTO): void {
  this.reportData = data;

  this.topItems = data.topItems;
  this.paymentBreakdown = data.paymentBreakdown;
  this.allItemSales = data.allItemSales;
  this.categorySales = data.categorySales;

  this.totalSales = data.summary.totalSales;
  this.totalOrders = data.summary.totalOrders;
  this.avgOrderValue = data.summary.avgOrderValue;

  console.log('Report loaded:', this.reportData);
}

// // Load dummy data
// fetchReport() {
//   console.log(`Fetching report for date: ${this.reportDate}`);

//   // Summary values
//   this.totalSales = 4320.50;
//   this.totalOrders = 123;
//   this.avgOrderValue = this.totalSales / this.totalOrders;

//   // Top selling items
//   this.topItems = [
//     { name: 'Americano', quantity: 42, revenue: 210.00 },
//     { name: 'Cheese Sandwich', quantity: 35, revenue: 315.00 },
//     { name: 'Latte', quantity: 30, revenue: 180.00 }
//   ];

//   // Payment method breakdown
//   this.paymentBreakdown = [
//     { name: 'Cash', count: 60, total: 2000.00 },
//     { name: 'Card', count: 40, total: 1700.00 },
//     { name: 'QR / UPI', count: 23, total: 620.50 }
//   ];

//   // Sales by category
//   this.categorySales = [
//     { name: 'Beverages', total: 2500.00 },
//     { name: 'Food', total: 1800.00 },
//     { name: 'Desserts', total: 400.00 }
//   ];
//     // Full item-wise sales (dummy)
//     this.allItemSales = [
//       { name: 'Americano', quantity: 42, revenue: 210.00 },
//       { name: 'Cheese Sandwich', quantity: 35, revenue: 315.00 },
//       { name: 'Latte', quantity: 30, revenue: 180.00 },
//       { name: 'Espresso', quantity: 25, revenue: 125.00 },
//       { name: 'Muffin', quantity: 15, revenue: 90.00 },
//       { name: 'Cold Coffee', quantity: 10, revenue: 80.00 }
//     ];
// }

lastGenerated: Date = new Date();


// Utility to get today's date in YYYY-MM-DD format
getToday(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
}
