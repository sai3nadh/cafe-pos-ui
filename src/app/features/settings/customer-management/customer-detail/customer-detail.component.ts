import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { CustomerData } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; // ✅ THIS is the correct import

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [ 
    CommonModule
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnChanges  {
  @Input() customerId: string | null = null;
  customer: CustomerData | null = null;
  loading = false;

  @Input() showCloseButton = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
    ,private location: Location
  ) {}

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.fetchCustomer();
    }
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customerId'] && this.customerId) {
      this.fetchCustomer();
    }
  }

  fetchCustomer() {
    this.loading = true;
    this.customerService.getCustomerById(this.customerId!).subscribe({
      next: (data) => {
        this.customer = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load customer:', err);
        this.loading = false;
      }
    });
  }
  goBack(): void {
    this.location.back(); // ✅ Now this works
  }
}
