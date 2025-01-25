import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';

import { routes } from './app.routes'; // Import the routes
import { HttpClientModule } from '@angular/common/http';  // <-- Add this import

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes), // Register the routes here
    HttpClientModule,  // <-- Add HttpClientModule to imports

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
