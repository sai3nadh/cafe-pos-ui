import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule, // Import RouterModule here
    HttpClientModule,  // <-- Add this to your imports array

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

  constructor(private router: Router, private loginService: LoginService) {
    alert("opened this page");
  }

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
