import { Role } from '@app/common/enums/role-enum';

export class UserDto {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
