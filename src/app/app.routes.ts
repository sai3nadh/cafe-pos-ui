import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { UserComponent } from './features/user/user.component'; // Updated path
import { EditMenuComponent } from './features/edit-menu/edit-menu.component';
import { AddCustomerComponent } from './features/add-customer/add-customer.component';
import { PendingOrdersComponent } from './features/pending-orders/pending-orders.component';
import { ReportComponent } from './features/report/report.component';
import { DisplayComponent } from './features/display/display.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';

export const routaaes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'user', component: UserComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'edit-menu', component: EditMenuComponent }, // Add the new route
    { path: 'add-customer', component: AddCustomerComponent },  // New route for add customer
    { path: 'pending-orders', component: PendingOrdersComponent },  // New route for add customer
    { path: 'home', component: HomeComponent },
    { path: 'report', component: ReportComponent },
    { path: 'display', component: DisplayComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'inventory',
        loadChildren: () =>
          import('./features/inventory/inventory.module').then(m => m.InventoryModule),
      }
      
    , // Default to Login page
    { path: '**', redirectTo: 'login' } // Wildcard to Login  
];


export const routesOld: Routes = [
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: '', redirectTo: 'user', pathMatch: 'full'  },
        { path: 'user', component: UserComponent },
        { path: 'edit-menu', component: EditMenuComponent },
        { path: 'add-customer', component: AddCustomerComponent },
        { path: 'pending-orders', component: PendingOrdersComponent },
        { path: 'register', component: RegisterComponent },
      
        { path: 'home', component: HomeComponent },
        { path: 'report', component: ReportComponent },
        {
          path: 'inventory',
          loadChildren: () =>
            import('./features/inventory/inventory.module').then(m => m.InventoryModule)
        }
        ,{
          path: 'menu-management',
          loadChildren: () =>
            import('./features/menu-management/menu-management.module').then(m => m.MenuManagementModule)
        }        
        ,  {
          path: 'customers',
          loadChildren: () =>
            import('./features/settings/customer-management/customer-management-routing.module')
              .then(m => m.CustomerManagementRoutingModule)
        },
        {
          path: 'staff',
          loadChildren: () =>
            import('./features/settings/staff-management/staff-management-routing.module')
              .then(m => m.StaffManagementRoutingModule)
        },
         {
          path: 'settings',
          loadChildren: () =>
            import('./features/settings/settings-routing.module')
              .then(m => m.SettingsRoutingModule)
        }
      ]
    },
    {
      path: '',
      component: EmptyLayoutComponent,
      children: [
    //    { path: 'user', component: UserComponent },
       { path: 'login', component: LoginComponent },
        // { path: 'register', component: RegisterComponent },
        // { path: 'pending-orders', component: PendingOrdersComponent },
        { path: 'display', component: DisplayComponent }
      ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
  ];

  
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },

      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'edit-menu', component: EditMenuComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'menu-manager'] } },
      { path: 'add-customer', component: AddCustomerComponent, canActivate: [AuthGuard] , data: { roles: ['admin', 'owner'] } },
      { path: 'pending-orders', component: PendingOrdersComponent, canActivate: [AuthGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'owner'] } },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'report', component: ReportComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },

      {
        path: 'inventory',
        loadChildren: () =>
          import('./features/inventory/inventory.module').then(m => m.InventoryModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'owner', 'inventory'] }
      },
      {
        path: 'menu-management',
        loadChildren: () =>
          import('./features/menu-management/menu-management.module').then(m => m.MenuManagementModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'owner', 'menu-manager'] }
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./features/settings/customer-management/customer-management-routing.module')
            .then(m => m.CustomerManagementRoutingModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'owner'] }
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('./features/settings/staff-management/staff-management-routing.module')
            .then(m => m.StaffManagementRoutingModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'owner'] }
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings-routing.module')
            .then(m => m.SettingsRoutingModule),
        canActivate: [AuthGuard] // general access — internal routes can have RoleGuard
      }
    ]
  },
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'display', component: DisplayComponent }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];