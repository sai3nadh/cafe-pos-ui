// import { Component, Input } from '@angular/core';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent   implements OnInit {
  @Input() supplierId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  supplierForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      email: [''],
      address: [''],
      gst_number: [''],
      status: ['active']
    });

    if (this.supplierId) {
      // TODO: Replace with real API call
      const supplier = {
        name: 'ABC Foods',
        phone: '9876543210',
        email: 'abc@foods.com',
        address: '123 Market St',
        gst_number: 'GST1234ABC',
        status: 'active'
      };
      this.supplierForm.patchValue(supplier);
    }
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      console.log('Supplier saved:', this.supplierForm.value);
      this.saved.emit();
    }
  }
}
