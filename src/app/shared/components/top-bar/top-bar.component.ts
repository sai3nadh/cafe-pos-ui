import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { StorageService } from '../../../features/services/storage.service';
import { HeaderEventsService } from '../../../features/services/header-events.service';
import { PrinterService } from '../../services/printer.service';
import { PrintingStatusService } from '../../services/printing-status.service';
import { WebSocketService } from '../../../features/services/websocket.service';

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
canEdit: boolean = false;

currentUrl: string = '';
printingEnabled: boolean = true;  // default true
role: string = ""; // example user id


constructor(
  private router: Router,
  private storageService : StorageService,
  private elRef: ElementRef,
  private headerEvents: HeaderEventsService
  ,private printerService: PrinterService
  ,private printingStatusService: PrintingStatusService
  ,private wsService: WebSocketService

) {
  console.log('🚀 TopBarComponent constructed');

  this.currentUrl = this.router.url; 
  // Listen to route changes
  this.router.events.subscribe(() => {
    this.currentUrl = this.router.url;
  });
}
ngOnInit() {
  console.log('👂 TopBarComponent subscribing to status$');
 this.role = this.storageService.getLocalVariable("role");
    if(this.role.toLocaleLowerCase() == "admin" || this.role.toLocaleLowerCase() == "owner" ){
      this.canEdit = true;
    }
  this.wsService.connect();
   this.printingStatusService.status$.subscribe(status => {
        console.log('✅ [TopBarComponent] Got status update:', status);
    // alert("new satus= "+ status);
      this.printingEnabled = status;
    });
    // Listen to changes from other tabs
  window.addEventListener('storage', (event) => {
    if (event.key === 'printingEnabled') {
      const newStatus = event.newValue === 'true';
      this.printingEnabled = newStatus;
    }
  });
   // 🌐 Listen to WebSocket topic (multi-device real-time sync)
  this.wsService.subscribeToTopic<string>('/topic/printer-status').subscribe((msg: string) => {
    console.log('🌍 [WebSocket] Printer status from backend:', msg);
    const newStatus = msg === 'true';
    this.printingStatusService.setStatus(newStatus); // 💡 Also update BehaviorSubject
  });

  // const saved = localStorage.getItem('printingEnabled');

  // if (saved !== null) {
  //   // 👉 Use saved value from localStorage (user's previous choice on this device)
  //   this.printingEnabled = (saved === 'true');
  // } else {
  //   // 👉 No saved value → get from backend
  //   this.printerService.getPrinterStatus().subscribe(status => {
  //     this.printingEnabled = status;
  //     // 👉 Save backend value in localStorage for next time
  //     localStorage.setItem('printingEnabled', String(status));
  //   });
  // }
}

togglePrinting() {
  const newValue = !this.printingEnabled;

    this.printerService.setPrinterStatus(newValue).subscribe({
      next: (response) => {
        if (response.success) {
          this.printingStatusService.setStatus(newValue); // 🔁 Update shared state
        }
      },
      error: () => alert('Failed to update status')
    });
  // this.printerService.setPrinterStatus(newValue).subscribe({
  //   next: (response) => {
  //     if (response.success) {
  //       this.printingEnabled = newValue;
  //       localStorage.setItem('printingEnabled', String(newValue));
  //       console.log(response.message);  // Or show a toast/alert to the user
  //     } else {
  //       alert('Failed to update printing status: ' + response.message);
  //     }
  //   },
  //   error: (err) => {
  //     console.error('Server error while updating printer status', err);
  //     alert('Server error while updating printer status.');
  //   }
  // });
}

ngAfterViewInit() {
  const resizeObserver = new ResizeObserver(() => {
    const height = this.topBarElement.nativeElement.offsetHeight;
    // console.log('TopBar Height (Resize):', height);
    this.heightReady.emit(height);
  });

  resizeObserver.observe(this.topBarElement.nativeElement);
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

 goToSettings(){
  this.router.navigate(['/settings']);
 }

 isMenuMngmt(): boolean {
  return this.currentUrl.includes('/menu-management');
}

 isSetting(): boolean {
  return this.currentUrl.includes('/settings') || this.currentUrl.includes('/inventory') || this.currentUrl.includes('/menu-management');
}

goToMenuMngmt(){
  this.router.navigate(['/menu-management/dashboard']);
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

customerMngmt() {

  // console.log('Going to Drafts...');
  this.router.navigate(['/customers']);
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
    if(this.canEdit || true){
      // alert("aaa");
    this.dropdownVisible = true;// !this.dropdownVisible;
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
