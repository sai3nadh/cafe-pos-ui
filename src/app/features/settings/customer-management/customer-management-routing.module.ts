import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';

// const routes: Routes = [];
// const routes: Routes = [
//   {
//     path: '',
//     loadComponent: () =>
//       import('./customer-dashboard/customer-dashboard.component')
//         .then(m => m.CustomerDashboardComponent)
//   }
// ];


const routes: Routes = [
  { path: '', component: CustomerDashboardComponent },
  { path: 'add', component: CustomerFormComponent },
  { path: 'edit/:id', component: CustomerFormComponent },
  { path: ':id', component: CustomerDetailComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
