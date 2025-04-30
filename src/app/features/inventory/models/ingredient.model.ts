export interface Ingredient {
    ingredientId: number;
    name: string;
    unit: string;
    currentStock: number;
    isInternal: boolean;
    status: 'active' | 'inactive';
  }
  