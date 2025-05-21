import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerManagementRoutingModule,
    CustomerDashboardComponent,
    CustomerListComponent,
    CustomerFormComponent,
    CustomerDetailComponent
  ]
})
export class CustomerManagementModule { }
