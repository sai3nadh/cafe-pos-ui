  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  // import { AddStockComponent } from './stock-list/add-stock/add-stock.component';
  import { StockListComponent } from './stock-list/stock-list.component';
  import { SuppliersComponent } from './suppliers/suppliers.component';
  import { PurchaseDetailComponent } from './purchases/purchase-detail/purchase-detail.component';
  import { PurchaseFormComponent } from './purchases/purchase-form/purchase-form.component';
  import { PurchaseListComponent } from './purchases/purchase-list/purchase-list.component';
  import { StockMovementListComponent } from './stock-movements/stock-movement-list/stock-movement-list.component';
  import { SupplierDetailComponent } from './suppliers/supplier-detail/supplier-detail.component';
  import { SupplierFormComponent } from './suppliers/supplier-form/supplier-form.component';
  import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { PurchasesComponent } from './purchases/purchases.component';

  const routesOld: Routes = [
    { path: '', redirectTo: 'stock-list', pathMatch: 'full' },
  //   { path: 'add-stock', component: AddStockComponent },
    { path: 'suppliers', component: SuppliersComponent },
    { path: 'stock-list', component: StockListComponent }
  ];

  const routes: Routes = [
    { path: '', redirectTo: 'stock-list', pathMatch: 'full' },

    // Stock
    { path: 'stock-list', component: StockListComponent },
    { path: 'stock-movements', component: StockMovementListComponent }, // optional

    // Suppliers
    { path: 'suppliers/dashboard', component: SuppliersComponent },
    { path: 'suppliers', component: SupplierListComponent },
    { path: 'suppliers/add', component: SupplierFormComponent },
    { path: 'suppliers/:id', component: SupplierDetailComponent },

    // Purchases
    { path: 'purchases/dashboard', component: PurchasesComponent },
    { path: 'purchases', component: PurchaseListComponent },
    { path: 'purchases/add', component: PurchaseFormComponent },
    { path: 'purchases/:id', component: PurchaseDetailComponent }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class InventoryRoutingModule {}
