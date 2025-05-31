import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { StorageService } from '../services/storage.service';
import { OrderService } from '../home/order.service';
import { WebSocketService } from '../services/websocket.service';
import { NotificationApiService } from '../services/notification-api.service';
import { ReadyOrdersDisplayComponent } from "./ready-orders-display/ready-orders-display.component";
import { MenuDisplayComponent } from "./menu-display/menu-display.component";

@Component({
  selector: 'app-display',
  imports: [RouterModule,
    CommonModule,
    FormsModule // To enable ngModel for form binding
    ,
    ReactiveFormsModule, 
    ReadyOrdersDisplayComponent, MenuDisplayComponent],
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

       hasOrders = false;
onOrderPresenceChanged(present: boolean) {
  this.hasOrders = present;
  console.log("hasorders"+ this.hasOrders);
  
}

  // ngOnInit() {
  //   this.checkOrders();
  // }

  // checkOrders() {
  //   this.orderService.getReadyOrdersToday().subscribe(data => {
  //     this.hasOrders = data.length > 0;
  //   });
  // }
}
