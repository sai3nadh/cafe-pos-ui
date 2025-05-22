export interface StaffProfile {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }
  

  // src/app/models/staff.model.ts
export interface Staff {
    staffId: number;
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
  }
  


export interface StaffUpdateDTO {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
  }
  