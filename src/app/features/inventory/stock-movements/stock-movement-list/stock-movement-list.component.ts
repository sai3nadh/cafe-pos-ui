import { Component, EventEmitter, Output } from '@angular/core';
import { StockMovement } from '../stock-movement.model';
import { StockMovementService } from '../stock-movement.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-movement-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stock-movement-list.component.html',
  styleUrl: './stock-movement-list.component.scss'
})
export class StockMovementListComponent {
  @Output() adjustStock = new EventEmitter<void>();

  stockMovements: StockMovement[] = [];
  loading = true;

  constructor(private stockMovementService: StockMovementService) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.stockMovementService.getAll().subscribe({
      next: (data) => {
        this.stockMovements = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load stock movements:', err);
        this.loading = false;
      }
    });
  }

}
