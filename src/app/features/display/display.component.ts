import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { StorageService } from '../services/storage.service';
import { OrderService } from '../home/order.service';
import { WebSocketService } from '../services/websocket.service';
import { NotificationApiService } from '../services/notification-api.service';

@Component({
  selector: 'app-display',
  imports: [RouterModule
      , CommonModule
              ,FormsModule // To enable ngModel for form binding
      ,ReactiveFormsModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss'
})
export class DisplayComponent {

   constructor(private router: Router,
      // private fb: FormBuilder, 
      // private adcustomerService: CustomerService,
      //  private orderService: OrderService
         private storageService: StorageService,
        //  private imageCompress: NgxImageCompressService  // Inject Image Compress Service
         private orderService: OrderService
      //  private categoryService : CategoryService
      //   ,private elRef: ElementRef
        ,private wsService: WebSocketService
        ,private notifcationService : NotificationApiService
      ) {
      }
}
