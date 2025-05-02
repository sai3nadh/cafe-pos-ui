// import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';


// interface Supplier {
//   id: number;
//   name: string;
//   phone: string;
//   email?: string;
//   gst_number?: string;
//   status: 'active' | 'inactive';
// }

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent {
// Output events to parent component
@Output() addSupplier = new EventEmitter<void>();
@Output() editSupplier = new EventEmitter<number>();
@Output() viewSupplier = new EventEmitter<number>();

constructor(private supplierService: SupplierService) {}

// // Mock data (replace with API later)
// suppliers: Supplier[] = [
//   {
//     id: 1,
//     name: 'ABC Foods',
//     phone: '9876543210',
//     email: 'abc@foods.com',
//     gst_number: 'GST1234ABC',
//     status: 'active'
//   },
//   {
//     id: 2,
//     name: 'Fresh Farms',
//     phone: '9123456789',
//     status: 'active'
//   },
//   {
//     id: 3,
//     name: 'BulkMart Ltd',
//     phone: '9988776655',
//     status: 'inactive'
//   }
// ];



suppliers: Supplier[] = [];
loading: boolean = false;
error: string | null = null;

ngOnInit(): void {
  this.loadSuppliers();
}

loadSuppliers(): void {
  this.loading = true;
  this.error = null;

  this.supplierService.getAllSuppliers().subscribe({
    next: (data) => {
      console.log('Suppliers fetched from API:', data);
      this.suppliers = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching suppliers:', err);
      this.error = 'Failed to load suppliers';
      this.loading = false;
    }
  });
}
// Emitters
onAdd() {
  console.log('Add clicked'); // add this log
  this.addSupplier.emit();
}

onEdit(id: number) {
  console.log('Edit clicked', id); // add this log
  this.editSupplier.emit(id);
}

onView(id: number) {
  console.log('View clicked', id); // add this log
  this.viewSupplier.emit(id);
}

// onAdd() {
//   alert("onAdd");
//   this.addSupplier.emit();
// }

// onEdit(id: number) {
//   this.editSupplier.emit(id);
// }

// onView(id: number) {
//   this.viewSupplier.emit(id);
// }
}
