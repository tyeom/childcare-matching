import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

export const RBAC_KEY = 'roles';
export const RBAC = (...roles: Role[]) => SetMetadata(RBAC_KEY, roles);
