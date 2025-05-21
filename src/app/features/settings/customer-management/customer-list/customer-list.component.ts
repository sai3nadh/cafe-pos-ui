import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerList } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  customers: CustomerList[] = [];

  @Output() addCustomer = new EventEmitter<void>();
  @Output() editCustomer = new EventEmitter<string>();
  @Output() viewCustomer = new EventEmitter<string>();

  constructor(private customerService: CustomerService) {}


  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomerList().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Failed to load customers', err)
    });
  }

  // Example mock customer data
  // customers = [
  //   { id: 'c1', firstName: 'John', lastName: 'Doe' },
  //   { id: 'c2', firstName: 'Jane', lastName: 'Smith' }
  // ];

  onAdd() {
    this.addCustomer.emit();
  }

  onEdit(id: string) {
    this.editCustomer.emit(id);
  }

  onView(id: string) {
    this.viewCustomer.emit(id);
  }
  // @Output() addCustomer = new EventEmitter<void>();
  // @Output() editCustomer = new EventEmitter<string>();
  // @Output() viewCustomer = new EventEmitter<string>();

  // // Call this with customer ID
  // onEditCustomer(id: string) {
  //   this.editCustomer.emit(id);
  // }

  // onViewCustomer(id: string) {
  //   this.viewCustomer.emit(id);
  // }


//   @Output() editCustomer = new EventEmitter<string>();
// @Output() viewCustomer = new EventEmitter<string>();

// onEditCustomer(id: string) {
//   this.editCustomer.emit(id);
// }

// onViewCustomer(id: string) {
//   this.viewCustomer.emit(id);
// }

}
