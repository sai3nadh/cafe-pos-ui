import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Staff } from '../models/staff.model';
import { StaffService } from '../services/staff.service';

@Component({
  selector: 'app-staff-detail',
  imports: [
    CommonModule
  ],
  templateUrl: './staff-detail.component.html',
  styleUrl: './staff-detail.component.scss'
})
export class StaffDetailComponent {
  @Input() staffId: string | null = null;
  @Input() showCloseButton = false;
  @Output() close = new EventEmitter<void>();

  // staff = {
  //   name: 'Jane Doe',
  //   email: 'jane@example.com',
  //   phone: '123-456-7890',
  //   role: 'Manager'
  // };

  staff: Staff | null = null;

  constructor(private staffService: StaffService) {}

  ngOnInit() {
    if (this.staffId) {
      this.staffService.getStaffDetailsById(this.staffId).subscribe({
        next: (data) => this.staff = data,
        error: (err) => console.error('Failed to load staff details', err)
      });
    }
  }
}
