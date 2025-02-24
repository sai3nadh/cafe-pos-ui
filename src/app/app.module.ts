import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';

import { routes } from './app.routes'; // Import the routes
// import { HttpClientModule } from '@angular/common/http';  // <-- Add this import
import { provideHttpClient } from '@angular/common/http'; // <-- Use provideHttpClient() instead
import { EditMenuComponent } from './features/edit-menu/edit-menu.component';
import { environment } from '../environments/environment';
import { WebSocketService } from './features/services/websocket.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    EditMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes), // Register the routes here
    // HttpClientModule,  // <-- Add HttpClientModule to imports
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:3000'
    })

  ],
  providers: [    
    WebSocketService,
    provideHttpClient() // <-- Provide HttpClient here
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
