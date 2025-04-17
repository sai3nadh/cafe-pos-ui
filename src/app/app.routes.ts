import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { UserComponent } from './features/user/user.component'; // Updated path
import { EditMenuComponent } from './features/edit-menu/edit-menu.component';
import { AddCustomerComponent } from './features/add-customer/add-customer.component';
import { PendingOrdersComponent } from './features/pending-orders/pending-orders.component';
import { ReportComponent } from './features/report/report.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'user', component: UserComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'edit-menu', component: EditMenuComponent }, // Add the new route
    { path: 'add-customer', component: AddCustomerComponent },  // New route for add customer
    { path: 'pending-orders', component: PendingOrdersComponent },  // New route for add customer
    { path: 'home', component: HomeComponent },
    { path: 'report', component: ReportComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
    , // Default to Login page
    { path: '**', redirectTo: 'login' } // Wildcard to Login  
];
