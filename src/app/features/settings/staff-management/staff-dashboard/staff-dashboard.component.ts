import { Component } from '@angular/core';
import { StaffDetailComponent } from "../staff-detail/staff-detail.component";
import { StaffFormComponent } from "../staff-form/staff-form.component";
import { StaffListComponent } from "../staff-list/staff-list.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StaffDetailComponent, StaffFormComponent, StaffListComponent],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.scss'
})
export class StaffDashboardComponent {
  mode: 'list' | 'form' | 'detail' = 'list';
  selectedStaffId: string | null = null;

  openForm(id?: string) {
    this.selectedStaffId = id || null;
    this.mode = 'form';
  }

  openDetail(id: string) {
    this.selectedStaffId = id;
    this.mode = 'detail';
  }

  goBack() {
    this.mode = 'list';
    this.selectedStaffId = null;
  }
}
