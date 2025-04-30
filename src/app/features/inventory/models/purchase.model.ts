// purchase-request.model.ts

export interface PurchaseRequest {
    supplierId: number;
    note?: string;
    items: PurchaseItem[];
  
    // Optional: payment fields if you extend
  }
  
  export interface PurchaseItem {
    ingredientId: number;
    quantity: number;
    unitPrice: number;
  }

  
