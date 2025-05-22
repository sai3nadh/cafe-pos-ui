import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrintingStatusService {
  private statusSubject = new BehaviorSubject<boolean>(this.loadInitialStatus());
  public status$ = this.statusSubject.asObservable();

  private loadInitialStatus(): boolean {
    const stored = localStorage.getItem('printingEnabled');
    return stored === 'true';
  }

  setStatus(value: boolean) {
    if (this.statusSubject.value !== value) {
        this.statusSubject.next(value);
        localStorage.setItem('printingEnabled', String(value));
    }
  }


  getStatus(): boolean {
    return this.statusSubject.value;
  }
}
