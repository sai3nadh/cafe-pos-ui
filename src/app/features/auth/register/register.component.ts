import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from './register.service';
import { StorageService } from '../../services/storage.service';
import { OrderService } from '../../home/order.service';
import { CommonModule } from '@angular/common';
// export interface UserRegistration {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   username: string;
//   password: string;
//   accessPin: string;
//   roleId: number;
// }

export interface UserAccount {
  username: string;
  password: string;
  accessPin: string;
  roleId: number;
}
export interface StaffProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
export interface StaffRegisterPayload {
  user: UserAccount;
  staff: StaffProfile;
}
// export interface UserRegistration extends StaffProfile, UserAccount {}

export interface Role {
  roleId: number;
  name: string;
  description: string;
}


@Component({
    selector: 'app-register',
    imports: [
        FormsModule, // To enable ngModel for form binding
        RouterModule, // To enable routerLink
        CommonModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  selectedRoleId: number | null = 3;
  roles: Role[] = [];
  successMessage:string ="";
  errorMessage: string = '';


  // New fields
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  username: string = '';
  pin: string = '';
  confirmPin: string = '';

  constructor(private router: Router, private registerService: RegisterService
    , private storageService: StorageService
    ,private orderService : OrderService
  ) {}


    ngOnInit() {
      // this.orderService.checkLogin();
      // document.body.style.zoom  ="100%";
      this.loadRoles();
      
    }

    loadRoles() {
      this.registerService.getRoles().subscribe({
        next: (data : Role[]) => {
          this.roles = data.filter(role => role.name !="ADMIN");
        },
        error: (err) => {
          console.error('Failed to load roles', err);
        }
      });
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
  }
    handleRegister() {
      // Basic validation
      if (
        !this.firstName ||
        !this.lastName ||
        !this.email ||
        !this.phoneNumber ||
        !this.username ||
        !this.password ||
        !this.confirmPassword ||
        !this.pin ||
        !this.confirmPin ||
        !this.selectedRoleId
      ) {
        this.errorMessage = 'Please fill in all required fields.';
        this.successMessage = '';
        return;
      }
  
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        this.successMessage = '';
        return;
      }
  
      if (this.pin !== this.confirmPin) {
        this.errorMessage = 'PINs do not match.';
        this.successMessage = '';
        return;
      }
  
      if (!/^\d{4}$/.test(this.pin)) {
        this.errorMessage = 'PIN must be a 4-digit number.';
        this.successMessage = '';
        return;
      }
  
      // const newUser:UserRegistration = {
      //   firstName: this.firstName,
      //   lastName: this.lastName,
      //   email: this.email,
      //   phoneNumber: this.phoneNumber,
      //   username: this.username,
      //   password: this.password,
      //   accessPin: this.pin,
      //   roleId: this.selectedRoleId
      // };
  
      const payload = {
        user: {
          username: this.username,
          password: this.password,
          accessPin: this.pin,
          roleId: this.selectedRoleId
        },
        staff: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber
        }
      };
      
      // Submit to backend
      this.registerService.register(payload).subscribe({
        next: () => {
          this.successMessage = 'User registered successfully!';
          this.errorMessage = '';
          this.resetForm();
        },
        error: (err) => {
          if (err.status === 400 && err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
          // this.errorMessage = err.message;
          // // 'Registration failed. Please try again.';
          this.successMessage = '';
          console.error(err);
        }
      });
    }
  
    cancel() {
      this.resetForm();
      this.successMessage = '';
      this.errorMessage = '';
    }
  
    resetForm() {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.phoneNumber = '';
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.pin = '';
      this.confirmPin = '';
      this.selectedRoleId = 3; // default to 3 again if needed
    }

//   handleRegisterOld(): void {
//     this.successMessage = '';
//     this.errorMessage = '';  
//     if (this.name && this.email && this.password && this.confirmPassword) {
//       if (this.password !== this.confirmPassword) {
// this.errorMessage ="password do not match!!";

// setTimeout(() => {
// this.errorMessage =''
// }, 6000);
//         // alert('Passwords do not match!');
//       } else {
//         // Call the RegisterService to send the data to the backend
//         this.registerService.register(this.name, this.password, this.selectedRoleId!).subscribe(
//           (response) => {
//             console.log('Registration successful:', response);
//             this.successMessage = '✅ New user created successfully!';
//             // alert('Registration successful!');
//             // this.storageService.setLocalVariable('userId', response.userId);
//             // this.storageService.setLocalVariable('username', response.username);
//             // this.storageService.setLocalVariable('firstName', response.role);
//             // this.storageService.setLocalVariable('role', response.role);

//             // this.router.navigate(['/login']);  // Navigate to the login page after successful registration
//           },
//           (error) => {
//             console.log('Error during registration:', error);
//             this.errorMessage = '❌ Error occurred during registration. Please try again.';

//             alert('Error occurred during registration. Please try again.');
//           }
//         );
//       }
//     } else {
//       alert('Please fill in all fields!');
//     }
//   }
  
  // cancel(){
  //   this.router.navigate(['/user']);
  //   console.log('...');
  // }
}
