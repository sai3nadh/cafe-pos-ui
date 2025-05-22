import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Staff } from '../models/staff.model';
import { StaffService } from '../services/staff.service';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss'
})
export class StaffListComponent {

  @Output() addStaff = new EventEmitter<void>();
  @Output() editStaff = new EventEmitter<string>();
  @Output() viewStaff = new EventEmitter<string>();

  // staffList = [
  //   { id: 's1', name: 'Alice Johnson', email: 'alice@example.com' },
  //   { id: 's2', name: 'Bob Smith', email: 'bob@example.com' }
  // ];

  staffList: Staff[] = [];

  constructor(private staffService: StaffService) {}

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.staffService.getStaffList().subscribe({
      next: (data) => this.staffList = data,
      error: (err) => console.error('Failed to load staff', err)
    });
  }

  onAdd() {
    this.addStaff.emit();
  }

  onEdit(id: string) {
    this.editStaff.emit(id);
  }

  onView(id: string) {
    this.viewStaff.emit(id);
  }
}
