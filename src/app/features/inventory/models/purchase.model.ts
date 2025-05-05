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

// this interface is to display in the purchase list

  export interface PurchaseResponse {
    purchaseId: number;
    purchaseNumber: string;     // 👈 NEW field
    supplierId?: number; // Optional because it can be null for manual suppliers
    supplierName: string;
    totalAmount: number;
    paidAmount: number;
    status: 'unpaid' | 'partial' | 'paid';
    note: string;
    // createdAt: string;  // ISO string (convert to Date if needed)
    // updatedAt: string;  // ISO string
    purchaseDate: string;
    items: ItemDetail[];
    payments: PaymentDetail[];
  }
  
  export interface ItemDetail {
    ingredientName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }
  
  export interface PaymentDetail {
    method: string;
    amount: number;
    paidAt: string; // ISO string
  }
  
  

  export interface PurchasePaymentRequest {
    paymentMethodId: number;
    amount: number;
    note: string;
  }
  