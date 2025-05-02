// import { Component, Input } from '@angular/core';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';

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

  constructor(private fb: FormBuilder,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      email: [''],
      address: [''],
      gstNumber: [''],
      status: ['active']
    });

    if (this.supplierId) {
      // 🔥 Call the real API to get supplier data
      this.supplierService.getSupplierById(this.supplierId).subscribe({
        next: (supplier: Supplier) => {
          console.log('Loaded supplier for editing:', supplier);
          this.supplierForm.patchValue({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
            gstNumber: supplier.gstNumber,
            status: supplier.status
          });
        },
        error: (err) => {
          console.error('Error loading supplier:', err);
        }
      });
    }
    // if (this.supplierId) {
    //   // TODO: Replace with real API call
    //   // const supplier = {
    //   //   name: 'ABC Foods',
    //   //   phone: '9876543210',
    //   //   email: 'abc@foods.com',
    //   //   address: '123 Market St',
    //   //   gstNumber: 'GST1234ABC',
    //   //   status: 'active'
    //   // };
    //   // this.supplierForm.patchValue(supplier);
    // }
  }

  // onSubmit() {
  //   if (this.supplierForm.valid) {
  //     console.log('Supplier saved:', this.supplierForm.value);
  //     this.saved.emit();
  //   }
  // }

  // onSubmit() {
  //   if (this.supplierForm.valid) {
  //     const supplierData = this.supplierForm.value;
  
  //     // 🔥 Call the backend POST API
  //     this.supplierService.createSupplier(supplierData).subscribe({
  //       next: (savedSupplier) => {
  //         console.log('Supplier saved successfully:', savedSupplier);
  //         this.saved.emit(); // To notify parent component
  //       },
  //       error: (err) => {
  //         console.error('Error saving supplier:', err);
  //       }
  //     });
  //   }
  // }
  
  // onSubmit() {
  //   if (this.supplierForm.valid) {
  //     const supplierData = this.supplierForm.value;
  
  //     if (supplierData.id) {
  //       // ✅ Update existing supplier
  //       this.supplierService.updateSupplier(supplierData.id, supplierData).subscribe({
  //         next: (updatedSupplier) => {
  //           console.log('Supplier updated successfully:', updatedSupplier);
  //           this.saved.emit();
  //         },
  //         error: (err) => {
  //           console.error('Error updating supplier:', err);
  //         }
  //       });
  //     } else {
  //       // ✅ Create new supplier
  //       this.supplierService.createSupplier(supplierData).subscribe({
  //         next: (savedSupplier) => {
  //           console.log('Supplier saved successfully:', savedSupplier);
  //           this.saved.emit();
  //         },
  //         error: (err) => {
  //           console.error('Error saving supplier:', err);
  //         }
  //       });
  //     }
  //   }
  // }
  
  onSubmit() {
    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;
  
      if (this.supplierId) {
        // ✅ Update existing supplier
        this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
          next: (updatedSupplier) => {
            console.log('Supplier updated successfully:', updatedSupplier);
            this.saved.emit();
          },
          error: (err) => {
            console.error('Error updating supplier:', err);
          }
        });
      } else {
        // ✅ Create new supplier
        this.supplierService.createSupplier(supplierData).subscribe({
          next: (savedSupplier) => {
            console.log('Supplier saved successfully:', savedSupplier);
            this.saved.emit();
          },
          error: (err) => {
            console.error('Error saving supplier:', err);
          }
        });
      }
    } else {
      console.warn('Form is invalid.');
    }
  }
  
}
