import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  EventEmitter, Output } from '@angular/core';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SupplierListComponent,
    // SuppliersComponent,
    SupplierFormComponent,
    SupplierDetailComponent
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent {
  mode: 'list' | 'form' | 'detail' = 'list';
  selectedSupplierId?: number;
  openForm(supplierId?: number) {
    console.log('Opening form for', supplierId);
    this.selectedSupplierId = supplierId;
    this.mode = 'form';
  }
  
  openDetail(supplierId: number) {
    console.log('Opening detail for', supplierId);
    this.selectedSupplierId = supplierId;
    this.mode = 'detail';
  }
  
  goBackToList() {
    console.log('Going back to list');
    this.mode = 'list';
    this.selectedSupplierId = undefined;
  }
  
  // openForm(supplierId?: number) {
  //   this.selectedSupplierId = supplierId;
  //   this.mode = 'form';
  // }

  // openDetail(supplierId: number) {
  //   this.selectedSupplierId = supplierId;
  //   this.mode = 'detail';
  // }

  // goBackToList() {
  //   this.mode = 'list';
  //   this.selectedSupplierId = undefined;
  // }
}
