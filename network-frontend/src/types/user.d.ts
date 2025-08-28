export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
