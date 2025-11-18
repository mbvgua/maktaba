export enum UserRole {
  Admin = "admin",
  Teacher = "teacher",
  Student = "student",
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  hashed_password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_deleted: boolean;
}
