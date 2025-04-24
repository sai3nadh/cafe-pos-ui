import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryRoutingModule } from './inventory-routing.module';


@NgModule({
  
  imports: [
    
    CommonModule,
    InventoryRoutingModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class InventoryModule { }
