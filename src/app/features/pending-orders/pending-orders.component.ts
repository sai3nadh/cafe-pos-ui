import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';  // Add this import
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
// import { CustomerService } from './add-customer.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';  // Import the Image Compress Service
import { OrderService } from '../home/order.service';
import { UserComponent } from '../user/user.component';


export interface OrderItem {
  id: number;
  name: string;
  price: number;
  category: number;
  qty: number;
}

export interface Order {
  id: number;
  time: string;
  status: string;
  items: OrderItem[];
  total: number;
  orderNumber: string;
  paidAmount: number;
}


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
  
  selectedImage: File | null = null;
  responseMessage: string = '';
  compressedImage: string | null = null;  // Declare compressedImage property to store base64 string
  compressedBlob: Blob | null = null; // Compressed image as Blob



   constructor(private router: Router,
    private fb: FormBuilder, 
    // private adcustomerService: CustomerService,
    //  private orderService: OrderService
       private storageService: StorageService,
       private imageCompress: NgxImageCompressService  // Inject Image Compress Service
       ,private orderService: OrderService
    //  private categoryService : CategoryService
    //   ,private elRef: ElementRef
    //   ,private wsService: WebSocketService
    ) {
      // this.customerForm = this.fb.group({
      //   firstName: [''],
      //   lastName: [''],
      //   email: [''],
      //   phoneNumber: [''],
      //   address: [''],
      //   birthday: [''],
      //   image: [null]
      // });
    }
    ngOnInit() {
      this.orderService.checkLogin();
    }

    allOrders: Order[] = [
      {
          "id": 227,
          "time": "11:39 AM",
          "status": "Pending",
          "items": [
              {
                  "id": 2,
                  "name": "Diet Coke",
                  "price": 40.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 10,
                  "name": "Double Egg Maggi",
                  "price": 70.00,
                  "category": 2,
                  "qty": 2
              },
              {
                  "id": 6,
                  "name": "Water 1L",
                  "price": 20.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 23,
                  "name": "Ocean 65",
                  "price": 65.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 22,
                  "name": "Thumbs UP",
                  "price": 50.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 16,
                  "name": "Sandwich - Corn",
                  "price": 80.00,
                  "category": 2,
                  "qty": 1
              }
          ],
          "total": 395.00,
          "orderNumber": "230325101",
          "paidAmount": 0
      },
      {
          "id": 228,
          "time": "04:06 PM",
          "status": "Completed",
          "items": [
              {
                  "id": 13,
                  "name": "Tea",
                  "price": 10.00,
                  "category": 3,
                  "qty": 1
              },
              {
                  "id": 1,
                  "name": "Coke",
                  "price": 40.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 5,
                  "name": "Water Small",
                  "price": 10.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 43,
                  "name": "Osmania",
                  "price": 5.00,
                  "category": 4,
                  "qty": 1
              }
          ],
          "total": 65.00,
          "orderNumber": "230325102",
          "paidAmount": 65.00
      },
      {
          "id": 229,
          "time": "06:05 PM",
          "status": "Completed",
          "items": [
              {
                  "id": 2,
                  "name": "Diet Coke",
                  "price": 40.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 10,
                  "name": "Double Egg Maggi",
                  "price": 70.00,
                  "category": 2,
                  "qty": 1
              },
              {
                  "id": 16,
                  "name": "Sandwich - Corn",
                  "price": 80.00,
                  "category": 2,
                  "qty": 1
              }
          ],
          "total": 190.00,
          "orderNumber": "230325103",
          "paidAmount": 190.00
      },
      {
          "id": 230,
          "time": "06:09 PM",
          "status": "Completed",
          "items": [
              {
                  "id": 6,
                  "name": "Water 1L",
                  "price": 20.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 5,
                  "name": "Water Small",
                  "price": 10.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 4,
                  "name": "Fanta",
                  "price": 40.00,
                  "category": 1,
                  "qty": 1
              }
          ],
          "total": 70.00,
          "orderNumber": "230325104",
          "paidAmount": 0
      },
      {
          "id": 231,
          "time": "06:10 PM",
          "status": "Completed",
          "items": [
              {
                  "id": 1,
                  "name": "Coke",
                  "price": 40.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 2,
                  "name": "Diet Coke",
                  "price": 40.00,
                  "category": 1,
                  "qty": 1
              }
          ],
          "total": 80.00,
          "orderNumber": "230325105",
          "paidAmount": 0
      },
      {
          "id": 232,
          "time": "06:17 PM",
          "status": "Completed",
          "items": [
              {
                  "id": 6,
                  "name": "Water 1L",
                  "price": 20.00,
                  "category": 1,
                  "qty": 1
              },
              {
                  "id": 5,
                  "name": "Water Small",
                  "price": 10.00,
                  "category": 1,
                  "qty": 1
              }
          ],
          "total": 30.00,
          "orderNumber": "230325106",
          "paidAmount": 0
      },
      {
          "id": 233,
          "time": "06:18 PM",
          "status": "Completed",
          "items": [],
          "total": 0.00,
          "orderNumber": "230325107",
          "paidAmount": 0
      }
  ];
    orders: Order[] = this.allOrders.filter(order => order.status !== 'Pendi');
  

  
    selectedOrder: Order | null = null;

selectOrder(order: Order) {
  this.selectedOrder = order;
}

closeOrderPopup() {
  this.selectedOrder = null;
}

finishOrder() {
  console.log('Finish logic for', this.selectedOrder);
  this.selectedOrder = null;
}

cancelOrder() {
  console.log('Cancel logic for', this.selectedOrder);
  this.selectedOrder = null;
}



  // common methods for all
  // submitForm(): void {
  //   const formData = new FormData();
  //   formData.append('firstName', this.customerForm.get('firstName')?.value);
  //   formData.append('lastName', this.customerForm.get('lastName')?.value);
  //   formData.append('email', this.customerForm.get('email')?.value);
  //   formData.append('phoneNumber', this.customerForm.get('phoneNumber')?.value);
  //   formData.append('address', this.customerForm.get('address')?.value);
  //   formData.append('birthday', this.customerForm.get('birthday')?.value);

  //   if (this.compressedBlob) {
  //     console.log('Compressed file appended');
  //     formData.append('image', this.compressedBlob, 'image.jpg');
  //   }

  //   console.log('Form Data:', formData);

  //   this.adcustomerService.addCustomer(formData).subscribe(
  //     (response) => {
  //       this.responseMessage = 'Customer added successfully!';
  //       console.log('Success:', response);
  //     },
  //     (error) => {
  //       this.responseMessage = 'Error adding customer!';
  //       console.error('Error:', error);
  //     }
  //   );
  // }


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
