// Used for full customer data (form, detail, etc.)
export interface CustomerData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address?: string;
    birthday?: string;
    image?: string;
  }
  


export interface CustomerList {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
  }
  

