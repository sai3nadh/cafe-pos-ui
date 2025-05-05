export interface StockMovement {
    stockMovementId: number;
    ingredientId: number;
    ingredientName: string;
    movementType: 'purchase' | 'adjustment' | 'sale' | 'stock_return';
    reference: string;
    quantity: number;
    note: string;
    createdAt: string; // ISO date string
}
