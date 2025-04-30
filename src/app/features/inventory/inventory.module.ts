import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryRoutingModule } from './inventory-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  
  imports: [
    
    CommonModule,
    InventoryRoutingModule
,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InventoryRoutingModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class InventoryModule { }
