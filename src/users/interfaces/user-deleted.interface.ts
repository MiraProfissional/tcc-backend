import { UserType } from '../enums/user-type.enum';

export interface UserDeleted {
  deleted: boolean;
  softDeleted: boolean;
  userId: number;
  userType: UserType;
}
