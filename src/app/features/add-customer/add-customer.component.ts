import { Component } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';  // Add this import
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CustomerService } from './add-customer.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';  // Import the Image Compress Service
import { OrderService } from '../home/order.service';

@Component({
  selector: 'app-add-customer',
  imports: [RouterModule
    , CommonModule
            ,FormsModule // To enable ngModel for form binding
    ,ReactiveFormsModule
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
  dropdownVisible = false;
  showOrdersIcon: boolean = false; 
  customerForm: FormGroup;
  selectedImage: File | null = null;
  responseMessage: string = '';
  compressedImage: string | null = null;  // Declare compressedImage property to store base64 string
  compressedBlob: Blob | null = null; // Compressed image as Blob



   constructor(private router: Router,
    private fb: FormBuilder, 
    private adcustomerService: CustomerService,
    //  private orderService: OrderService
       private storageService: StorageService,
       private imageCompress: NgxImageCompressService  // Inject Image Compress Service
       ,private orderService: OrderService
    //  private categoryService : CategoryService
    //   ,private elRef: ElementRef
    //   ,private wsService: WebSocketService
    ) {
      this.customerForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        email: [''],
        phoneNumber: [''],
        address: [''],
        birthday: [''],
        image: [null]
      });
    }
    ngOnInit() {
      this.orderService.checkLogin();
    }
  // cart: Item[] = [];


  // // onFileSelected(event: any): void {
  // //   if (event.target.files.length > 0) {
  // //     this.selectedImage = event.target.files[0];
  // //   }
  // // }

  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Read the file as base64 before compressing
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const fileAsBase64 = e.target.result;  // This is a base64 string
  //       // Compress the image before uploading
  //       this.compressImage(fileAsBase64);
  //     };
  //     reader.readAsDataURL(file);  // Read the file as base64
  //   }
  // }

  //  // Compress Image Method
  //  compressImage(fileAsBase64: string): void {
  //   this.imageCompress.compressFile(fileAsBase64, -1, 50, 50).then(result => {
  //     // The result is the compressed image in base64 format
  //     this.compressedImage = result;
  //     // Optionally, you can convert base64 to Blob for form submission
  //     const imageBlob = this.dataURItoBlob(this.compressedImage);
  //     this.customerForm.patchValue({ image: imageBlob });
  //     this.customerForm.get('image')?.updateValueAndValidity();  // Update the form control validity
  //   });
  // }

  //  // This method is called when an image is selected
  // //  onFileSelected(event: any): void {
  // //   const file = event.target.files[0];
  // //   if (file) {
  // //     // Compress the image before uploading
  // //     this.compressImage(file);
  // //   }
  // // }

  // //  // Compress Image Method
  // //  compressImage(file: File): void {
  // //   this.imageCompress.compressFile(file, -1, 50, 50).then(
  // //     result => {
  // //       // The result is the compressed image in base64 format
  // //       this.compressedImage = result;
  // //       // Optionally, you can convert base64 to Blob for form submission
  // //       const imageBlob = this.dataURItoBlob(this.compressedImage);
  // //       this.customerForm.patchValue({ image: imageBlob });
  // //       this.customerForm.get('image')?.updateValueAndValidity();
  // //     }
  // //   );
  // // }

  // // Convert Base64 to Blob
  // dataURItoBlob(dataURI: string): Blob {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const uintArray = new Uint8Array(arrayBuffer);

  //   for (let i = 0; i < byteString.length; i++) {
  //     uintArray[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([uintArray], { type: 'image/jpeg' });
  // }
  
  // submitForm(): void {
  //   const formData = new FormData();
  //   formData.append('firstName', this.customerForm.get('firstName')?.value);
  //   formData.append('lastName', this.customerForm.get('lastName')?.value);
  //   formData.append('email', this.customerForm.get('email')?.value);
  //   formData.append('phoneNumber', this.customerForm.get('phoneNumber')?.value);
  //   formData.append('address', this.customerForm.get('address')?.value);
  //   formData.append('birthday', this.customerForm.get('birthday')?.value);
    
  //   if (this.selectedImage) {
  //     console.log("file appended");
  //     formData.append('image', this.selectedImage);
  //   }
  //   console.log("Form data:", this.customerForm.value);
  //   this.adcustomerService.addCustomer(formData).subscribe(
  //     (response) => {
  //       this.responseMessage = 'Customer added successfully!';
  //       console.log('Success:', response);
  //     },
  //     (error) => {
  //       this.responseMessage = 'Error adding customer!';
  //       console.error('Error:', error);
  //     }
  //   );
  // }





  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Convert file to Base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result; // Base64 string
        this.compressImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  }

  compressImage(base64Image: string): void {
    this.imageCompress.compressFile(base64Image, -1, 200, 200).then((compressedBase64) => {
      this.compressedImage = compressedBase64;
      this.compressedBlob = this.dataURItoBlob(compressedBase64);
      
      // Update form with compressed image
      this.customerForm.patchValue({ image: this.compressedBlob });
      this.customerForm.get('image')?.updateValueAndValidity();
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: 'image/jpeg' });
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
  

  submitForm(): void {
    const formData = new FormData();
    formData.append('firstName', this.customerForm.get('firstName')?.value);
    formData.append('lastName', this.customerForm.get('lastName')?.value);
    formData.append('email', this.customerForm.get('email')?.value);
    formData.append('phoneNumber', this.customerForm.get('phoneNumber')?.value);
    formData.append('address', this.customerForm.get('address')?.value);
    formData.append('birthday', this.customerForm.get('birthday')?.value);
  
    if (this.compressedImage) {
      this.resizeImage(this.compressedImage).then((resizedImage) => {
        const imageBlob = this.dataURItoBlob(resizedImage);
        formData.append('image', imageBlob, "user-icon.jpg");
        
        this.sendToServer(formData); // Send after resizing
      });
    } else {
      this.sendToServer(formData); // Send without image
    }
  }
  
  // Helper function to send data to server
  sendToServer(formData: FormData) {
    this.adcustomerService.addCustomer(formData).subscribe(
      (response) => {
        this.responseMessage = 'Customer added successfully!';
        console.log('Success:', response);
      },
      (error) => {
        this.responseMessage = 'Error adding customer!';
        console.error('Error:', error);
      }
    );
  }
  
  // submitForm(): void {
  //   const formData = new FormData();
  //   formData.append('firstName', this.customerForm.get('firstName')?.value);
  //   formData.append('lastName', this.customerForm.get('lastName')?.value);
  //   formData.append('email', this.customerForm.get('email')?.value);
  //   formData.append('phoneNumber', this.customerForm.get('phoneNumber')?.value);
  //   formData.append('address', this.customerForm.get('address')?.value);
  //   formData.append('birthday', this.customerForm.get('birthday')?.value);

  //   if (this.compressedBlob) {
  //     console.log('Compressed file appended');
  //     formData.append('image', this.compressedBlob, 'image.jpg');
  //   }

  //   console.log('Form Data:', formData);

  //   this.adcustomerService.addCustomer(formData).subscribe(
  //     (response) => {
  //       this.responseMessage = 'Customer added successfully!';
  //       console.log('Success:', response);
  //     },
  //     (error) => {
  //       this.responseMessage = 'Error adding customer!';
  //       console.error('Error:', error);
  //     }
  //   );
  // }


  //below header functions
  goToHome() {
    // this.cart=[];
    // console.log('Going to Drafts...');
    this.router.navigate(['/user']);
    this.closeDropdown();
  }
  closeDropdown() {
    this.dropdownVisible = false;
  }
  usersmenu() {
    this.router.navigate(['/user']);
    console.log('Users page...');
  }
  // Toggle dropdown visibility
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
// // // Show Zoom Settings Modal
openZoomSettings(): void {
  this.zoomModalVisible = true;
}

// // // Close Zoom Settings Modal
closeZoomSettings(): void {
  this.zoomModalVisible = false;
}
 

zoomLevel = 1; // Default zoom level

zoomModalVisible = false; // Control visibility of the zoom modal

adjustZoom(event: any) {
  this.zoomLevel = event.target.value;
  this.applyZoom();
}

changeZoom(delta: number) {
  this.zoomLevel = Math.min(2, Math.max(0.5, this.zoomLevel + delta));
  // this.applyZoom();
  this.saveAndApplyZoom();

}


applyZoom() {
  // Adjust the zoom level in your application as needed
  document.body.style.zoom = `${this.zoomLevel * 100}%`;
}
saveAndApplyZoom(): void {
  localStorage.setItem('zoomLevel', this.zoomLevel.toString()); // Save zoom level
  this.applyZoom();
}


logout() {
    
  // Clear all session data from storage
  this.storageService.clearAllLocalVariables();
  this.router.navigate(['/login']);
  console.log('Logging out...');
}

}
