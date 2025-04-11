import { AfterViewChecked, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginService } from './login.service';
import { ChangeDetectorRef } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

export interface UserProfile {
  userId: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
}

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
export class LoginComponent implements AfterViewChecked {
  @ViewChild('pinInput') pinInputRef!: ElementRef;

  username: string = '';
  password: string = '';
  loggedIn: boolean = false;
  isRegister: boolean = false;
  loginError: string = '';
  role: string = '';
  isLoading: boolean = false;
  onloadMsg:string ="";

  constructor(private router: Router, private loginService: LoginService,
     private cd: ChangeDetectorRef
    , private storageService: StorageService
  ) {  }
  ngAfterViewChecked(): void {
    
    if (this.selectedUser && this.pinInputRef) {
      this.pinInputRef.nativeElement.focus();
    }
    // throw new Error('Method not implemented.');
  }
  @HostListener('window:keydown.escape', ['$event'])
handleEscapeKey(event: KeyboardEvent) {
  if (this.selectedUser) {
    this.closePinPopup();
  }
}

allowOnlyNumbers(event: KeyboardEvent): void {
  const char = event.key;
  if (!/^\d$/.test(char)) {
    event.preventDefault();
  }
}



   // Implement ngOnInit lifecycle hook
   ngOnInit(): void {
    this.isLoading = true;
    // Check if user is already logged in by checking stored session variables
    const userId = this.storageService.getLocalVariable('userId');
    const username = this.storageService.getLocalVariable('username');

    if (userId && username) {
      // If user data exists, redirect to home
      this.router.navigate(['/user']);
    }

    this.loadProfiles();
  }

  profiles: UserProfile[] = [];
  // selectedUser: UserProfile | null = null;
  // pin: string = '';
  error: string = '';

  selectedUser: UserProfile | null = null;
pin: string = '';

getInitials(firstName: string, lastName: string): string {
  return (firstName?.[0] || '') + (lastName?.[0] || '');
}
selectUser(user: UserProfile) {
  this.selectedUser = user;
  this.pin = '';
  // Show modal (if you're using one)
}
reset(): void {
  this.selectedUser = null;
  this.pin = '';
  this.error = '';
}
closePinPopup(){

  this.reset();
}


onPinChange(): void {
  if (this.pin.length === 4) {
    this.submitPinLogin();
  }
}


submitPinLogin(): void {
this.isLoading = true;
  if (!this.selectedUser || !this.pin)
    { 
      this.isLoading = false;
      return;
    }

  this.loginService.loginWithPin(this.selectedUser.username, this.pin).subscribe({
    next: (res) => {
      // alert(`Welcome ${res.username}`);
      this.storageService.setLocalVariable('userId', res.userId);
      // this.storageService.setLocalVariable('userId', res.userId);
      // this.storageService.setLocalVariable('userId', res.userId);
      this.storageService.setLocalVariable('username', res.username);
      this.storageService.setLocalVariable('firstName', res.firstName);
      this.storageService.setLocalVariable('lastName', res.lastName);
      this.storageService.setLocalVariable('role', res.role);
   
      this.isLoading = false;
      this.router.navigate(['/user']);
    },
    error: (err) => {
      // this.error = 'Invalid PIN';
      this.pin='';
      this.isLoading = false;
      this.error = err.error?.message || 'Login failed. Please try again.';

    }
  });
}

  // submitPinLogin() {
  //   const payload = {
  //     userId: this.selectedUser?.userId,
  //     pin: this.pin
  //   };
  //   alert("payload"+ payload);

  //   // this.http.post('http://localhost:8083/api/auth/pin-login', payload).subscribe(
  //   //   (res: any) => {
  //   //     console.log('Login successful:', res);
  //   //     // Store token/session and redirect to dashboard
  //   //   },
  //   //   err => {
  //   //     console.error('Login failed:', err);
  //   //     alert('Invalid PIN');
  //   //   }
  //   // );

  // }

  loadProfiles(){
    this.onloadMsg="Please wait...";
    this.loginService.getProfiles().subscribe({
      next: (res) => {this.profiles = res;
         this.isLoading = false;
         this.onloadMsg = "";
      },
      error: () => {
        this.error = 'Failed to load profiles.';
        this.isLoading = false;

        this.onloadMsg="Please Contact Administrator...";
      }
    });
    // this.isLoading = false;
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
  
  // handleLoginOld() {
  //   if (this.username && this.password) {
  //     // Call the login service to authenticate
  //     this.loginService.login(this.username, this.password).subscribe(
  //       (response) => {
  //         // Handle successful login response
  //         this.loggedIn = true;
  //         this.router.navigate(['/home']); // Navigate to home
  //       },
  //       (error) => {
  //         // Handle error if login fails
  //         this.loggedIn = false;
  //         this.loginError = 'Invalid username or password';
  //       }
  //     );
  //   } else {
  //     alert('Please enter a valid username and password!');
  //   }
  // }
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
