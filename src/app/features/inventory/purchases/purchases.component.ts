import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { PurchaseDetailComponent } from "./purchase-detail/purchase-detail.component";
import { PurchaseFormComponent } from "./purchase-form/purchase-form.component";
import { PurchaseListComponent } from "./purchase-list/purchase-list.component";

@Component({
    standalone: true,
    selector: 'app-purchases',
    imports: [
      CommonModule,
      PurchaseListComponent,
      PurchaseFormComponent,
      PurchaseDetailComponent
    ],
    templateUrl: './purchases.component.html',
    styleUrls: ['./purchases.component.scss']
  })
  export class PurchasesComponent {
    mode: 'list' | 'form' | 'detail' = 'list';
    selectedPurchaseId?: number;
  
    openForm() {
      this.mode = 'form';
    }
  
    openDetail(id: number) {
      this.selectedPurchaseId = id;
      this.mode = 'detail';
    }
  
    goBack() {
      this.mode = 'list';
      this.selectedPurchaseId = undefined;
    }
  }
  