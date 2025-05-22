import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsDashboardComponent } from './settings-dashboard/settings-dashboard.component';

// const routes: Routes = [];
const routes: Routes = [
  {
    path:'',
    component: SettingsDashboardComponent
  },
  {
    path: 'printers',
    loadChildren: () =>
      import('./printer-settings/printer-settings.module')
        .then(m => m.PrinterSettingsModule)
  }
         
        ,  {
          path: 'customers',
          loadChildren: () =>
            import('./customer-management/customer-management-routing.module')
              .then(m => m.CustomerManagementRoutingModule)
        },
        {
          path: 'staff',
          loadChildren: () =>
            import('./staff-management/staff-management-routing.module')
              .then(m => m.StaffManagementRoutingModule)
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
