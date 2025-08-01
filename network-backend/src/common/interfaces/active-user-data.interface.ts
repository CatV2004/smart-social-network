import { UserRole } from "@/modules/users/entities/user.entity";

export interface ActiveUserData {
  id: string;
  email: string;
  role: UserRole;
  tokenId: string;
}