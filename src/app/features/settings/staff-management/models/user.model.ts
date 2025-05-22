import { StaffProfile } from "./staff.model";

export interface UserAccount {
    username: string;
    password: string;
    accessPin: string;
    roleId: number;
  }
  
  export interface StaffRegisterPayload {
    staff: StaffProfile;
    user: UserAccount;
  }
  
  export interface Role {
    roleId: number;
    name: string;
    description: string;
  }
  

  export interface StaffUpdatePayload {
    staff: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    user: {
      username: string;
      roleId: number;
    };
  }
  