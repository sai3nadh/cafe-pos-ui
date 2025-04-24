import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStockComponent } from './add-stock/add-stock.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

const routes: Routes = [
  { path: '', redirectTo: 'stock-list', pathMatch: 'full' },
  { path: 'add-stock', component: AddStockComponent },
  { path: 'suppliers', component: SuppliersComponent },
  { path: 'stock-list', component: StockListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}
