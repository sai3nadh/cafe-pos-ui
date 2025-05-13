export interface MenuItem {
    menuItemId: number;
    name: string;
    description?: string;
    price: number;
    imagePath?: string;
    kitchenItem: boolean;
    version?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  