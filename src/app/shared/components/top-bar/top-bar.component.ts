import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { StorageService } from '../../../features/services/storage.service';
import { HeaderEventsService } from '../../../features/services/header-events.service';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  
  @ViewChild('topBar', { static: true }) topBarElement!: ElementRef;
  @Output() heightReady = new EventEmitter<number>();

dropdownVisible: boolean= false;
canEdit: boolean = true;

currentUrl: string = '';


constructor(
  private router: Router,
  private storageService : StorageService,
  private elRef: ElementRef,
  private headerEvents: HeaderEventsService
) {

  this.currentUrl = this.router.url; 
  // Listen to route changes
  this.router.events.subscribe(() => {
    this.currentUrl = this.router.url;
  });
}



ngAfterViewInit() {
  setTimeout(() => {
    const height = this.topBarElement.nativeElement.offsetHeight;

    // const height = this.elRef.nativeElement.offsetHeight;
    console.log('TopBar Height:', height);
    this.heightReady.emit(height);
  });
}
// ngAfterViewInit() {
//   const height = this.elRef.nativeElement.offsetHeight;
//   console.log('TopBar Height:', height);
//   this.heightReady.emit(height);
// }


openZoomSettings(): void {
  this.headerEvents.triggerOpenZoomSettings(); // ✅ Inform UserComponent to open modal
}
openOrdersPopup() {
  this.headerEvents.triggerOpenOrdersPopup();
}

toggleUsersPopUp(){
  this.headerEvents.triggerOpenUsersPopup();
}
isUserPage(): boolean {
  return this.currentUrl.includes('/user');
  // return ['/user', '/orders'].some(path => this.currentUrl.includes(path)); // this method to find multitple
}

isKitchenPage(): boolean {
  return this.currentUrl.includes('/pending-orders');
}


 isInven(): boolean {
  return this.currentUrl.includes('/inventory');
}
 
 goToInvnDash(){
  this.router.navigate(['/inventory/dashboard']);
 }

viewReports() {
  this.router.navigate(['/report']);
  // this.closeDropdown();
}

registerUser(){
  this.router.navigate(['/register']);
  // this.closeDropdown();
}
orderDisplay(){
  this.router.navigate(['/display']);
  // this.closeDropdown();
}

addCustomer() {

  // console.log('Going to Drafts...');
  this.router.navigate(['/add-customer']);
  // this.closeDropdown();
}

pendingOrders(){
  // this.closeDropdown();
  this.router.navigate(['/pending-orders']);
}

editItems(){
  // this.closeDropdown();
  this.router.navigate(['/edit-menu']);
}


toggleUsers() {
throw new Error('Method not implemented.');
}
showOrdersIcon: any;
// toggleOrdersModal() {
// throw new Error('Method not implemented.');
// }
// getCustomerOrdersToday() {
// throw new Error('Method not implemented.');
// }

  // Toggle dropdown visibility
   toggleDropdown() {
    if(this.canEdit){
    this.dropdownVisible = !this.dropdownVisible;
    }
  }
closeCheckoutModal() {
  this.dropdownVisible = !this.dropdownVisible;
// throw new Error('Method not implemented.');
}

// openZoomSettings() {
// throw new Error('Method not implemented.');
// }



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


logout() {
     // Save zoomLevel
  const zoomLevel = this.storageService.getLocalVariable('zoomLevel');

  // Clear all session data from storage
  this.storageService.clearAllLocalVariables();

  // Restore zoomLevel
  this.storageService.setLocalVariable('zoomLevel', zoomLevel);

  this.router.navigate(['/login']);
  console.log('Logging out...');
}

goToHome() {

  this.router.navigate(['/user']);
  // this.closeDropdown();
}
}
