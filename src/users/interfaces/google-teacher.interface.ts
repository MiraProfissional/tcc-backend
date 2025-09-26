import { UserRole } from '../enums/user-role.enum';

export interface GoogleTeacher {
  firstName: string;
  lastName: string;
  email: string;
  googleId: string;
  dateBirth: string;
  cpf: string;
  cellphone: string;
  registrationNumber: number;
  userRole: UserRole;
}
