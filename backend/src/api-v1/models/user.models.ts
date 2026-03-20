export enum UserRole {
  Admin = "admin",
  Student = "student",
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  hashed_password: string;
  role: UserRole;
  forgot_password: boolean;
  is_verified: boolean;
  is_welcomed: boolean;
  is_leaving: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// change this into a token eventually
export interface IPayload {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}
