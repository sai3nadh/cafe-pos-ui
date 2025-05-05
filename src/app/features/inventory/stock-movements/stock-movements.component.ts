import { Component, ViewChild } from '@angular/core';
import { StockMovementAdjustComponent } from "./stock-movement-adjust/stock-movement-adjust.component";
import { StockMovementListComponent } from "./stock-movement-list/stock-movement-list.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [StockMovementAdjustComponent, StockMovementListComponent
    ,CommonModule
  ],
  templateUrl: './stock-movements.component.html',
  styleUrl: './stock-movements.component.scss'
})
export class StockMovementsComponent {
// openAdjustment() {
// throw new Error('Method not implemented.');
// }
// goBackToList() {
// throw new Error('Method not implemented.');
// }
mode: 'list' | 'adjust' = 'list';

@ViewChild(StockMovementListComponent) listComponent!: StockMovementListComponent;

// onSaved(refresh: boolean): void {
//   this.mode = 'list';
//   if (refresh && this.listComponent) {
//     this.listComponent.loadMovements();
//   }
// }
openAdjustment(): void {
  this.mode = 'adjust';
}

goBackToList(): void {
  this.mode = 'list';
}

// STEP 3 — if saved, maybe refresh the list
// onSaved(refresh: boolean): void {
//   this.mode = 'list';
//   if (refresh) {
//     // OPTIONAL: Reload the list if refresh is true
//     // We'll connect this when the list emits the EventEmitter.
//     console.log('Stock list should refresh now!');
//     // If you're using ViewChild or another method, call listComponent.loadMovements() here.
//   }
// }
onSaved(refresh: boolean): void {
  this.mode = 'list';
  if (refresh && this.listComponent) {
    this.listComponent.loadMovements();
  }
}
}
