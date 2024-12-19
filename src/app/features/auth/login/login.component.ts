import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
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

  constructor(private router: Router) {}

  handleLogin() {
    if (this.username && this.password) {
      this.loggedIn = true;
      // Navigate to Home if successful
      this.router.navigate(['/home']);
    } else {
      alert('Please enter a valid username and password!');
    }
  }

}
