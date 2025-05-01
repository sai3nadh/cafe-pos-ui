// // purchase-request.model.ts

// export interface PurchaseRequest {
//     supplierId: number;
//     note?: string;
//     items: PurchaseItem[];
  
//     // Optional: payment fields if you extend
//      // ✅ New payment-related fields
//   paymentMethodId?: number; // 1 = Cash, 2 = UPI
//   amountPaid?: number;
//   amountDue?: number;
//   }
  
  export interface PurchaseRequest {
    supplierId?: number;  // ✅ Optional now!
    customSupplierName?: string; // ✅ For manual purchases
    isManual: boolean;  // ✅ So backend knows this is manual
  
    purchaseDate: string;  // ✅ Must be sent
  
    note?: string;
    items: PurchaseItem[];
  
    // ✅ Payment fields
    paymentMethodId?: number;
    amountPaid?: number;
    amountDue?: number;
  
    totalAmount: number;  // ✅ Required
  }
  
  export interface PurchaseItem {
    ingredientId: number;
    quantity: number;
    unitPrice: number;
  }

  
