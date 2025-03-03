import { Component } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';  // Add this import
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-customer',
  imports: [RouterModule
    , CommonModule
            ,FormsModule // To enable ngModel for form binding
    
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
  dropdownVisible = false;
  showOrdersIcon: boolean = false; 
   constructor(private router: Router,
    //  private orderService: OrderService
       private storageService: StorageService,
    //  private categoryService : CategoryService
    //   ,private elRef: ElementRef
    //   ,private wsService: WebSocketService
    ) {}
    ngOnInit() {
    }
  // cart: Item[] = [];

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
