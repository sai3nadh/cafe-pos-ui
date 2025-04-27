import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderEventsService {
  private openOrdersPopupSubject = new Subject<void>();
  private openUsersPopupSubject = new Subject<void>(); // <--- NEW
  private showTopBarSubject = new Subject<boolean>(); // 👈 NEW for TopBar control
  private topBarHeightSubject = new BehaviorSubject<number>(0); // 👈 Add this

  openOrdersPopup$ = this.openOrdersPopupSubject.asObservable();
  openUsersPopup$ = this.openUsersPopupSubject.asObservable(); // <--- NEW
  showTopBar$ = this.showTopBarSubject.asObservable(); // 👈 NEW Observable
  topBarHeight$ = this.topBarHeightSubject.asObservable(); // 👈 Add this



  private openZoomSettingsSubject = new Subject<void>();
openZoomSettings$ = this.openZoomSettingsSubject.asObservable();

triggerOpenZoomSettings() {
  this.openZoomSettingsSubject.next();
}



  setTopBarHeight(height: number) { 
    this.topBarHeightSubject.next(height);
  }
  triggerOpenOrdersPopup() {
    this.openOrdersPopupSubject.next();
  }

  //method sends opens user popup
  triggerOpenUsersPopup() {  
    this.openUsersPopupSubject.next();
  }

   // 👇 New methods for TopBar
   triggerShowTopBar() {
    this.showTopBarSubject.next(true);
  }

  triggerHideTopBar() {
    this.showTopBarSubject.next(false);
  }
}
