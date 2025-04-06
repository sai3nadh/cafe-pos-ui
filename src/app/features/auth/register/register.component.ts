import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from './register.service';
import { StorageService } from '../../services/storage.service';
import { OrderService } from '../../home/order.service';

@Component({
    selector: 'app-register',
    imports: [
        FormsModule, // To enable ngModel for form binding
        RouterModule, // To enable routerLink
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  roleId: number = 1;  // Example roleId, you might want to map it based on your UI

  constructor(private router: Router, private registerService: RegisterService
    , private storageService: StorageService
    ,private orderService : OrderService
  ) {}


    ngOnInit() {
      this.orderService.checkLogin();
      document.body.style.zoom  ="100";
    }

  handleRegister(): void {
    if (this.name && this.email && this.password && this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
      } else {
        // Call the RegisterService to send the data to the backend
        this.registerService.register(this.name, this.password, this.roleId).subscribe(
          (response) => {
            console.log('Registration successful:', response);
            alert('Registration successful!');
            this.storageService.setLocalVariable('userId', response.userId);
            this.storageService.setLocalVariable('username', response.username);
            this.storageService.setLocalVariable('firstName', response.role);
           
            this.router.navigate(['/login']);  // Navigate to the login page after successful registration
          },
          (error) => {
            console.log('Error during registration:', error);
            alert('Error occurred during registration. Please try again.');
          }
        );
      }
    } else {
      alert('Please fill in all fields!');
    }
  }
  
}
