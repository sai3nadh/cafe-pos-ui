import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,  // To enable ngModel for form binding
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

  constructor(private router: Router) {}

  handleRegister(): void {
    if (this.name && this.email && this.password && this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
      } else {
        console.log('Registration Successful:', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        alert('Registration successful!');
        this.router.navigate(['/login']); // Redirect to login after success
      }
    } else {
      alert('Please fill in all fields!');
    }
  }

}
