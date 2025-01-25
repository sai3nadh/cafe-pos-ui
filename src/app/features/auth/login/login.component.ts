import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginService } from './login.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        RouterModule, // Import RouterModule here
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

  constructor(private router: Router, private loginService: LoginService,
     private cd: ChangeDetectorRef
    
  ) {  }

  handleLogin() {
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
  
          // Check for different error status codes
          if (error.status === 401) {
            // Invalid credentials
            alert("Invalid username or password");
            this.loginError = 'Invalid username or password';
          } else {
            // Other types of error
            this.loginError = 'An error occurred. Please try again later.';
          }
          this.cd.detectChanges(); // Manually trigger change detection

          console.log(error.status); // For debugging purposes
        }
      );
    } else {
      alert('Please enter a valid username and password!');
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
