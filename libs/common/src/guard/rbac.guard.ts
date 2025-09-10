import { ExecutionContext } from '@nestjs/common';
import { RBAC_KEY } from '../decorator/rbac.decorator';

import { Reflector } from '@nestjs/core';

import { CanActivate } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { Role } from '../enums';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>(RBAC_KEY, context.getHandler());

    if (!roles || roles.length === 0) {
      // 메타데이터 없으면 통과
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = request.user;
    if (!user) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return roles.includes(user.role);
  }
}
