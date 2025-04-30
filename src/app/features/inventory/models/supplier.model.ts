export interface Supplier {
    supplierId: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    gstNumber?: string;
    status: 'active' | 'inactive';
  }
  