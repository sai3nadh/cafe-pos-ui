import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Role, StaffRegisterPayload, StaffUpdatePayload } from '../models/user.model';
import { StaffService } from '../services/staff.service';
import { RoleService } from '../services/role.service';
import { Staff, StaffUpdateDTO } from '../models/staff.model';

@Component({
  selector: 'app-staff-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './staff-form.component.html',
  styleUrl: './staff-form.component.scss'
})
export class StaffFormComponent {
  // @Input() staffId: string | null = null; // null → Add, not null → Edit
  // @Output() saved = new EventEmitter<void>();
  // @Output() cancel = new EventEmitter<void>();

  // form: FormGroup;

  // constructor(private fb: FormBuilder) {
  //   this.form = this.fb.group({
  //     name: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]]
  //   });
  // }

  // ngOnInit() {
  //   if (this.staffId) {
  //     // Simulate fetching existing staff data
  //     this.form.patchValue({
  //       name: 'Jane Doe',
  //       email: 'jane@example.com'
  //     });
  //   }
  // }

  // submit() {
  //   if (this.form.valid) {
  //     console.log('Form submitted:', this.form.value);
  //     this.saved.emit();
  //   } else {
  //     this.form.markAllAsTouched();
  //   }
  // }

  @Input() staffId: string | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  roles: Role[] = [];
  successMessage = '';
  errorMessage = '';
  isEditMode = false;
  private staffToEdit: StaffRegisterPayload | null = null;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private roleService: RoleService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      accessPin: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      confirmPin: ['', Validators.required],
      roleId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadRoles();

    if (this.staffId) {
      this.staffService.getStaffById(this.staffId).subscribe({
        next: (data: StaffRegisterPayload) => {
          console.log("success");
          
          this.staffToEdit = data;
          this.populateForm(data);
            // 🔥 Remove unused controls once we’re sure it's edit mode
          this.form.removeControl('password');
          this.form.removeControl('confirmPassword');
          this.form.removeControl('accessPin');
          this.form.removeControl('confirmPin');

          if (this.form.contains('password')) {
            console.log('Password control exists');
          } else {
            console.log('Password control has been removed');
          }
          
        },
        error: () => {
          this.errorMessage = 'Failed to load staff details.';
        }
      });
    }
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: roles => this.roles = roles.filter(r => r.name !== 'ADMIN'),
      error: () => this.errorMessage = 'Failed to load roles.'
    });
  }

  private populateForm(data: StaffRegisterPayload) {
    this.isEditMode = true;
    const { staff, user } = data;
    this.form.patchValue({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      username: user.username,
      password: '',
      confirmPassword: '',
      accessPin: '',
      confirmPin: '',
      roleId: user.roleId
    });
  }

  private handleResponse(isEdit: boolean) {
    return {
      next: () => {
        this.successMessage = isEdit
          ? 'Staff updated successfully!'
          : 'Staff registered successfully!';
        this.errorMessage = '';
        this.saved.emit();
        this.form.reset();
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Operation failed.';
        this.successMessage = '';
      }
    };
  }
  getSelectedRoleName(roleId: number): string {
    console.log("role Id found:", roleId);
  
    const role = this.roles.find(r => r.roleId == roleId); // == allows number/string match
    console.log("role object found:", role);
    console.log("role name:", role?.name);
  
    return role ? role.name : 'STAFF'; // fallback if not found
  }
  
  submit() {
    const isEdit = this.isEditMode;
    if (this.form.contains('password')) {
      console.log('Password control exists');
    } else {
      console.log('Password control has been removed');
    }
    console.log('Remaining form controls:', Object.keys(this.form.controls));
    Object.entries(this.form.controls).forEach(([name, control]) => {
      if (control.invalid) {
        console.warn(`Control "${name}" is invalid:`, control.errors);
      }
    });
    
    if (this.form.invalid) {
      console.log("failed invalid");
      
      this.form.markAllAsTouched();
      return;
    }
  
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      roleId
    } = this.form.value;
  
    if (!isEdit) {
      const password = this.form.get('password')?.value ?? '';
      const confirmPassword = this.form.get('confirmPassword')?.value ?? '';
      const accessPin = this.form.get('accessPin')?.value ?? '';
      const confirmPin = this.form.get('confirmPin')?.value ?? '';
  
      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
  
      if (accessPin !== confirmPin) {
        this.errorMessage = 'PINs do not match.';
        return;
      }
  
      const registerPayload: StaffRegisterPayload = {
        staff: { firstName, lastName, email, phoneNumber },
        user: { username, password, accessPin, roleId }
      };
  
      this.staffService.registerStaff(registerPayload).subscribe(this.handleResponse(false));
    } else {
      const updatePayload: StaffUpdateDTO = {
        firstName,
        lastName,
        email,
        phoneNumber,
        role: this.getSelectedRoleName(roleId)
      };
  
      this.staffService.updateStaff(this.staffId!, updatePayload).subscribe(this.handleResponse(true));
    }
  }
  
  cancel() {
    this.cancelled.emit();
    this.form.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  openPasswordModal() {
    // TODO: Implement password update modal logic here
    console.log('Open Password Modal');
  }
  
  openPinModal() {
    // TODO: Implement access PIN update modal logic here
    console.log('Open PIN Modal');
  }
  
}
