import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';  // Import the Image Compress Service


@Component({
  selector: 'app-customer-form',
  // standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule // ✅ ADD THIS
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  // @Input() customerId: string | null = null;
  // @Input() customerId: string | null = null;
  // @Output() saved = new EventEmitter<void>();
  // @Output() cancel = new EventEmitter<void>();

  // customerForm!: FormGroup;
  // isEditMode = false;
  // submitted = false;
  // selectedImage: File | null = null;


  // constructor(
  //   private fb: FormBuilder,
  //   private customerService: CustomerService,
  //   private imageCompress: NgxImageCompressService // ✅
  // ) {}

  // ngOnInit() {
  //   this.customerForm = this.fb.group({
  //     firstName: ['', Validators.required],
  //     lastName: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]],
  //     phoneNumber: ['', Validators.required],
  //     address: ['', Validators.required],
  //     birthday: ['']
  //   });

  //   if (this.customerId) {
  //     this.isEditMode = true;
  //     this.loadCustomer();
  //   }
  // }

  // loadCustomer() {
  //   this.customerService.getCustomerById(this.customerId!).subscribe({
  //     next: (customer) => this.customerForm.patchValue(customer),
  //     error: () => console.error('Failed to load customer')
  //   });
  // }

  // // onSubmit() {
  // //   this.submitted = true;
  // //   if (this.customerForm.invalid) return;

  // //   const formData = this.customerForm.value;

  // //   const request$ = this.isEditMode
  // //     ? this.customerService.updateCustomer(this.customerId!, formData)
  // //     : this.customerService.addCustomer(formData);

  // //   request$.subscribe({
  // //     next: () => this.saved.emit(),
  // //     error: () => console.error('Failed to save customer')
  // //   });
  // // }

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.customerForm.invalid) return;
  
  //   const formData = new FormData();
  
  //   Object.entries(this.customerForm.value).forEach(([key, value]) => {
  //     if (value !== null && value !== undefined) {
  //       formData.append(key, value as string);
  //     }
  //   });
  
  //   // 👇 Append compressed image if available
  //   if (this.selectedImage) {
  //     formData.append('image', this.selectedImage);
  //   }
  
  //   const request$ = this.isEditMode
  //     ? this.customerService.updateCustomer(this.customerId!, formData)
  //     : this.customerService.addCustomer(formData);
  
  //   request$.subscribe({
  //     next: () => this.saved.emit(),
  //     error: () => console.error('Failed to save customer')
  //   });
  // }
  
  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  
  //   if (file && file.type.startsWith('image/')) {
  //     this.compressImage(file).then((compressedBlob) => {
  //       const compressedFile = new File([compressedBlob], file.name, {
  //         type: file.type,
  //         lastModified: Date.now()
  //       });
  //       this.selectedImage = compressedFile;
  //     });
  //   }
  // }
  // compressImage(file: File): Promise<Blob> {
  //   const maxWidth = 800;
  //   const maxHeight = 800;
  //   const quality = 0.7;
  
  //   return new Promise((resolve, reject) => {
  //     const image = new Image();
  //     const reader = new FileReader();
  
  //     reader.onload = (event: any) => {
  //       image.src = event.target.result;
  //     };
  
  //     image.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       let width = image.width;
  //       let height = image.height;
  
  //       // Maintain aspect ratio
  //       if (width > height) {
  //         if (width > maxWidth) {
  //           height *= maxWidth / width;
  //           width = maxWidth;
  //         }
  //       } else {
  //         if (height > maxHeight) {
  //           width *= maxHeight / height;
  //           height = maxHeight;
  //         }
  //       }
  
  //       canvas.width = width;
  //       canvas.height = height;
  
  //       const ctx = canvas.getContext('2d');
  //       ctx?.drawImage(image, 0, 0, width, height);
  
  //       canvas.toBlob((blob) => {
  //         if (blob) resolve(blob);
  //         else reject(new Error('Compression failed'));
  //       }, file.type, quality);
  //     };
  
  //     reader.readAsDataURL(file);
  //   });
  // }
    
  // onCancel() {
  //   this.cancel.emit();
  // }

  @Input() customerId: string | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  customerForm!: FormGroup;
  compressedImage: string | null = null;
  compressedBlob: Blob | null = null;
  submitted = false;
  isEditMode = false;
  isSuccess = false;
  isLoading = false;
  responseMessage = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      birthday: ['', Validators.required],
      image: [null]
    });

    // if (this.customerId) {
    //   this.isEditMode = true;
    //   this.customerService.getCustomerById(this.customerId).subscribe({
    //     next: (data) => this.customerForm.patchValue(data),
    //       // ✅ Auto-show image if available
    //   if (data.imageUrl) {
    //     this.compressedImage = data.imageUrl; // must be a full image URL
    //   }
    //   });
    // }

    if (this.customerId) {
      this.isEditMode = true;
      this.customerService.getCustomerById(this.customerId).subscribe({
        next: (data) => {
          this.customerForm.patchValue(data);
    
          // ✅ Auto-show image if available
          if (data.image) {
            // this.compressedImage = data.image; // must be a full image URL
            this.compressedImage = `data:image/jpeg;base64,${data.image}`;

          }
        }
      });
    }
    
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => this.compressImage(e.target.result);
    reader.readAsDataURL(file);
  }

  // compressImage(base64Image: string): void {
  //   this.imageCompress.compressFile(base64Image, -1, 250, 250).then((compressedBase64) => {
  //     this.compressedImage = compressedBase64;
  //     this.compressedBlob = this.dataURItoBlob(compressedBase64);
  //     this.customerForm.patchValue({ image: this.compressedBlob });
  //   });
  // }

  compressImage(base64Image: string): void {
    this.imageCompress.compressFile(base64Image, -1, 250, 250).then((compressedBase64) => {
      this.resizeImage(compressedBase64).then((resizedBase64) => {
        this.compressedImage = resizedBase64;
        this.compressedBlob = this.dataURItoBlob(resizedBase64);
        this.customerForm.patchValue({ image: this.compressedBlob });
      });
    });
  }
  resizeImage(base64: string, maxWidth = 50, maxHeight = 50) {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        ctx?.drawImage(img, 0, 0, maxWidth, maxHeight);
  
        resolve(canvas.toDataURL("image/jpeg", 0.5)); // Lower quality JPEG
      };
    });
  }
  // resizeImagse(base64: string, maxWidth = 250, maxHeight = 250): Promise<string> {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = base64;
  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");
  
  //       // Maintain aspect ratio
  //       let width = img.width;
  //       let height = img.height;
  
  //       if (width > height) {
  //         if (width > maxWidth) {
  //           height *= maxWidth / width;
  //           width = maxWidth;
  //         }
  //       } else {
  //         if (height > maxHeight) {
  //           width *= maxHeight / height;
  //           height = maxHeight;
  //         }
  //       }
  
  //       canvas.width = width;
  //       canvas.height = height;
  
  //       ctx?.drawImage(img, 0, 0, width, height);
  //       resolve(canvas.toDataURL("image/jpeg", 0.7)); // Adjust quality if needed
  //     };
  //   });
  // }
  
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: 'image/jpeg' });
  }

  // dataURItoBlob(dataURI: string): Blob {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const uintArray = new Uint8Array(arrayBuffer.length);

  //   for (let i = 0; i < byteString.length; i++) {
  //     uintArray[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([uintArray], { type: 'image/jpeg' });
  // }

  onSubmit(): void {
    this.submitted = true;
    if (this.customerForm.invalid) return;

    const formData = new FormData();
    Object.entries(this.customerForm.value).forEach(([key, value]) => {
      if (value !== null && key !== 'image') {
        formData.append(key, value as string);
      }
    });

    if (this.compressedBlob) {
      formData.append('image', this.compressedBlob, 'user-icon.jpg');
    }

    this.isLoading = true;

    const request$ = this.isEditMode
      ? this.customerService.updateCustomer(this.customerId!, formData)
      : this.customerService.addCustomer(formData);

    request$.subscribe({
      next: () => {
        this.responseMessage = this.isEditMode ? 'Customer updated!' : 'Customer added!';
        this.isSuccess = true;
        this.saved.emit();
        this.customerForm.reset();
        this.compressedImage = null;
        this.isLoading = false;
        setTimeout(() => (this.responseMessage = ''), 5000);
      },
      error: (err) => {
        this.responseMessage = err?.error?.message || 'Failed to save customer';
        this.isSuccess = false;
        this.isLoading = false;
        setTimeout(() => (this.responseMessage = ''), 5000);
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
