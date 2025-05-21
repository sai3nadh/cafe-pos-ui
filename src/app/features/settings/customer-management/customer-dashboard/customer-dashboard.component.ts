import { Component } from '@angular/core';
import { CustomerListComponent } from "../customer-list/customer-list.component";
import { CustomerFormComponent } from "../customer-form/customer-form.component";
import { CustomerDetailComponent } from "../customer-detail/customer-detail.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CustomerListComponent, CustomerFormComponent, CustomerDetailComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss'
})
export class CustomerDashboardComponent {
  mode: 'list' | 'form' | 'detail' = 'list';
  selectedCustomerId: string | null = null;

  openForm(id?: string) {
    this.selectedCustomerId = id || null;
    this.mode = 'form';
  }

  openDetail(id: string) {
    this.selectedCustomerId = id;
    this.mode = 'detail';
  }

  goBack() {
    this.mode = 'list';
    this.selectedCustomerId = null;
  }
}
