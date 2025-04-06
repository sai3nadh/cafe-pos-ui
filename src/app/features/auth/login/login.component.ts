import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginService } from './login.service';
import { ChangeDetectorRef } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        RouterModule, // Import RouterModule here
        CommonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  loggedIn: boolean = false;
  isRegister: boolean = false;
  loginError: string = '';
  role: string = '';

  constructor(private router: Router, private loginService: LoginService,
     private cd: ChangeDetectorRef
    , private storageService: StorageService
  ) {  }

   // Implement ngOnInit lifecycle hook
   ngOnInit(): void {
    // Check if user is already logged in by checking stored session variables
    const userId = this.storageService.getLocalVariable('userId');
    const username = this.storageService.getLocalVariable('username');

    if (userId && username) {
      // If user data exists, redirect to home
      this.router.navigate(['/user']);
    }
  }
  
  handleLogin() {
    if (this.username && this.password) {
      // Call the login service to authenticate
      this.loginService.login(this.username, this.password).subscribe(
        (response) => {
          // Handle successful login response
          this.loggedIn = true;
          this.storageService.setLocalVariable('userId', response.userId);
          // this.storageService.setLocalVariable('email', response.email);
          this.storageService.setLocalVariable('username', response.username);
          this.storageService.setLocalVariable('firstName', response.role);
          this.storageService.setLocalVariable('role', response.role);
          // this.storageService.setLocalVariable('lastName', response.lastName);
          
          this.router.navigate(['/user']); // Navigate to home
          // const storedUserId = this.storageService.getLocalVariable('userId');

        },
        (error) => {
          // Handle error if login fails
          this.loggedIn = false;
  
          // Check for different error status codes
          if (error.status === 401) {
            // Invalid credentials
            // alert("Invalid username or password");
            this.loginError = 'Invalid username or password.. Please Try Again!!!';
          } else {
            // Other types of error
            this.loginError = 'An error occurred. Please try again later.';
          }
          this.cd.detectChanges(); // Manually trigger change detection

          console.log(error.status); // For debugging purposes
        }
      );
    } else {
      this.loginError = 'Please enter a valid username and password!';
      // alert('Please enter a valid username and password!');
    }
  }
  
  handleLoginOld() {
    if (this.username && this.password) {
      // Call the login service to authenticate
      this.loginService.login(this.username, this.password).subscribe(
        (response) => {
          // Handle successful login response
          this.loggedIn = true;
          this.router.navigate(['/home']); // Navigate to home
        },
        (error) => {
          // Handle error if login fails
          this.loggedIn = false;
          this.loginError = 'Invalid username or password';
        }
      );
    } else {
      alert('Please enter a valid username and password!');
    }
  }
  // constructor(private router: Router) {}

  // handleLogin() {
  //   if (this.username && this.password) {
  //     this.loggedIn = true;
  //     // Navigate to Home if successful
  //     this.router.navigate(['/home']);
  //   } else {
  //     alert('Please enter a valid username and password!');
  //   }
  // }

}
