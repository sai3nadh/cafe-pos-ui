import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from './register.service';
import { StorageService } from '../../services/storage.service';
import { OrderService } from '../../home/order.service';
import { CommonModule } from '@angular/common';

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
  // roleId: number = 1;  // Example roleId, you might want to map it based on your UI
  selectedRoleId: number | null = 3;
  roles: any[] = [];
  successMessage:string ="";
  errorMessage: string = '';



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
        next: (data) => {
          this.roles = data;
        },
        error: (err) => {
          console.error('Failed to load roles', err);
        }
      });
    }
  handleRegister(): void {
    this.successMessage = '';
    this.errorMessage = '';  
    if (this.name && this.email && this.password && this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
this.errorMessage ="password do not match!!";

setTimeout(() => {
this.errorMessage =''
}, 6000);
        // alert('Passwords do not match!');
      } else {
        // Call the RegisterService to send the data to the backend
        this.registerService.register(this.name, this.password, this.selectedRoleId!).subscribe(
          (response) => {
            console.log('Registration successful:', response);
            this.successMessage = '✅ New user created successfully!';
            // alert('Registration successful!');
            // this.storageService.setLocalVariable('userId', response.userId);
            // this.storageService.setLocalVariable('username', response.username);
            // this.storageService.setLocalVariable('firstName', response.role);
            // this.storageService.setLocalVariable('role', response.role);

            // this.router.navigate(['/login']);  // Navigate to the login page after successful registration
          },
          (error) => {
            console.log('Error during registration:', error);
            this.errorMessage = '❌ Error occurred during registration. Please try again.';

            alert('Error occurred during registration. Please try again.');
          }
        );
      }
    } else {
      alert('Please fill in all fields!');
    }
  }
  
  cancel(){
    this.router.navigate(['/user']);
    console.log('...');
  }
}
