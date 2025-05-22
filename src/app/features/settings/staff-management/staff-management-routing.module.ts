import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { StaffFormComponent } from './staff-form/staff-form.component';
import { StaffListComponent } from './staff-list/staff-list.component';

// const routes: Routes = [];
const routes: Routes = [
  {
    path: '',
    component: StaffDashboardComponent,
    children: [
      { path: 'list', component: StaffListComponent },           // /settings/staff
      { path: 'add', component: StaffFormComponent },        // /settings/staff/add
      { path: 'edit/:id', component: StaffFormComponent },   // /settings/staff/edit/123
      { path: ':id', component: StaffDetailComponent }       // /settings/staff/123
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffManagementRoutingModule { }
